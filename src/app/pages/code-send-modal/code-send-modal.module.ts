import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CodeSendModalPage } from './code-send-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CodeSendModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CodeSendModalPage]
})
export class CodeSendModalPageModule {}
