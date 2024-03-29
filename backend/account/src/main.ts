import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import GetAccount from "./application/usecase/GetAccount";
import LoggerConsole from "./infra/logger/LoggerConsole";
import MainController from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import Signup from "./application/usecase/Signup";
import Registry from "./infra/di/Registry";
import LoggerDecorator from "./application/decorator/LoggerDecorator";

// framework and driver and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();

// interface adapter
const accountRepositoryDatabase = new AccountRepositoryDatabase(databaseConnection);

// use case
const signup = new LoggerDecorator(new Signup(accountRepositoryDatabase));
const getAccount = new GetAccount(accountRepositoryDatabase);

const registry = Registry.getInstance();
registry.register("httpServer", httpServer);
registry.register("signup", signup);
registry.register("getAccount", getAccount);

new MainController();

httpServer.listen(3001);
