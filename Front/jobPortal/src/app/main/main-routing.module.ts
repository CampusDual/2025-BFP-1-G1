import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginBoxComponent } from './login-box/login-box.component';
import { JobCatalogueComponent } from './job-catalogue/job-catalogue.component';
import { CreateOfferComponent } from './user-profile/create-offer/create-offer.component';

const routes: Routes = [
  { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
  { path: 'login', component: LoginBoxComponent },
  { path: 'userprofile', component: UserProfileComponent },
  { path: 'catalogue', component: JobCatalogueComponent },
  { path: 'createOffer', component: CreateOfferComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
