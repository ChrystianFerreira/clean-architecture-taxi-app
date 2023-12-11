import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import GetAccount from "./application/usecase/GetAccount";
import LoggerConsole from "./infra/logger/LoggerConsole";
import MainController from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import Signup from "./application/usecase/Signup";

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const accountRepositoryDatabase = new AccountRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();
const signup = new Signup(accountRepositoryDatabase, logger);
const getAccount = new GetAccount(accountRepositoryDatabase);
new MainController(httpServer, signup, getAccount);
httpServer.listen(3000);
