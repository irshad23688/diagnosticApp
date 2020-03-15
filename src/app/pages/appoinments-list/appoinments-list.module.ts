import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AppoinmentsListPage } from './appoinments-list.page';

const routes: Routes = [
  {
    path: '',
    component: AppoinmentsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppoinmentsListPage]
})
export class AppoinmentsListPageModule {}
