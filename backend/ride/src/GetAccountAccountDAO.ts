import pgp from 'pg-promise'

export default interface GetAccountAccountDAO {
  getById(accountId: string, flag: boolean): Promise<any>;
}