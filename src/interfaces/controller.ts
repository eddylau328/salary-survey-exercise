import { Router, ErrorRequestHandler } from "express";

export interface Controller {
  path: string;
  router: Router;
  errorHandler: ErrorRequestHandler;
}
