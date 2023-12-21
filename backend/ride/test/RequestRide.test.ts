import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import RequestRide from "../src/application/usecase/RequestRide";
import RideDAODatabase from "../src/infra/repository/RideRepositoryDatabase";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";
import AccountGateway from "../src/infra/gateway/AccountGatewayHttp";

let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: DatabaseConnection;
let accountGateway: AccountGateway;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const rideDAO = new RideDAODatabase();
  const positionRepository = new PositionRepositoryDatabase(databaseConnection);
  const logger = new LoggerConsole();
  accountGateway = new AccountGatewayHttp();
  requestRide = new RequestRide(rideDAO, accountGateway, logger);
  getRide = new GetRide(rideDAO, positionRepository, logger);
});

test("Deve solicitar uma corrida", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("requested");
});

test("Não deve poder solicitar uma corrida se a conta não existir", async function () {
  const inputRequestRide = {
    passengerId: "1b0f6076-e061-4298-88f0-bd928884bf38",
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  };
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account does not exist"));
});

test("Não deve poder solicitar uma corrida se a conta não for de um passageiro", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA9999",
    isDriver: true,
    isPassenger: false,
    password: "123456",
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  };
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Only passengers can request a ride")
  );
});

test("Não deve poder solicitar uma corrida se o passageiro já tiver outra corrida ativa", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.58,
    fromLong: -48.54,
    toLat: -27.49,
    toLong: -48.52,
  };
  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger has an active ride"));
});

afterEach(async () => {
  await databaseConnection.close();
});
