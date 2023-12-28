import HttpServer from "../http/HttpServer";
import Registry, { inject } from "../di/Registry";
import ProcessPayment from "../../application/usecase/ProcessPayment";
import GetTransactionbyRideId from "../../application/usecase/GetTransactionByRideId";

// Interface adapter
export default class MainController {
  @inject("httpServer")
  httpServer?: HttpServer;
  @inject("processPayment")
  processPayment?: ProcessPayment;
  @inject("getTransactionByRideId")
  getTransactionByRideId?: GetTransactionbyRideId;

  constructor() {
    this.httpServer?.register("post", "/process_payment", async (params: any, body: any) => {
      const output = await this.processPayment?.execute(body);
      return output;
    });

    this.httpServer?.register("get", "/rides/:rideId/transactions", async (params: any, body: any) => {
      const output = await this.getTransactionByRideId?.execute(params.rideId);
      return output;
    });
  }
}