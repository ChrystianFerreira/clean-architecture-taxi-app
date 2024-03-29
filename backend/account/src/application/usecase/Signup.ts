import Account from "../../domain/Account";
import AccountRepository from "../repository/AccountRepository";
import UseCase from "./UseCase";

export default class Signup implements UseCase {
  name = "signup";

  constructor(private accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(input: Input): Promise<Output> {
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
