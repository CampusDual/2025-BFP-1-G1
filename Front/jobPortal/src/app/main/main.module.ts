import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MatCardModule } from '@angular/material/card'; 
import { JobCatalogueComponent } from './job-catalogue/job-catalogue.component';

@NgModule({
  declarations: [
    JobCatalogueComponent,
    
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatCardModule,
  ]
})
export class MainModule { }
