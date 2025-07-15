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
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { EditOfferComponent } from './edit-offer/edit-offer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CandidateDetailsComponent } from './candidate-profile/candidate-details/candidate-details.component';
import {MatTabsModule} from '@angular/material/tabs';


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
    OfferDetailsComponent,
    EditOfferComponent,
    CandidateDetailsComponent,
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
    MatDividerModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTabsModule,
  ],
})
export class MainModule {}
