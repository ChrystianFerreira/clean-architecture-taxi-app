import Observable from "../Observable";

export default class SignupComponentDomain extends Observable {
  isPassenger = false;
  isDriver = false;
  name = "";
  email = "";
  cpf = "";
  carPlate = "";
  step = 1;
  error = "";

  constructor() {
    super();
  }

  next() {
    this.error = "";
    if (this.step === 1 && !this.isPassenger && !this.isDriver) {
      this.error = "Select at least one option";
      return;
    }
    if (this.step === 2 && !this.name) {
      return (this.error = "Invalid name");
    }
    if (this.step === 2 && !this.email) {
      return (this.error = "Invalid email");
    }

    if (this.step === 2 && !this.cpf) {
      return (this.error = "Invalid cpf");
    }
    if (this.step === 2 && this.isDriver && !this.carPlate) {
      return (this.error = "Invalid car plate");
    }
    this.step++;
  }

  previous() {
    this.step--;
  }

  isNextButtonVisible() {
    return this.step < 3;
  }

  isPreviousButtonVisible() {
    return this.step > 1 && this.step < 4;
  }

  isSubmitButtonVisible() {
    return this.step === 3;
  }

  submit() {
    this.next();
    const data = {
      isPassenger: this.isPassenger,
      isDriver: this.isDriver,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      carPlate: this.carPlate,
    };
    this.notify({ name: "submitted", data });
  }

  setData() {
    this.name = "John Doe";
    this.cpf = "78245641260";
    this.email = `john.doe${Math.random()}@gmail.com`;
  }
}