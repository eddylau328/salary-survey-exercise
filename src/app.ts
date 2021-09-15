import { Controller } from "interfaces/controller";
import { ServerStatus } from "interfaces/serverStatus";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const corsConfig: cors.CorsOptions = {
  origin: ["*"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default class App {
  public app: express.Application;

  public status: ServerStatus;

  private controllers: Controller[];

  constructor(controllers: Controller[]) {
    this.status = ServerStatus.Initialization;
    this.app = express();
    this.controllers = controllers;
  }

  public async initialize(): Promise<unknown> {
    this.initializeMiddlewares();
    this.initializeControllers(this.controllers);
    this.initializeErrorHandling();
    return this.listen();
  }

  private listen(port = process.env.PORT || 3000) {
    this.app.on("error", () => {
      console.error(`App fail ${port}`);
      this.status = ServerStatus.Error;
    });
    return this.app.listen(port, () => {
      console.info(`App listening on the port ${port}`);
      this.status = ServerStatus.Ready;
    });
  }

  private initializeMiddlewares() {
    this.app.set("trust proxy", 1);
    this.app.use(helmet());
    this.app.use(cors(corsConfig));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("combined"));
  }

  private initializeErrorHandling() {
    this.app.use(
      (
        err: Error | undefined,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        try {
          this.controllers.forEach((controller) => {
            if (req.url.startsWith(controller.path)) {
              controller.errorHandler(err, req, res, next);
            }
          });
        } catch (e) {
          console.error("unhandled error", e);
          res.send(400);
        }
      }
    );
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }
}
