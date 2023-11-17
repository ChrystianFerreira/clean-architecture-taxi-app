import AccountDAO from "./AccountDAO";

export default class GetAccount { 
	accountDAO: AccountDAO

	constructor () { 
		this.accountDAO = new AccountDAO()
	}

	async execute(accountId: string) { 
		const accountDAO = new AccountDAO();
		const account = accountDAO.getById(accountId)
		return account;
	}
}