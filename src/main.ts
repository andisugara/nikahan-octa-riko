import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import lazyPlugin from "vue3-lazy";
import NikahFix from "@images/loading.gif";

// Create pinia (store)
const pinia = createPinia();

// Create and mount app
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(lazyPlugin, {
  loading: NikahFix,
  error: NikahFix,
});
app.mount("#app");
