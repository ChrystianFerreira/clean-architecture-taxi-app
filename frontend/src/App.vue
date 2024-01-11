<script setup lang="ts">
import { ref } from "vue";

const signupForm = ref({
  isPassenger: false,
  isDriver: false,
  name: "",
  email: "",
  cpf: "",
  carPlate: "",
  step: 1,
});
const error = ref("");
const accountId = ref("");

function next() {
  error.value = "";
  if (signupForm.value.step === 1 && !signupForm.value.isPassenger && !signupForm.value.isDriver) {
    error.value = "Select at least one option";
    return;
  }
  if (signupForm.value.step === 2 && !signupForm.value.name) {
    return (error.value = "Invalid name");
  }
  if (signupForm.value.step === 2 && !signupForm.value.email) {
    return (error.value = "Invalid email");
  }

  if (signupForm.value.step === 2 && !signupForm.value.cpf) {
    return (error.value = "Invalid cpf");
  }
  if (signupForm.value.step === 2 && signupForm.value.isDriver && !signupForm.value.carPlate) {
    return (error.value = "Invalid car plate");
  }
  signupForm.value.step++;
}

async function submit() {
  next();
  const response = await fetch("http://localhost:3001/signup", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(signupForm.value),
  });
  const output = await response.json();
  accountId.value = output.accountId;
}

function previous() {
  signupForm.value.step--;
}

function isNextButtonVisible() {
  return signupForm.value.step < 3;
}

function isPreviousButtonVisible() {
  return signupForm.value.step > 1 && signupForm.value.step < 4;
}

function isSubmitButtonVisible() {
  return signupForm.value.step === 3;
}
function setData() {
  signupForm.value.name = "John Doe";
  signupForm.value.cpf = "78245641260";
  signupForm.value.email = `john.doe${Math.random()}@gmail.com`;
}
</script>

<template>
  <div id="step">Step {{ signupForm.step }}</div>
  <br />
  <div v-if="signupForm.step === 1">
    <div>
      <label>
        <input type="checkbox" id="is-passenger" v-model="signupForm.isPassenger" />
        Passenger
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" id="is-driver" v-model="signupForm.isDriver" />
        Driver
      </label>
    </div>
  </div>
  <div v-if="signupForm.step === 2">
    <div>
      <label>Name:</label>
      <div>
        <input v-model="signupForm.name" type="text" id="input-name" />
      </div>
    </div>
    <div>
      <label>Email:</label>
      <div>
        <input v-model="signupForm.email" type="text" id="input-email" />
      </div>
    </div>
    <div>
      <label @click="setData()">CPF:</label>
      <div>
        <input v-model="signupForm.cpf" type="text" id="input-cpf" />
      </div>
    </div>
    <div v-if="signupForm.isDriver">
      <label>Car plate:</label>
      <div>
        <input v-model="signupForm.carPlate" type="text" id="input-car-plate" />
      </div>
    </div>
  </div>
  <div v-if="signupForm.step === 3">
    <div id="name">Name: {{ signupForm.name }}</div>
    <div id="email">Email: {{ signupForm.email }}</div>
    <div id="cpf">Cpf: {{ signupForm.cpf }}</div>
    <div v-if="signupForm.isDriver" id="car-plate">Car plate: {{ signupForm.carPlate }}</div>
  </div>
  <div v-if="signupForm.step === 4">
    <div v-if="accountId" id="account-id">Account id: {{ accountId }}</div>
  </div>
  <br />
  <button v-if="isPreviousButtonVisible()" @click="previous()" id="previous-button">Previous</button>
  <button v-if="isNextButtonVisible()" @click="next()" id="next-button">Next</button>
  <button v-if="isSubmitButtonVisible()" id="submit-button" @click="submit()">Submit</button>
  <div id="error">{{ error }}</div>
</template>

<style></style>
