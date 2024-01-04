import RequestRide from "../../application/usecase/RequestRide";
import SendReceipt from "../../application/usecase/SendReceipt";
import UpdateRideProjection from "../../application/usecase/UpdateRideProjection";
import UpdateRideProjectionAPIComposition from "../../application/usecase/UpdateRideProjectionAPIComposition";
import { inject } from "../di/Registry";
import Queue from "./Queue";

export default class QueueController {
  @inject("queue")
  queue?: Queue;
  @inject("sendReceipt")
  sendReceipt?: SendReceipt;
  @inject("requestRide")
  requestRide?: RequestRide;
  @inject("updateRideProjection")
  updateRideProjection?: UpdateRideProjectionAPIComposition;
  constructor() {
    this.queue?.consume("paymentApproved", "paymentApproved.sendReceipt", async (input: any) => {
      await this.sendReceipt?.execute(input);
    });

    this.queue?.consume("requestRide", "requestRide.requestRide", async (input: any) => {
      console.log("Consuming requestRide queue...", input);
      await this.requestRide?.execute(input);
    });

    this.queue?.consume("rideCompleted", "rideCompleted.updateProjection", async (input: any) => {
      await this.updateRideProjection?.execute(input);
    });
  }
}
