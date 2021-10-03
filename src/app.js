import Vue from "vue";
import { Workbox } from "workbox-window";
import * as Sentry from "@sentry/browser";
import App from "./App.vue";
import router from "./components/Router";

if (window.location.href.includes("satvis.space")) {
  Sentry.init({ dsn: "https://0c7d1a82eedb48ee8b83d87bf09ad144@sentry.io/1541793" });
}

const app = new Vue({
  el: "#app",
  components: {
    app: App,
  },
  render: (h) => h("app"),
  router,
});

// Export Vue for debugger
window.app = app;

/* global cc */
// cc.sats.addFromTleUrl("data/tle/norad/active.txt", ["Active"]);
cc.sats.addFromTleUrl("https://celestrak.com/NORAD/elements/planet.txt", ["Planet"]);
cc.sats.addFromTleUrl("data/tle/catalog.txt", ["catalog"]);
cc.sats.addFromTleUrl("https://celestrak.com/NORAD/elements/globalstar.txt", ["Globalstar"]);
cc.sats.addFromTleUrl("https://celestrak.com/NORAD/elements/resource.txt", ["Resource"]);
cc.sats.addFromTleUrl("https://celestrak.com/NORAD/elements/science.txt", ["Science"]);
cc.sats.addFromTleUrl("https://celestrak.com/NORAD/elements/stations.txt", ["Stations"]);
cc.sats.addFromTleUrl("https://celestrak.com/NORAD/elements/weather.txt", ["Weather"]);
cc.sats.addFromTleUrl("https://celestrak.com/NORAD/elements/tle-new.txt", ["New"]);

if (cc.sats.enabledTags.length === 0) {
  cc.sats.enableTag("catalog");
}

// Register service worker
if ("serviceWorker" in navigator) {
  const wb = new Workbox("sw.js");
  wb.addEventListener("controlling", (evt) => {
    if (evt.isUpdate) {
      console.log("Reloading page for latest content");
      window.location.reload();
    }
  });
  wb.register();
}
