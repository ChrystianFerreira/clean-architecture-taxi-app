import AccountDAO from "./AccountDAO";
import { validateCpf } from "./CpfValidator";
import crypto from 'crypto'
import Logger from "./Logger";

export default class Signup {
  accountDAO: AccountDAO;
  logger: Logger

  constructor() {
    this.accountDAO = new AccountDAO()
    this.logger = new Logger()
  }

  async execute(input: any) {
    this.logger.log(`signup ${input.name}`)
    const accountDAO = new AccountDAO();
    input.accountId = crypto.randomUUID();
    const account = await accountDAO.getByEmail(input.email)
    if (account) throw new Error("Duplicated account");
    if (this.isInvalidName(input.name)) throw new Error("Invalid name");
    if (this.isInvalidEmail(input.email)) throw new Error("Invalid email");
    if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && this.isInvalidCarPlate(input.carPlate)) throw new Error("Invalid car plate");
    await accountDAO.save(input)
    return {
      accountId: input.accountId
    };
  }
  
  isInvalidName (name: string) {
    return !name.match(/[a-zA-Z] [a-zA-Z]+/);
  }
  
  isInvalidEmail (email: string) {
    return !email.match(/^(.+)@(.+)$/);
  }
  
  isInvalidCarPlate (carPlate: string) {
    return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
  } 
}