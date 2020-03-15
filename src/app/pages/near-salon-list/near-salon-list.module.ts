import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NearSalonListPage } from './near-salon-list.page';

const routes: Routes = [
  {
    path: '',
    component: NearSalonListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NearSalonListPage]
})
export class NearSalonListPageModule {}
