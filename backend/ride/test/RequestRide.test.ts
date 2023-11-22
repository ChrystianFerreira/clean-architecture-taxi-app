import AccountDAO from "../src/AccountDAO";
import AccountDAODatabase from "../src/AccountDAODatabase";
import GetAccount from "../src/GetAccount";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAODatabase";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
	const accountDAO =  new AccountDAODatabase()
	const rideDAO = new RideDAODatabase()
	const logger = new LoggerConsole();
	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO)
	requestRide = new RequestRide(rideDAO, logger)
	getRide = new GetRide(rideDAO, logger)
})
test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = { 
		passengerId: outputSignup.accountId,
		fromLat: -27.58,
		fromLong: -48.54,
		toLat: -27.49,
		toLong: -48.52
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide)
	expect(outputRequestRide.rideId).toBeDefined()
	const outputGetRide = await getRide.execute(outputRequestRide.rideId)
	console.log(outputGetRide)
});
