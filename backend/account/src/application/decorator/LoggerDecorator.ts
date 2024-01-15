import UseCase from "../usecase/UseCase";

export default class LoggerDecorator implements UseCase {
  name = "loggerDecorator";
  constructor(readonly usecase: UseCase) {}
  execute(input: any): Promise<any> {
    console.log(input, this.usecase.name, input);
    return this.usecase.execute(input);
  }
}
