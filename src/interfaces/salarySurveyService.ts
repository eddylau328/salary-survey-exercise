import {
  RawGetSalarySurveyRequest,
  RawSalarySurvey,
  RawSalarySurveyResponse,
} from "./rawSalarySurvey";
import { SurveyResult, SurveyResultId } from "entity/SurveyResult";
import {
  AverageAnnualSalaryRequest,
  AverageAnnualSalaryResponse,
} from "./salaryService";

interface SalarySurveyService {
  createSingleSurveyResult(
    rawSalarySurvey: RawSalarySurvey
  ): Promise<SurveyResult>;
  createBatchSurveyResult(
    rawSalarySurvey: RawSalarySurvey[],
    batchSize: number
  ): Promise<SurveyResult[]>;
  getSurveyResult(
    rawGetSalarySurveyRequest: RawGetSalarySurveyRequest
  ): Promise<SurveyResult | RawSalarySurveyResponse>;
  updateSurveyResultById(
    surveyResultId: SurveyResultId,
    rawSalarySurvey: RawSalarySurvey
  ): Promise<SurveyResult>;

  getAverageAnnualSalary(
    averageAnnualSalaryRequest: AverageAnnualSalaryRequest
  ): Promise<AverageAnnualSalaryResponse>;
}

export default SalarySurveyService;
