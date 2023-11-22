import pgp from 'pg-promise'
import SignupAccountDAO from './SignupAccountDAO';
import GetAccountAccountDAO from './GetAccountAccountDAO';

export default interface AccountDAO extends SignupAccountDAO, GetAccountAccountDAO {
  save(account: any): Promise<void>;
  getById(accountId: string, flag: boolean): Promise<any>;
  getByEmail(email: string): Promise<any>;
}