import { Controller } from "interfaces/controller";
import { Router, Request, Response } from "express";
import SalarySurveyService from "services/SalarySurveyService";
import AgeGroupService from "services/AgeGroupService";
import WorkExperienceYearService from "services/WorkExperienceYearService";
import CurrencyService from "services/CurrencyService";
import SalaryService from "services/SalaryService";

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
    this.router.post("/", this._postSalarySurvey.bind(this));
  }

  private async _postSalarySurvey(req: Request, res: Response) {
    try {
      res.status(200).json();
    } catch (error) {
      const data = error.data || error.message;
      const statusCode = error.statusCode || 400;
      res.status(statusCode).json(data);
    }
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
