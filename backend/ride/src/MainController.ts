import GetAccount from "./GetAccount";
import HttpServer from "./HttpServer";
import Signup from "./Signup";

// Interface adapter
export default class MainController {
  constructor(readonly httpServer: HttpServer, signup: Signup, getAccount: GetAccount) {
    httpServer.register("post", "/signup", async function (params: any, body: any) {
      const output = await signup.execute(body);
      return output;
    });

    httpServer.register("get", "/accounts/:accountId", async function (params: any, body: any) {
      console.log({ params });
      const output = await getAccount.execute(params.accountId);
      return output;
    });
  }
}
