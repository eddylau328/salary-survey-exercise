import { SurveyResultId } from "entity/SurveyResult";
import { SurveyResult } from "entity/SurveyResult";

enum SURVEY_RESULT_FORMAT {
  OBJECT = "object",
  RAW = "raw",
}

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

interface RawSalarySurveyResponse extends RawSalarySurvey {
  id: SurveyResultId;
  createAt: string;
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
  format?: SURVEY_RESULT_FORMAT;
}

interface RawPostFilterSalarySurveyListResponse {
  count: number;
  results: SurveyResult[] | RawSalarySurveyResponse[];
}

enum FILTER_CONDITION_LOGIC {
  AND = "and",
  OR = "or",
}

interface FilterAgeGroup {
  titles?: string[];
  start?: number;
  end?: number;
  condition: FILTER_CONDITION_LOGIC;
}

interface FilterWorkExperienceYear {
  titles?: string[];
  start?: number;
  end?: number;
  condition: FILTER_CONDITION_LOGIC;
}

interface FilterCurrency {
  titles?: string[];
  condition: FILTER_CONDITION_LOGIC;
}

interface FilterAnnualSalary {
  textSearch?: string;
  rangeStart?: number;
  rangeEnd?: number;
  condition: FILTER_CONDITION_LOGIC;
}

interface FilterJob {
  jobRole?: string;
  industry?: string;
  condition: FILTER_CONDITION_LOGIC;
}

interface RawPostFilterSalarySurveyListRequest {
  ageGroupFilter?: FilterAgeGroup;
  currencyFilter?: FilterCurrency;
  workExperienceYearFilter?: FilterWorkExperienceYear;
  annualSalaryFilter?: FilterAnnualSalary;
  jobFilter?: FilterJob;
  format?: SURVEY_RESULT_FORMAT;
}

enum SALARY_SURVEY_FIELD {
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
  RawSalarySurveyResponse,
  RawPostFilterSalarySurveyListRequest,
  RawPostFilterSalarySurveyListResponse,
  FilterAgeGroup,
  FilterCurrency,
  FilterWorkExperienceYear,
  FilterAnnualSalary,
  FilterJob,
  SALARY_SURVEY_FIELD,
  SURVEY_RESULT_FORMAT,
  FILTER_CONDITION_LOGIC,
};
