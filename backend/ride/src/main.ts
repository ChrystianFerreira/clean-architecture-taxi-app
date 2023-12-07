import AccountRepositoryDatabase from "./AccountRepositoryDatabase";
import ExpressAdapter from "./ExpressAdapter";
import GetAccount from "./GetAccount";
import LoggerConsole from "./LoggerConsole";
import MainController from "./MainController";
import PgPromiseAdapter from "./PgPromiseAdapter";
import Signup from "./Signup";

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const accountRepositoryDatabase = new AccountRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();
const signup = new Signup(accountRepositoryDatabase, logger);
const getAccount = new GetAccount(accountRepositoryDatabase);
new MainController(httpServer, signup, getAccount);
httpServer.listen(3000);
