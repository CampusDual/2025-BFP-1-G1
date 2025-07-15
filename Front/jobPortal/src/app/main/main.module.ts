import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MatCardModule } from '@angular/material/card';
import { JobCatalogueComponent } from './job-catalogue/job-catalogue.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateOfferComponent } from './user-profile/create-offer/create-offer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatButtonModule } from '@angular/material/button';
import { LoginBoxComponent } from './login-box/login-box.component';
import { UsersListComponent } from '../users-list/users-list.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CompanyOfferListComponent } from './user-profile/company-offer-list/company-offer-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token-interceptor';
import { CompanySignupComponent } from './company-signup/company-signup.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { EditOfferComponent } from './edit-offer/edit-offer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],

  declarations: [
    JobCatalogueComponent,
    CreateOfferComponent,
    UserProfileComponent,
    LoginBoxComponent,
    UsersListComponent,
    CompanyOfferListComponent,
    SignUpFormComponent,
    CandidateProfileComponent,
    AdminProfileComponent,
    CompanySignupComponent,
    OfferDetailsComponent,
    EditOfferComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatTableModule,
    MatDividerModule,
    MatSelectModule,
    MatSlideToggleModule,
    RouterModule,
    MatTabsModule,
  ],
})
export class MainModule {}
