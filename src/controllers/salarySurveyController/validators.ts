import { Joi, validate } from "express-validation";
import { SALARY_SURVEY_FIELD } from "interfaces/rawSalarySurvey";
import {
  ACCEPT_AGE_GROUP_FIELDS,
  ACCEPT_CURRENCY_FIELDS,
  ACCEPT_WORK_EXPERIENCE_YEAR_FIELDS,
} from "interfaces/constantService";

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

export { validatePostSalarySurveyRequest, validatePatchSalarySurveyRequest };
