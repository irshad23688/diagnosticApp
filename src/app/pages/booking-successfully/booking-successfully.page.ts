import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-successfully',
  templateUrl: './booking-successfully.page.html',
  styleUrls: ['./booking-successfully.page.scss']
})
export class BookingSuccessfullyPage implements OnInit {
  constructor(public navCtrl: NavController, public modalController: ModalController) { }

  ngOnInit() { }
  continueBooking() {
    this.modalController.dismiss();
    this.navCtrl.navigateRoot('/tabs/nearBy');
  }

  appointment() {
    this.modalController.dismiss();
    this.navCtrl.navigateRoot('/tabs/appoinment');
  }
}
