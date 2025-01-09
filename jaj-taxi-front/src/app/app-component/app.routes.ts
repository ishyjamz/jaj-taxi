import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from '../../components/pages/landing/landing.component';
import { routes as appRoutes } from './app.routes';
import { TaxiServicesComponent } from '../../components/pages/taxi-services/taxi-services.component';
import { ContactUsComponent } from '../../components/pages/contact-us/contact-us.component';
import { AirportTransferComponent } from '../../components/pages/services/airport-transfer/airport-transfer.component';
import { LongDistanceComponent } from '../../components/pages/services/long-distance/long-distance.component';
import { AddressPickupComponent } from '../../components/pages/services/address-pickup/address-pickup.component';
import { stat } from 'fs';
import { StationPickupComponent } from '../../components/pages/services/station-pickup/station-pickup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: 'home', component: LandingComponent },
  { path: 'services', component: TaxiServicesComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'services/airport-transfer', component: AirportTransferComponent },
  { path: 'services/long-distance', component: LongDistanceComponent },
  { path: 'services/address-pickup', component: AddressPickupComponent },
  { path: 'services/station-pickup', component: StationPickupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

