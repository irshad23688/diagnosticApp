import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SalonDetailPage } from './salon-detail.page';
import { TimeAgoPipe } from 'time-ago-pipe';

const routes: Routes = [
  {
    path: '',
    component: SalonDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    
  ],
  declarations: [SalonDetailPage,TimeAgoPipe]
})
export class SalonDetailPageModule {}
