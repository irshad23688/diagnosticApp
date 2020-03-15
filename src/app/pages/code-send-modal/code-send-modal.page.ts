import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-code-send-modal',
  templateUrl: './code-send-modal.page.html',
  styleUrls: ['./code-send-modal.page.scss']
})
export class CodeSendModalPage implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
  done() {
    this.modalCtrl.dismiss();
  }
}
