import ExpressAdapter from "./infra/http/ExpressAdapter";
import LoggerConsole from "./infra/logger/LoggerConsole";
import MainController from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import Registry from "./infra/di/Registry";

// framework and drivers and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();

// interface adapter
const logger = new LoggerConsole();

// use case

const registry = Registry.getInstance();
registry.register("httpServer", httpServer);

new MainController();

httpServer.listen(3000);
