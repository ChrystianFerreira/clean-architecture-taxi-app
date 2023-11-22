import pgp from 'pg-promise'

export default interface SignupAccountDAO {
  save(account: any): Promise<void>;
  getByEmail(email: string): Promise<any>;
}