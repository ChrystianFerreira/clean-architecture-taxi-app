import Logger from "../logger/Logger";
import Account from "../../domain/Account";
import AccountRepository from "../repository/AccountRepository";

export default class Signup {
  constructor(private accountRepository: AccountRepository, private logger: Logger) {
    this.accountRepository = accountRepository;
    this.logger = logger;
  }

  async execute(input: Input): Promise<Output> {
    console.log(input);
    const existingAccount = await this.accountRepository.getByEmail(input.email);
    if (existingAccount) throw new Error("Duplicated account");
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate || "",
      !!input.isPassenger,
      !!input.isDriver
    );
    await this.accountRepository.save(account);
    return {
      accountId: account.accountId,
    };
  }
}

type Input = {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger?: boolean;
  isDriver?: boolean;
  password: string;
};

type Output = {
  accountId: string;
};
