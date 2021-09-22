import moment from "moment";
import SalarySurveyServiceImp from "interfaces/salarySurveyService";
import {
  RawGetSalarySurveyRequest,
  RawPatchSalarySurvey,
  RawSalarySurvey,
  RawSalarySurveyResponse,
  SALARY_SURVEY_FIELD,
  SURVEY_RESULT_FORMAT,
} from "interfaces/rawSalarySurvey";
import {
  GetAgeGroup,
  GetCurrency,
  GetWorkExperienceYear,
} from "interfaces/constantService";
import {
  AverageAnnualSalaryResponse,
  AverageAnnualSalaryRequest,
  SalaryService,
} from "interfaces/salaryService";

import { SurveyResult, SurveyResultId } from "entity/SurveyResult";
import { PersonalInfo } from "entity/PersonalInfo";
import { getConnection, getRepository, QueryRunner } from "typeorm";
import { JobInfo } from "entity/JobInfo";
import { SalaryInfo } from "entity/SalaryInfo";

import allSettled, {
  PromiseStatus,
  PromiseFulfilledResult,
  PromiseRejectedResult,
} from "libs/promiseAllSettled";

class SalarySurveyService implements SalarySurveyServiceImp {
  ageGroupService: GetAgeGroup;
  currencyService: GetCurrency;
  workExperienceYearService: GetWorkExperienceYear;
  salaryService: SalaryService;

  constructor({
    ageGroupService,
    currencyService,
    workExperienceYearService,
    salaryService,
  }: {
    ageGroupService: GetAgeGroup;
    currencyService: GetCurrency;
    workExperienceYearService: GetWorkExperienceYear;
    salaryService: SalaryService;
  }) {
    this.ageGroupService = ageGroupService;
    this.currencyService = currencyService;
    this.workExperienceYearService = workExperienceYearService;
    this.salaryService = salaryService;
  }

