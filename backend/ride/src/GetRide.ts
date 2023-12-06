import crypto from "crypto";
import Logger from "./Logger";
import RideDAO from "./RideRepository";

export default class GetRide {
  constructor(private rideDAO: RideDAO, private logger: Logger) {}

  async execute(rideId: any): Promise<Output> {
    this.logger.log(`getRide ${rideId}`);
    const ride = await this.rideDAO.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    return {
      rideId: ride.rideId,
      status: ride.getStatus(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
    };
  }
}

type Output = {
  rideId: string;
  status: string;
  driverId: string;
  passengerId: string;
};
