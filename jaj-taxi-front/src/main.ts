import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app-component/app.config';
import { AppComponent } from './app/app-component/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-component/app.routes';

// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err),
// );

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // Enable fetch APIs
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
