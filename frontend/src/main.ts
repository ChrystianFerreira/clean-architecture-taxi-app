import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import FetchAdapter from "./infra/http/FetchAdapter";
import AccountGatewayHttp from "./infra/gateway/AccountGatewayHttp";

const httpClient = new FetchAdapter();
const accountGateway = new AccountGatewayHttp(httpClient);

createApp(App).provide("accountGateway", accountGateway).mount("#app");
