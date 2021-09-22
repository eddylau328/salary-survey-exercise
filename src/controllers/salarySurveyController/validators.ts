import { Joi, validate } from "express-validation";
import {
  FILTER_CONDITION_LOGIC,
  SALARY_SURVEY_FIELD,
  SURVEY_RESULT_FORMAT,
} from "interfaces/rawSalarySurvey";
import {
  ACCEPT_AGE_GROUP_FIELDS,
  ACCEPT_CURRENCY_FIELDS,
  ACCEPT_WORK_EXPERIENCE_YEAR_FIELDS,
} from "interfaces/constantService";

const postFilterSalarySurveyListSchema = {
  body: Joi.object({
    ageGroupFilter: Joi.object({
      titles: Joi.array()
        .items(Joi.string().valid(...ACCEPT_AGE_GROUP_FIELDS))
        .default(null),
      start: Joi.number().integer().strict().when("titles", {
        is: null,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
      end: Joi.number().integer().strict().when("titles", {
        is: null,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
      condition: Joi.string()
        .valid(FILTER_CONDITION_LOGIC.AND, FILTER_CONDITION_LOGIC.OR)
        .when("titles", {
          is: Joi.exist(),
          then: Joi.required(),
        })
        .when("start", {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    }).allow({}),
    workExperienceYearFilter: Joi.object({
      titles: Joi.array()
        .items(Joi.string().valid(...ACCEPT_WORK_EXPERIENCE_YEAR_FIELDS))
        .default(null),
      start: Joi.number().integer().strict().when("titles", {
        is: null,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
      end: Joi.number().integer().strict().when("titles", {
        is: null,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
      condition: Joi.string()
        .valid(FILTER_CONDITION_LOGIC.AND, FILTER_CONDITION_LOGIC.OR)
        .when("titles", {
          is: Joi.exist(),
          then: Joi.required(),
        })
        .when("start", {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    }).allow({}),
    currencyFilter: Joi.object({
      titles: Joi.array()
        .items(Joi.string().valid(...ACCEPT_CURRENCY_FIELDS))
        .default([...ACCEPT_CURRENCY_FIELDS])
        .required(),
      condition: Joi.string()
        .valid(FILTER_CONDITION_LOGIC.AND, FILTER_CONDITION_LOGIC.OR)
        .when("titles", {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    }).allow({}),
    annualSalaryFilter: Joi.object({
      textSearch: Joi.string().allow("").default(null),
      rangeStart: Joi.number().integer().strict().when("textSearch", {
        is: null,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
      rangeEnd: Joi.number().integer().strict().when("textSearch", {
        is: null,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
      condition: Joi.string()
        .valid(FILTER_CONDITION_LOGIC.AND, FILTER_CONDITION_LOGIC.OR)
        .when("textSearch", {
          is: Joi.exist(),
          then: Joi.required(),
        })
        .when("rangeStart", {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    }).allow({}),
    jobFilter: Joi.object({
      jobRole: Joi.string().allow(""),
      industry: Joi.string().allow(""),
      condition: Joi.string()
        .valid(FILTER_CONDITION_LOGIC.AND, FILTER_CONDITION_LOGIC.OR)
        .when("jobRole", {
          is: Joi.exist(),
          then: Joi.required(),
        })
        .when("industry", {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    }).allow({}),
    format: Joi.string().valid(
      SURVEY_RESULT_FORMAT.RAW,
      SURVEY_RESULT_FORMAT.OBJECT
    ),
  }),
};

const postSalarySurveyRequstSchema = {
  body: Joi.object({
    [SALARY_SURVEY_FIELD.RECORD_TIMESTAMP]: Joi.date().required(),
    [SALARY_SURVEY_FIELD.AGE_GROUP]: Joi.string()
      .valid(...ACCEPT_AGE_GROUP_FIELDS)
      .required(),
    [SALARY_SURVEY_FIELD.INDUSTRY]: Joi.string().required(),
    [SALARY_SURVEY_FIELD.JOB_TITLE]: Joi.string().required(),
    [SALARY_SURVEY_FIELD.ANNUAL_SALARY]: Joi.string().required(),
    [SALARY_SURVEY_FIELD.CURRENCY]: Joi.string()
      .valid(...ACCEPT_CURRENCY_FIELDS)
      .required(),
    [SALARY_SURVEY_FIELD.LOCATION]: Joi.string().required(),
    [SALARY_SURVEY_FIELD.WORK_EXPERIENCE_YEAR]: Joi.string()
      .valid(...ACCEPT_WORK_EXPERIENCE_YEAR_FIELDS)
      .required(),
    [SALARY_SURVEY_FIELD.JOB_REMARK]: Joi.string().allow("").required(),
    [SALARY_SURVEY_FIELD.CURRENCY_REMARK]: Joi.string().allow("").required(),
  }),
};

const patchSalarySurveyRequstSchema = {
  body: Joi.object({
    id: Joi.string().required(),
    [SALARY_SURVEY_FIELD.RECORD_TIMESTAMP]: Joi.date(),
    [SALARY_SURVEY_FIELD.AGE_GROUP]: Joi.string().valid(
      ...ACCEPT_AGE_GROUP_FIELDS
    ),
    [SALARY_SURVEY_FIELD.INDUSTRY]: Joi.string(),
    [SALARY_SURVEY_FIELD.JOB_TITLE]: Joi.string(),
    [SALARY_SURVEY_FIELD.ANNUAL_SALARY]: Joi.string(),
    [SALARY_SURVEY_FIELD.CURRENCY]: Joi.string().valid(
      ...ACCEPT_CURRENCY_FIELDS
    ),
    [SALARY_SURVEY_FIELD.LOCATION]: Joi.string(),
    [SALARY_SURVEY_FIELD.WORK_EXPERIENCE_YEAR]: Joi.string().valid(
      ...ACCEPT_WORK_EXPERIENCE_YEAR_FIELDS
    ),
    [SALARY_SURVEY_FIELD.JOB_REMARK]: Joi.string().allow(""),
    [SALARY_SURVEY_FIELD.CURRENCY_REMARK]: Joi.string().allow(""),
  }),
};

const validatePostSalarySurveyRequest = validate(postSalarySurveyRequstSchema);
const validatePatchSalarySurveyRequest = validate(
  patchSalarySurveyRequstSchema
);
const validatePostFilterSalarySurveyListRequest = validate(
  postFilterSalarySurveyListSchema
);

export {
  validatePostFilterSalarySurveyListRequest,
  validatePostSalarySurveyRequest,
  validatePatchSalarySurveyRequest,
};
