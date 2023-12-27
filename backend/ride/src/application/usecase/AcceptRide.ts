import RideDAO from "../repository/RideRepository";
import AccountGateway from "../gateway/AccountGateway";

export default class AcceptRide {
  constructor(private rideDAO: RideDAO, private accountGateway: AccountGateway) {}

  async execute(input: any) {
    const account = await this.accountGateway.getById(input.driverId);
    if (account && !account.isDriver) throw new Error("Only drivers can accept a ride");
    const ride = await this.rideDAO.getById(input.rideId);
    if (!ride) throw new Error("Ride not found");
    ride.accept(input.driverId);
    await this.rideDAO.update(ride);
  }
}
