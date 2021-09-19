import { Controller } from "interfaces/controller";
import { Router, Request, Response } from "express";

export default class SalarySurveyController implements Controller {
  public path = "/survey";
  public router = Router();
  public errorHandler = (): void => null;

  constructor() {
    this._initializeRouter();
  }

  private _initializeRouter() {
    this.router.post("/salary", this.postSalarySurvey);
  }

  private async postSalarySurvey(req: Request, res: Response) {
    try {
      res.status(200).json();
    } catch (error) {
      const data = error.data || error.message;
      const statusCode = error.statusCode || 400;
      res.status(statusCode).json(data);
    }
  }
}
