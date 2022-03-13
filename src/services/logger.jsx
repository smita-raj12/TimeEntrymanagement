//import * as Sentry from "@sentry/react";
//import Raven from "raven-js";

function init() {
  return null            
  // Sentry.init({
  //  dsn: "https://589630947f15457fb571d86e1d5dd391@o913960.ingest.sentry.io/5853508",
  //  integrations: [new Integrations.BrowserTracing()],
  //
  //  // Set tracesSampleRate to 1.0 to capture 100%
  //  // of transactions for performance monitoring.
  //  // We recommend adjusting this value in production
  //  tracesSampleRate: 1.0,
  //});

}

function log(error){
    return null
 //   Raven.captureException(error)

}
const logger= { log, init}

export default logger