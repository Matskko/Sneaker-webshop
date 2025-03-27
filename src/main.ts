import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from "./environments/environment";

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Analytics (Optional, only works in a browser)
if (typeof window !== "undefined") {
  getAnalytics(app);
}

// Bootstrap Angular App
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
