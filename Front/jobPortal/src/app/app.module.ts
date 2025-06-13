import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginBoxComponent } from './main/login-box/login-box.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { UsersListComponent } from './users-list/users-list.component';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './main/user-profile/user-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginBoxComponent,
    FooterComponent,
    HeaderComponent,
    UsersListComponent,
    UserProfileComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
