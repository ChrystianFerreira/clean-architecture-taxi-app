import GetAccountAccountDAO from "./GetAccountAccountDAO";

export default class GetAccount { 

	constructor (private accountDAO: GetAccountAccountDAO) {}

	async execute(accountId: string) { 
		const account = this.accountDAO.getById(accountId, true)
		return account;
	}
}