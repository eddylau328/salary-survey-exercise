import { SurveyResultId } from "entity/SurveyResult";

interface RawSalarySurvey {
  Timestamp: string;
  "How old are you?": string;
  "What industry do you work in?": string;
  "Job title": string;
  "What is your annual salary?": string;
  "Please indicate the currency": string;
  "Where are you located? (City/state/country)": string;
  "How many years of post-college professional work experience do you have?": string;
  "If your job title needs additional context, please clarify here:": string;
  // eslint-disable-next-line quotes
  'If "Other," please indicate the currency here:': string;
}

interface RawPatchSalarySurvey {
  Timestamp?: string;
  "How old are you?"?: string;
  "What industry do you work in?"?: string;
  "Job title"?: string;
  "What is your annual salary?"?: string;
  "Please indicate the currency"?: string;
  "Where are you located? (City/state/country)"?: string;
  "How many years of post-college professional work experience do you have?"?: string;
  "If your job title needs additional context, please clarify here:"?: string;
  // eslint-disable-next-line quotes
  'If "Other," please indicate the currency here:'?: string;
}

interface RawPatchSalarySurveyRequest extends RawPatchSalarySurvey {
  id: SurveyResultId;
}

interface RawGetSalarySurveyRequest {
  id: SurveyResultId;
}

enum SALARY_SURVET_FIELD {
  RECORD_TIMESTAMP = "Timestamp",
  AGE_GROUP = "How old are you?",
  INDUSTRY = "What industry do you work in?",
  JOB_TITLE = "Job title",
  ANNUAL_SALARY = "What is your annual salary?",
  CURRENCY = "Please indicate the currency",
  LOCATION = "Where are you located? (City/state/country)",
  WORK_EXPERIENCE_YEAR = "How many years of post-college professional work experience do you have?",
  JOB_REMARK = "If your job title needs additional context, please clarify here:",
  // eslint-disable-next-line quotes
  CURRENCY_REMARK = 'If "Other," please indicate the currency here:',
}

export {
  RawSalarySurvey,
  RawPatchSalarySurvey,
  RawPatchSalarySurveyRequest,
  RawGetSalarySurveyRequest,
  SALARY_SURVET_FIELD,
};
