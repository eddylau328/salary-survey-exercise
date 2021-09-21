import dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const dbConfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};

const port = process.env.PORT || "5432";

export { port, dbConfig };
