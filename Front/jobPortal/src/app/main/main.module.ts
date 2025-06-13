import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MatCardModule } from '@angular/material/card'; 
import { JobCatalogueComponent } from './job-catalogue/job-catalogue.component';
import {MatGridListModule} from '@angular/material/grid-list'; 

@NgModule({
  declarations: [
    JobCatalogueComponent,
    
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatCardModule,
    MatGridListModule
  ]
})
export class MainModule { }
