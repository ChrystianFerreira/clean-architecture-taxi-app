import AccountDAO from "./AccountDAO";

export async function getAccount(accountId: string) {
	const accountDAO = new AccountDAO();
	const account = accountDAO.getById(accountId)
	return account;
}