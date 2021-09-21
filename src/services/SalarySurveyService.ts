import SalarySurveyServiceImp from "interfaces/salarySurveyService";
import {
  RawSalarySurvey,
  SALARY_SURVET_FIELD,
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
import { getConnection, QueryRunner } from "typeorm";
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

  public async getSurveyResultById(
    surveyResultId: SurveyResultId
  ): Promise<SurveyResult> {
    return new SurveyResult();
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
    rawSalarySurvey: RawSalarySurvey
  ): Promise<SurveyResult> {
    return new SurveyResult();
  }

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
    surveryResult.jobInfo = jobInfo;
    surveryResult.personalInfo = personalInfo;
    surveryResult.salaryInfo = salaryInfo;
    return await queryRunner.manager.save(surveryResult);
  }

  private async createPersonalInfo(
    rawSalarySurvey: RawSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<PersonalInfo> {
    const [ageGroup, workExperienceYear] = await Promise.all([
      this.ageGroupService.getConstant(
        rawSalarySurvey[SALARY_SURVET_FIELD.AGE_GROUP]
      ),
      this.workExperienceYearService.getConstant(
        rawSalarySurvey[SALARY_SURVET_FIELD.WORK_EXPERIENCE_YEAR]
      ),
    ]);
    const personalInfo = new PersonalInfo();
    personalInfo.ageGroup = ageGroup;
    personalInfo.WorkExperienceYear = workExperienceYear;
    personalInfo.location = rawSalarySurvey[SALARY_SURVET_FIELD.LOCATION];
    return await queryRunner.manager.save(personalInfo);
  }

  private async createJobInfo(
    rawSalarySurvey: RawSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<JobInfo> {
    const jobInfo = new JobInfo();
    jobInfo.industry = rawSalarySurvey[SALARY_SURVET_FIELD.INDUSTRY];
    jobInfo.title = rawSalarySurvey[SALARY_SURVET_FIELD.JOB_TITLE];
    jobInfo.titleRemark = rawSalarySurvey[SALARY_SURVET_FIELD.JOB_REMARK];
    return await queryRunner.manager.save(jobInfo);
  }

  private async createSalaryInfo(
    rawSalarySurvey: RawSalarySurvey,
    queryRunner: QueryRunner
  ): Promise<SalaryInfo> {
    const salaryInfo = new SalaryInfo();
    const rawCurrency = rawSalarySurvey[SALARY_SURVET_FIELD.CURRENCY];
    const rawAnnualSalary = rawSalarySurvey[SALARY_SURVET_FIELD.ANNUAL_SALARY];
    const currencyRemark = rawSalarySurvey[SALARY_SURVET_FIELD.CURRENCY_REMARK];
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
}

export default SalarySurveyService;
