import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { RestService } from 'src/app/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-near-salon-list',
  templateUrl: './near-salon-list.page.html',
  styleUrls: ['./near-salon-list.page.scss']
})
export class NearSalonListPage implements OnInit {
  img: any;
  branchList: any = [];
  dispLocation: any;

  constructor(private geolocation: Geolocation, private navCtrl: NavController, private api: RestService, private navParams: NavParams, private modalController: ModalController) {
    this.api.startLoad()
    this.geolocation.getCurrentPosition().then((resp) => {
      this.api.google(resp.coords.latitude, resp.coords.longitude).subscribe((res: any) => {

        res.results[0].address_components.forEach(element => {
          if (element.types.find(type => type == 'locality')) {
            element.long_name;
            this.dispLocation = element.long_name
          }
        });
      })
      this.api.get('getBranches').subscribe((res: any) => {
        this.api.dismissLoad()
        res.data.forEach(element => {
          element.distance = Number(this.distance(resp.coords.latitude, resp.coords.longitude, element.lat, element.lang, 'K')).toFixed(1)
          if (element.distance >= 40.2336) {
            this.branchList.push(element)
          }
        });
      }), err => { this.api.dismissLoad() }
    })

  }

  viewBranch(branch) {
    this.api.dataTransfer = branch.id;
    this.navCtrl.navigateForward('salon-detail')
    this.modalController.dismiss()
  }

  ngOnInit() { }

  distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      let radlat1 = Math.PI * lat1 / 180;
      let radlat2 = Math.PI * lat2 / 180;
      let theta = lon1 - lon2;
      let radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }
}
