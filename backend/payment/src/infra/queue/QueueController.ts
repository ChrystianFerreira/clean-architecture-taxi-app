import Queue from "../../../../ride/src/infra/queue/Queue";
import ProcessPayment from "../../application/usecase/ProcessPayment";
import { inject } from "../di/Registry";

export default class QueueController {
  @inject("queue")
  queue?: Queue;
  @inject("processPayment")
  processPayment?: ProcessPayment;

  constructor() {
    this.queue?.consume("rideCompleted", "rideCompleted.processPayment", async (input: any) => {
      await this.processPayment?.execute(input);
    });
  }
}
