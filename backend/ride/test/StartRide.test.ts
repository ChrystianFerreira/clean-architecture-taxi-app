import AcceptRide from "../src/AcceptRide";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import DatabaseConnection from "../src/DatabaseConnection";
import GetAccount from "../src/GetAccount";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import PgPromiseAdapter from "../src/PgPromiseAdapter";
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideRepositoryDatabase";
import Signup from "../src/Signup";
import StartRide from "../src/StartRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: DatabaseConnection;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const accountRepositoryDatabase = new AccountRepositoryDatabase(databaseConnection);
  const rideDAO = new RideDAODatabase();
  const logger = new LoggerConsole();
  signup = new Signup(accountRepositoryDatabase, logger);
  getAccount = new GetAccount(accountRepositoryDatabase);
  requestRide = new RequestRide(rideDAO, accountRepositoryDatabase, logger);
  getRide = new GetRide(rideDAO, logger);
  acceptRide = new AcceptRide(rideDAO, accountRepositoryDatabase);
  startRide = new StartRide(rideDAO);
});

test("Deve iniciar uma corrida", async function () {
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputSignupDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA9999",
    isDriver: true,
    password: "123456",
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("in_progress");
});

afterEach(async () => {
  await databaseConnection.close();
});
