import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginBoxComponent } from './login-box/login-box.component';
import { JobCatalogueComponent } from './job-catalogue/job-catalogue.component';
import { CreateOfferComponent } from './user-profile/create-offer/create-offer.component';
import { authGuard } from '../guards/auth.guard';
import { noAuthGuard } from '../guards/no-auth.guard';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { CompanySignupComponent } from './company-signup/company-signup.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { EditOfferComponent } from './edit-offer/edit-offer.component';
import { CandidateDetailsComponent } from './candidate-profile/candidate-details/candidate-details.component';

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
    path: 'candidateprofile',
    component: CandidateProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'adminprofile',
    component: AdminProfileComponent,
    canActivate: [authGuard],
  },
  { path: 'signup', component: SignUpFormComponent },
  {
    path: 'companysignup',
    component: CompanySignupComponent,
  },
  { path: 'signup', component: SignUpFormComponent },
  {
    path: 'offerDetails/:id',
    component: OfferDetailsComponent,
  },

  {
    path: 'editOffer/:id',
    component: EditOfferComponent,
    canActivate: [authGuard],
  },
  {
    path: 'candidateDetails',
    component: CandidateDetailsComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
