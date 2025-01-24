import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app-component/app.config';
import { AppComponent } from './app/app-component/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-component/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err),
// );

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // Enable fetch APIs
    provideRouter(routes), provideAnimationsAsync(),
  ],
}).catch((err) => console.error(err));
