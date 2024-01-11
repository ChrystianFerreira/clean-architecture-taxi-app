<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import AccountGateway from "./infra/gateway/AccountGateway";
import SignupComponentDomain from "./domain/SignupComponentDomain";

const signupForm = ref(new SignupComponentDomain());
const accountId = ref("");
let accountGateway: AccountGateway;

signupForm.value.register(async function (event: any) {
  if (event.name === "submitted") {
    const input = event.data;
    const output = await accountGateway.signup(input);
    accountId.value = output.accountId;
  }
});

onMounted(() => {
  accountGateway = inject("accountGateway") as AccountGateway;
});
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
      <label @click="signupForm.setData()">CPF:</label>
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
  <button v-if="signupForm.isPreviousButtonVisible()" @click="signupForm.previous()" id="previous-button">
    Previous
  </button>
  <button v-if="signupForm.isNextButtonVisible()" @click="signupForm.next()" id="next-button">Next</button>
  <button v-if="signupForm.isSubmitButtonVisible()" id="submit-button" @click="signupForm.submit()">Submit</button>
  <div id="error">{{ signupForm.error }}</div>
</template>

<style></style>
