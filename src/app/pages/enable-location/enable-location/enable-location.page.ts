import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
@Component({
  selector: 'app-enable-location',
  templateUrl: './enable-location.page.html',
  styleUrls: ['./enable-location.page.scss']
})
export class EnableLocationPage implements OnInit {
  constructor(public locationAccuracy:LocationAccuracy,public modalController: ModalController) {}

  ngOnInit() {}
  done() {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
        },
        error => alert('Error requesting location permissions ' + JSON.stringify(error))
      );
     this.modalController.dismiss()
  }
}
