import { RawSalarySurvey } from "./rawSalarySurvey";
import { SurveyResult, SurveyResultId } from "entity/SurveyResult";

interface SalarySurveyService {
  createSingleSurveyResult(
    rawSalarySurvey: RawSalarySurvey
  ): Promise<SurveyResult>;
  createBatchSurveyResult(
    rawSalarySurvey: RawSalarySurvey[],
    batchSize: number
  ): Promise<SurveyResult[]>;
  getSurveyResultById(surveyResultId: SurveyResultId): Promise<SurveyResult>;
  updateSurveyResultById(
    surveyResultId: SurveyResultId,
    rawSalarySurvey: RawSalarySurvey
  ): Promise<SurveyResult>;
}

export default SalarySurveyService;
