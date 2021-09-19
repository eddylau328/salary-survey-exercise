import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { ServerStatus } from "interfaces/ServerStatus";

export default class DB {
  public status: ServerStatus;

  constructor() {
    this.status = ServerStatus.Initialization;
  }

  public async initialize(): Promise<Connection> {
    try {
      const connection = await createConnection();
      this.status = ServerStatus.Ready;
      console.log("Connected to database");
      return connection;
    } catch (err) {
      console.error(err);
      this.status = ServerStatus.Error;
      throw err;
    }
  }
}
