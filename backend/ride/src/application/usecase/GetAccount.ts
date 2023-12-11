import AccountRepository from "../repository/AccountRepository";

export default class GetAccount {
  constructor(private accountRepository: AccountRepository) {}

  async execute(accountId: string) {
    const account = this.accountRepository.getById(accountId);
    return account;
  }
}
