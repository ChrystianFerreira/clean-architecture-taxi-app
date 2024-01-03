import AcceptRide from "../src/application/usecase/AcceptRide";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import StartRide from "../src/application/usecase/StartRide";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import AccountGateway from "../src/application/gateway/AccountGateway";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: DatabaseConnection;
let accountGateway: AccountGateway;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const positionRepository = new PositionRepositoryDatabase(databaseConnection);
  const rideRepository = new RideRepositoryDatabase(databaseConnection);
  const logger = new LoggerConsole();
  accountGateway = new AccountGatewayHttp();
  requestRide = new RequestRide(rideRepository, accountGateway, logger);
  getRide = new GetRide(rideRepository, positionRepository, logger);
  acceptRide = new AcceptRide(rideRepository, accountGateway);
  startRide = new StartRide(rideRepository);
});

test("Deve iniciar uma corrida", async function () {
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
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
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
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
