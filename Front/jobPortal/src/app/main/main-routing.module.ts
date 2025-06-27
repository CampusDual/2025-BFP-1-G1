import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginBoxComponent } from './login-box/login-box.component';
import { JobCatalogueComponent } from './job-catalogue/job-catalogue.component';
import { CreateOfferComponent } from './user-profile/create-offer/create-offer.component';
import { authGuard } from '../guards/auth.guard';
import { noAuthGuard } from '../guards/no-auth.guard';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
  { path: 'login', component: LoginBoxComponent, canActivate: [noAuthGuard] },
  {
    path: 'userprofile',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  { path: 'catalogue', component: JobCatalogueComponent },
  {
    path: 'createOffer',
    component: CreateOfferComponent,
    canActivate: [authGuard],
  },
  {
    path: 'signup',
    component: SignUpFormComponent,
    canActivate: [noAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
