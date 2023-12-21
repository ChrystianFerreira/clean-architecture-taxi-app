import HttpServer from "../http/HttpServer";
import Registry, { inject } from "../di/Registry";

// Interface adapter
export default class MainController {
  @inject("httpServer")
  httpServer?: HttpServer;
  // @inject("signup")
  // signup?: Signup;

  constructor() {
    // const httpServer = Registry.getInstance().inject("httpServer");
    // const signup = Registry.getInstance().inject("signup");
    // const getAccount = Registry.getInstance().inject("getAccount");
    // this.httpServer?.register("post", "/signup", async (params: any, body: any) => {
    //   const output = await this.signup?.execute(body);
    //   return output;
    // });
    // this.httpServer?.register("get", "/accounts/:accountId", async (params: any, body: any) => {
    //   console.log({ params });
    //   const output = await this.getAccount?.execute(params.accountId);
    //   return output;
    // });
  }
}
