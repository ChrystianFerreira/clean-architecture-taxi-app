import { expect, test } from "vitest";
import SignupComponentDomain from "../src/domain/SignupComponentDomain";

test("Deve testar o fluxo do wizard", async function () {
  const signupComponentDomain = new SignupComponentDomain();
  signupComponentDomain.isPassenger = true;
  const name = "John Doe";
  const email = `john.doe${Math.random()}@gmail.com`;
  const cpf = "97456321558";
  const carPlate = "AAA9999";
  expect(signupComponentDomain.step).toBe(1);
  expect(signupComponentDomain.isPreviousButtonVisible()).toBe(false);
  signupComponentDomain.next();
  expect(signupComponentDomain.step).toBe(2);
  signupComponentDomain.name = name;
  signupComponentDomain.email = email;
  signupComponentDomain.cpf = cpf;
  signupComponentDomain.isDriver = true;
  signupComponentDomain.carPlate = carPlate;
  signupComponentDomain.next();
  expect(signupComponentDomain.step).toBe(3);
  expect(signupComponentDomain.isNextButtonVisible()).toBe(false);
  signupComponentDomain.previous();
  expect(signupComponentDomain.step).toBe(2);
  signupComponentDomain.previous();
  expect(signupComponentDomain.step).toBe(1);
});

test("Não deve ir para o passo 2 se pelo menos uma opção (passenger ou driver) não estiver marcada", async function () {
  const signupComponentDomain = new SignupComponentDomain();
  await signupComponentDomain.next();
  expect(signupComponentDomain.step).toBe(1);
  expect(signupComponentDomain.error).toBe("Select at least one option");
  signupComponentDomain.isPassenger = true;
  await signupComponentDomain.next();
  expect(signupComponentDomain.error).toBe("");
});

test("Não deve ir para o passo 3 se os campos nome, email, cpf e placa do carro (se for motorista) não estiverem preenchidos", async function () {
  const signupComponentDomain = new SignupComponentDomain();
  const name = "John Doe";
  const email = `john.doe${Math.random()}@gmail.com`;
  const cpf = "97456321558";
  const carPlate = "AAA9999";
  expect(signupComponentDomain.step).toBe(1);
  signupComponentDomain.isDriver = true;
  expect(signupComponentDomain.isPreviousButtonVisible()).toBe(false);
  signupComponentDomain.next();
  expect(signupComponentDomain.step).toBe(2);
  signupComponentDomain.next();
  expect(signupComponentDomain.error).toBe("Invalid name");
  signupComponentDomain.name = name;
  signupComponentDomain.next();
  expect(signupComponentDomain.error).toBe("Invalid email");
  signupComponentDomain.email = email;
  signupComponentDomain.next();
  expect(signupComponentDomain.error).toBe("Invalid cpf");
  signupComponentDomain.cpf = cpf;
  signupComponentDomain.next();
  expect(signupComponentDomain.error).toBe("Invalid car plate");
  signupComponentDomain.carPlate = carPlate;
  signupComponentDomain.next();
  expect(signupComponentDomain.step).toBe(3);
});
