import AcceptRide from "../src/application/usecase/AcceptRide";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import RequestRide from "../src/application/usecase/RequestRide";
import RideDAODatabase from "../src/infra/repository/RideRepositoryDatabase";
import Signup from "../src/application/usecase/Signup";
import StartRide from "../src/application/usecase/StartRide";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";

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
  const positionRepository = new PositionRepositoryDatabase(databaseConnection);
  const rideDAO = new RideDAODatabase();
  const logger = new LoggerConsole();
  signup = new Signup(accountRepositoryDatabase, logger);
  getAccount = new GetAccount(accountRepositoryDatabase);
  requestRide = new RequestRide(rideDAO, accountRepositoryDatabase, logger);
  getRide = new GetRide(rideDAO, positionRepository, logger);
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
