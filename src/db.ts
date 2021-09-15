import "reflect-metadata";
import { createConnection } from "typeorm";
import { ServerStatus } from "interfaces/ServerStatus";

export default class DB {
  public status: ServerStatus;

  constructor() {
    this.status = ServerStatus.Initialization;
  }

  public async initialize(): Promise<void> {
    try {
      await createConnection();
      this.status = ServerStatus.Ready;
      console.log("Connected to database");
      return;
    } catch (err) {
      console.error(err);
      this.status = ServerStatus.Error;
      throw err;
    }
  }
}
