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

@NgModule({
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
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatTableModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
})
export class MainModule {}
