import DistanceCalculator from "../../domain/DistanceCalculator";
import Position from "../../domain/Position";
import PaymentGateway from "../gateway/PaymentGateway";
import PositionRepository from "../repository/PositionRepository";
import RideRepository from "../repository/RideRepository";

export default class FinishRide {
  constructor(private rideRepository: RideRepository, private paymentGateway: PaymentGateway) {}

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId);
    if (!ride) throw new Error("Ride not found");
    if (ride.getStatus() !== "in_progress") throw new Error("To update position ride must be in progress");
    ride.finish();
    await this.rideRepository.update(ride);
    await this.paymentGateway.processPayment({ rideId: ride.rideId, amount: ride.getFare() });
  }
}

type Input = {
  rideId: string;
};