  public async createSingleSurveyResult(
    rawSalarySurvey: RawSalarySurvey
  ): Promise<SurveyResult> {
    console.log("creating survey result...");
    const queryRunner = getConnection().createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const result = await this.createSurveyResult(
        rawSalarySurvey,
        queryRunner
      );
      // finish all the transactions, commit and release
      await queryRunner.commitTransaction();
      await queryRunner.release();
      // return SurveyResult
      return result;
    } catch (err) {
      // error occurs, roll back and release
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err;
    }
  }

  public async createBatchSurveyResult(
    rawSalarySurveys: RawSalarySurvey[],
    batchSize: number = 100
  ): Promise<SurveyResult[]> {
    const clonedData = [...rawSalarySurveys];
    const results: SurveyResult[] = [];
    while (clonedData.length > 0) {
      const queryRunner = getConnection().createQueryRunner();
      const batch = clonedData.splice(0, batchSize);
      console.log(`creating survey results with batch size ${batch.length}`);
      try {
        await queryRunner.startTransaction();
        const groupPromises: Promise<SurveyResult>[] = batch.map((data) =>
          this.createSurveyResult(data, queryRunner)
        );
        const promiseResults = await allSettled<SurveyResult>(groupPromises);
        const rejectedPromiseResult = promiseResults.find(
          (promise) => promise.status === PromiseStatus.Fail
        );
        if (rejectedPromiseResult) {
          throw (rejectedPromiseResult as PromiseRejectedResult).reason;
        }
        promiseResults.forEach((result: PromiseFulfilledResult<SurveyResult>) =>
          results.push(result.value)
        );
        // finish all the transactions, commit and release
        await queryRunner.commitTransaction();
        await queryRunner.release();
      } catch (err) {
        console.log(
          "break at data index ",
          rawSalarySurveys.length - clonedData.length - batch.length
        );
        // error occurs, roll back and release
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw err;
      }
    }
    console.log(`created total ${rawSalarySurveys.length} survey results`);
    return results;
  }

  public async getSurveyResult({
    id,
    format = SURVEY_RESULT_FORMAT.OBJECT,
  }: RawGetSalarySurveyRequest): Promise<
    SurveyResult | RawSalarySurveyResponse
  > {
    const result = await getRepository(SurveyResult)
      .createQueryBuilder("surveyResult")
      .leftJoinAndSelect("surveyResult.jobInfo", "jobInfo")
      .leftJoinAndSelect("surveyResult.salaryInfo", "salaryInfo")
      .leftJoinAndSelect("surveyResult.personalInfo", "personalInfo")
      .leftJoinAndSelect("salaryInfo.currency", "currency")
      .leftJoinAndSelect("personalInfo.ageGroup", "ageGroup")
      .leftJoinAndSelect(
        "personalInfo.workExperienceYear",
        "workExperienceYear"
      )
      .where({ id: id })
      .getOneOrFail();
    if (format === SURVEY_RESULT_FORMAT.OBJECT) {
      return result;
    }
    return await this.convertRawFormat(result);
  }

  public async getAverageAnnualSalary(
    averageAnnualSalaryRequest: AverageAnnualSalaryRequest
  ): Promise<AverageAnnualSalaryResponse> {
    const currency = averageAnnualSalaryRequest.currency || "USD";
    const targetCurrency = await this.currencyService.getConstant(currency);
    return await this.salaryService.getAverageAnnualSalary(
      averageAnnualSalaryRequest,
      targetCurrency
    );
  }

  public async updateSurveyResultById(
    surveyResultId: SurveyResultId,
    rawPatchSalarySurvey: RawPatchSalarySurvey
  ): Promise<SurveyResult> {
    const surveyResult = (await this.getSurveyResult({
      id: surveyResultId,
    })) as SurveyResult;
    const queryRunner = getConnection().createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const updateSurveyResult = await this.updateSurveyResult(
        surveyResult,
        rawPatchSalarySurvey,
        queryRunner
      );
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return updateSurveyResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  /** Create Survey Result */
  /**
   * @description create survey result and save to database
   * @param rawSalarySurvey
   * @param queryRunner
   * @returns Promise<SurveyResult>
   */
  private async createSurveyResult(
    rawSalarySurvey: RawSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<SurveyResult> {
    const promiseResults = await allSettled<
      PersonalInfo | JobInfo | SalaryInfo
    >([
      this.createPersonalInfo(rawSalarySurvey, queryRunner),
      this.createJobInfo(rawSalarySurvey, queryRunner),
      this.createSalaryInfo(rawSalarySurvey, queryRunner),
    ]);
    const rejectedPromiseResult = promiseResults.find(
      (promise) => promise.status === PromiseStatus.Fail
    );
    if (rejectedPromiseResult) {
      throw (rejectedPromiseResult as PromiseRejectedResult).reason;
    }
    // retrieve back the promise result
    const personalInfo = (
      promiseResults[0] as PromiseFulfilledResult<PersonalInfo>
    ).value;
    const jobInfo = (promiseResults[1] as PromiseFulfilledResult<JobInfo>)
      .value;
    const salaryInfo = (promiseResults[2] as PromiseFulfilledResult<SalaryInfo>)
      .value;

    // create survey result object
    const surveryResult = new SurveyResult();
    surveryResult.recordTimestamp = new Date(
      rawSalarySurvey[SALARY_SURVEY_FIELD.RECORD_TIMESTAMP]
    );
    surveryResult.jobInfo = jobInfo;
    surveryResult.personalInfo = personalInfo;
    surveryResult.salaryInfo = salaryInfo;
    return await queryRunner.manager.save(surveryResult);
  }

  /**
   * @description create personal info and save to database
   * @param rawSalarySurvey
   * @param queryRunner
   * @returns Promise<PersonalInfo>
   */
  private async createPersonalInfo(
    rawSalarySurvey: RawSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<PersonalInfo> {
    const [ageGroup, workExperienceYear] = await Promise.all([
      this.ageGroupService.getConstant(
        rawSalarySurvey[SALARY_SURVEY_FIELD.AGE_GROUP]
      ),
      this.workExperienceYearService.getConstant(
        rawSalarySurvey[SALARY_SURVEY_FIELD.WORK_EXPERIENCE_YEAR]
      ),
    ]);
    const personalInfo = new PersonalInfo();
    personalInfo.ageGroup = ageGroup;
    personalInfo.workExperienceYear = workExperienceYear;
    personalInfo.location = rawSalarySurvey[SALARY_SURVEY_FIELD.LOCATION];
    return await queryRunner.manager.save(personalInfo);
  }

  /**
   * @description create job info and save to database
   * @param rawSalarySurvey
   * @param queryRunner
   * @returns Promise<JobInfo>
   */
  private async createJobInfo(
    rawSalarySurvey: RawSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<JobInfo> {
    const jobInfo = new JobInfo();
    jobInfo.industry = rawSalarySurvey[SALARY_SURVEY_FIELD.INDUSTRY];
    jobInfo.title = rawSalarySurvey[SALARY_SURVEY_FIELD.JOB_TITLE];
    jobInfo.titleRemark = rawSalarySurvey[SALARY_SURVEY_FIELD.JOB_REMARK];
    return await queryRunner.manager.save(jobInfo);
  }

  /**
   * @description create salary info and save to database
   * @param rawSalarySurvey
   * @param queryRunner
   * @returns Promise<SalaryInfo>
   */
  private async createSalaryInfo(
    rawSalarySurvey: RawSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<SalaryInfo> {
    const salaryInfo = new SalaryInfo();
    const rawCurrency = rawSalarySurvey[SALARY_SURVEY_FIELD.CURRENCY];
    const rawAnnualSalary = rawSalarySurvey[SALARY_SURVEY_FIELD.ANNUAL_SALARY];
    const currencyRemark = rawSalarySurvey[SALARY_SURVEY_FIELD.CURRENCY_REMARK];
    const [currency, annualSalary] = await Promise.all([
      this.currencyService.getConstant(rawCurrency),
      this.salaryService.parseAnnualSalary(rawAnnualSalary),
    ]);
    salaryInfo.annualSalary = annualSalary;
    salaryInfo.rawAnnualSalary = rawAnnualSalary;
    salaryInfo.currency = currency;
    salaryInfo.currencyRemark = currencyRemark;
    return await queryRunner.manager.save(salaryInfo);
  }

  /** Update salary info */
  /**
   * @description update salary info and save to database
   * @param surveyResult survey result need to update
   * @param rawPatchSalarySurvey update survey result raw data
   * @param queryRunner
   */
  private async updateSurveyResult(
    surveyResult: SurveyResult,
    rawPatchSalarySurvey: RawPatchSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<SurveyResult> {
    const { salaryInfo, personalInfo, jobInfo } = surveyResult;
    const groupPromises = [
      this.updateJobInfo(jobInfo, rawPatchSalarySurvey, queryRunner),
      this.updateSalaryInfo(salaryInfo, rawPatchSalarySurvey, queryRunner),
      this.updatePersonalInfo(personalInfo, rawPatchSalarySurvey, queryRunner),
    ];
    const promiseResults = await allSettled<
      PersonalInfo | JobInfo | SalaryInfo
    >(groupPromises);
    const rejectedPromiseResult = promiseResults.find(
      (promise) => promise.status === PromiseStatus.Fail
    );
    if (rejectedPromiseResult) {
      throw (rejectedPromiseResult as PromiseRejectedResult).reason;
    }
    const updatedJobInfo = (
      promiseResults[0] as PromiseFulfilledResult<JobInfo>
    ).value;
    const updatedSalaryInfo = (
      promiseResults[1] as PromiseFulfilledResult<SalaryInfo>
    ).value;
    const updatedPersonalInfo = (
      promiseResults[2] as PromiseFulfilledResult<PersonalInfo>
    ).value;
    surveyResult.jobInfo = updatedJobInfo;
    surveyResult.salaryInfo = updatedSalaryInfo;
    surveyResult.personalInfo = updatedPersonalInfo;
    if (SALARY_SURVEY_FIELD.RECORD_TIMESTAMP in rawPatchSalarySurvey) {
      surveyResult.recordTimestamp = new Date(
        rawPatchSalarySurvey[SALARY_SURVEY_FIELD.RECORD_TIMESTAMP]
      );
    }
    return await queryRunner.manager.save(surveyResult);
  }

  /**
   * @description update salary info and save to database
   * @param salaryInfo salary info need to update
   * @param rawPatchSalarySurvey update salary info raw data
   * @param queryRunner
   * @returns
   */
  private async updateSalaryInfo(
    salaryInfo: SalaryInfo,
    rawPatchSalarySurvey: RawPatchSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<SalaryInfo> {
    if (SALARY_SURVEY_FIELD.ANNUAL_SALARY in rawPatchSalarySurvey) {
      salaryInfo.annualSalary = await this.salaryService.parseAnnualSalary(
        rawPatchSalarySurvey[SALARY_SURVEY_FIELD.ANNUAL_SALARY]
      );
      salaryInfo.rawAnnualSalary =
        rawPatchSalarySurvey[SALARY_SURVEY_FIELD.ANNUAL_SALARY];
    }
    if (SALARY_SURVEY_FIELD.CURRENCY in rawPatchSalarySurvey) {
      salaryInfo.currency = await this.currencyService.getConstant(
        rawPatchSalarySurvey[SALARY_SURVEY_FIELD.CURRENCY]
      );
    }
    if (SALARY_SURVEY_FIELD.CURRENCY_REMARK in rawPatchSalarySurvey) {
      salaryInfo.currencyRemark =
        rawPatchSalarySurvey[SALARY_SURVEY_FIELD.CURRENCY_REMARK];
    }
    return await queryRunner.manager.save(salaryInfo);
  }

  /**
   * @description update personal info and save to database
   * @param personalInfo personal info need to update
   * @param rawPatchSalarySurvey update personal info raw data
   * @param queryRunner
   * @returns Promise<PersonalInfo>
   */
  private async updatePersonalInfo(
    personalInfo: PersonalInfo,
    rawPatchSalarySurvey: RawPatchSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<PersonalInfo> {
    if (SALARY_SURVEY_FIELD.LOCATION in rawPatchSalarySurvey) {
      personalInfo.location =
        rawPatchSalarySurvey[SALARY_SURVEY_FIELD.LOCATION];
    }
    if (SALARY_SURVEY_FIELD.AGE_GROUP in rawPatchSalarySurvey) {
      personalInfo.ageGroup = await this.ageGroupService.getConstant(
        rawPatchSalarySurvey[SALARY_SURVEY_FIELD.AGE_GROUP]
      );
    }
    if (SALARY_SURVEY_FIELD.WORK_EXPERIENCE_YEAR in rawPatchSalarySurvey) {
      personalInfo.workExperienceYear =
        await this.workExperienceYearService.getConstant(
          rawPatchSalarySurvey[SALARY_SURVEY_FIELD.WORK_EXPERIENCE_YEAR]
        );
    }
    return await queryRunner.manager.save(personalInfo);
  }

  /**
   * @description update job info and save to database
   * @param jobInfo job info need to update
   * @param rawPatchSalarySurvey update job info raw data
   * @param queryRunner
   * @returns Promise<JobInfo>
   */
  private async updateJobInfo(
    jobInfo: JobInfo,
    rawPatchSalarySurvey: RawPatchSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<JobInfo> {
    if (SALARY_SURVEY_FIELD.INDUSTRY in rawPatchSalarySurvey) {
      jobInfo.industry = rawPatchSalarySurvey[SALARY_SURVEY_FIELD.INDUSTRY];
    }
    if (SALARY_SURVEY_FIELD.JOB_TITLE in rawPatchSalarySurvey) {
      jobInfo.title = rawPatchSalarySurvey[SALARY_SURVEY_FIELD.JOB_TITLE];
    }
    if (SALARY_SURVEY_FIELD.JOB_REMARK in rawPatchSalarySurvey) {
      jobInfo.titleRemark =
        rawPatchSalarySurvey[SALARY_SURVEY_FIELD.JOB_REMARK];
    }
    return await queryRunner.manager.save(jobInfo);
  }

  private async convertRawFormat(
    result: SurveyResult
  ): Promise<RawSalarySurveyResponse> {
    const rawTimeFormat = "M/D/YYYY HH:mm:ss";
    const rawResult: RawSalarySurveyResponse = {
      id: result.id,
      createAt: moment(result.createAt).format(rawTimeFormat),
      [SALARY_SURVEY_FIELD.AGE_GROUP]: result.personalInfo.ageGroup.title,
      [SALARY_SURVEY_FIELD.ANNUAL_SALARY]: result.salaryInfo.rawAnnualSalary,
      [SALARY_SURVEY_FIELD.CURRENCY]: result.salaryInfo.currency.title,
      [SALARY_SURVEY_FIELD.CURRENCY_REMARK]: result.salaryInfo.currencyRemark,
      [SALARY_SURVEY_FIELD.INDUSTRY]: result.jobInfo.industry,
      [SALARY_SURVEY_FIELD.JOB_REMARK]: result.jobInfo.titleRemark,
      [SALARY_SURVEY_FIELD.JOB_TITLE]: result.jobInfo.title,
      [SALARY_SURVEY_FIELD.LOCATION]: result.personalInfo.location,
      [SALARY_SURVEY_FIELD.RECORD_TIMESTAMP]: moment(
        result.recordTimestamp
      ).format(rawTimeFormat),
      [SALARY_SURVEY_FIELD.WORK_EXPERIENCE_YEAR]:
        result.personalInfo.workExperienceYear.title,
    };
    return rawResult;
  }
}

export default SalarySurveyService;
