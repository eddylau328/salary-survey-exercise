import { Controller } from "interfaces/controller";
import { Router, Request, Response } from "express";
import SalarySurveyService from "services/SalarySurveyService";
import AgeGroupService from "services/AgeGroupService";
import WorkExperienceYearService from "services/WorkExperienceYearService";
import CurrencyService from "services/CurrencyService";
import SalaryService from "services/SalaryService";
import {
  RawPatchSalarySurvey,
  RawPatchSalarySurveyRequest,
  RawSalarySurvey,
} from "interfaces/rawSalarySurvey";

export default class SalarySurveyController implements Controller {
  public path = "/salary-survey";
  public router = Router();
  public errorHandler = (): void => null;

  private _salarySurveyService: SalarySurveyService;

  constructor() {
    this._initializeRouter();
    this._salarySurveyService = new SalarySurveyService({
      ageGroupService: new AgeGroupService(),
      currencyService: new CurrencyService(),
      workExperienceYearService: new WorkExperienceYearService(),
      salaryService: new SalaryService(),
    });
  }

  private _initializeRouter() {
    this.router.get("/average-salary", this._getAverageSalary.bind(this));
    this.router.get("/", this._getSalarySurvey.bind(this));
    this.router.post("/", this._postSalarySurvey.bind(this));
  }

  private async _getSalarySurvey(req: Request, res: Response) {
    try {
      const rawGetSalarySurveyRequest: RawPatchSalarySurveyRequest = req.body;
      const surveyResult = await this._salarySurveyService.getSurveyResultById(
        rawGetSalarySurveyRequest.id
      );
      res.status(200).json(surveyResult);
    } catch (error) {
      res.status(404).send();
    }
  }

  private async _postSalarySurvey(req: Request, res: Response) {
    try {
      const rawSalarySurvey: RawSalarySurvey = req.body;
      const surveyResult =
        await this._salarySurveyService.createSingleSurveyResult(
          rawSalarySurvey
        );
      res.status(201).json(surveyResult);
    } catch (error) {
      const data = error.data || error.message;
      const statusCode = error.statusCode || 400;
      res.status(statusCode).json(data);
    }
  }

  private async _updateSalarySurvey(req: Request, res: Response) {
    try {
      const rawPatchSalarySurveyRequest: RawPatchSalarySurveyRequest = req.body;
      const { id, ...rawPatchSalarySurvey } = rawPatchSalarySurveyRequest;
      const surveyResult =
        await this._salarySurveyService.updateSurveyResultById(
          id,
          rawPatchSalarySurvey
        );
      res.status(200).json(surveyResult);
    } catch (error) {}
  }

  private async _getAverageSalary(req: Request, res: Response) {
    try {
      const averageAnnualSalary =
        await this._salarySurveyService.getAverageAnnualSalary(req.body);
      res.status(200).json(averageAnnualSalary);
    } catch (error) {
      console.log(error);
      res.status(400).json();
    }
  }
}
