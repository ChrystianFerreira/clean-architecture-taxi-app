import AccountDAO from "../src/AccountRepository";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import DatabaseConnection from "../src/DatabaseConnection";
import GetAccount from "../src/GetAccount";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import PgPromiseAdapter from "../src/PgPromiseAdapter";
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideRepositoryDatabase";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
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
});

test("Deve solicitar uma corrida", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignup);
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
  const outputSignup = await signup.execute(inputSignup);
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
  const outputSignup = await signup.execute(inputSignup);
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
