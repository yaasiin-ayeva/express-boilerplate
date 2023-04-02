import "reflect-metadata";
import { DataSource } from "typeorm";
import Env from "./configs/config";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: Env.DB_HOST,
    port: Env.DB_PORT,
    username: Env.DB_USER,
    password: Env.DB_PASS,
    database: Env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
        Env.env === "production" ? "./build/entities/**/*.js" : "src/entities/**/*.ts",
        Env.env === "test" ? "./tests/entities/**/*.js" : "src/entities/**/*.ts",
        Env.env === "development" ? "./src/entities/**/*.ts" : "src/entities/**/*.ts",
    ],
    migrations: [],
    subscribers: [],
});