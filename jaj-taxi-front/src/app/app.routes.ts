import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from '../components/pages/landing/landing.component';
import { routes as appRoutes } from './app.routes';
import { TaxiServicesComponent } from '../components/pages/taxi-services/taxi-services.component';
import { ContactUsComponent } from '../components/pages/contact-us/contact-us.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: 'home', component: LandingComponent },
  { path: 'services', component: TaxiServicesComponent },
  { path: 'contact', component: ContactUsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
