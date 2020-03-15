import { NearSalonListPage } from './../near-salon-list/near-salon-list.page';
import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { EnableLocationPage } from '../enable-location/enable-location/enable-location.page';
import { FilterPage } from '../filter/filter.page';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
declare var google;

@Component({
  selector: 'app-near-by',
  templateUrl: './near-by.page.html',
  styleUrls: ['./near-by.page.scss']
})
export class NearByPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  branchList: any = []
  tempData: any = []
  geocodererer = new google.maps.Geocoder();
  dispLocation: any;
  marker: any;
  circle: any;
  constructor(private diagnostic: Diagnostic, private geolocation: Geolocation, private navCtrl: NavController, private api: RestService, public modalController: ModalController) {

    this.diagnostic.isGpsLocationEnabled()
      .then((enabled) => {
        if (enabled) {
          this.enableLocation();
        } 
      }).catch(e => {})

    this.geolocation.getCurrentPosition().then((resp) => {
      this.api.google(resp.coords.latitude, resp.coords.longitude).subscribe((res: any) => {
        res.results[0].address_components.forEach(element => {
          if (element.types.find(type => type == 'locality') || element.types.find(type => type == 'administrative_area_level_2')) {
            element.long_name;
            this.dispLocation = element.long_name
          }
        });
      }, () => {
      })
    })
  }

  ngOnInit() {
    this.api.get('getBranches').subscribe((res: any) => {
      this.branchList = res.data;
      this.tempData = res.data;
      this.initMap();
    }), err => { }
  }

  viewSalon(data) {
    this.api.dataTransfer = data.id
    this.navCtrl.navigateForward('salon-detail')
  }

  bookNow(data) {
    this.api.dataTransfer = data.id
    this.api.bookingDetails.location_id = data.id;
    this.navCtrl.navigateForward('select-service')
  }

  initMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let mapoption = {
        center: new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude),
        zoom: 15,
        streetViewControl: false,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: 'greedy'
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapoption);
      this.branchList.forEach(element => {
        new google.maps.Marker({
          position: new google.maps.LatLng(element.lat, element.lang),
          map: this.map,
          icon: {
            url: "../../../assets/images/near-by/pin-image.png",
            labelOrigin: new google.maps.Point(25, 63),
            scaledSize: new google.maps.Size(56, 64)
          },
          label: {
            text: element.name,
            fontSize: "11px",
            fontFamily: "tofini_medium",
            width: "30px"
          }
        });
      });
    }).catch((error) => {
      this.enableLocation()
    });
  }

  setCurrent() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.map.setCenter(
        new google.maps.LatLng(
          resp.coords.latitude, resp.coords.longitude,
        )
      );
    })
  }

  currentLocation() {

    this.circle != undefined ? this.circle.setMap(null) : '';
    this.marker != undefined ? this.marker.setMap(null) : '';

    var markerIconCurrent = {
      url: "../../../assets/images/near-by/nevigation-icon.gif",
      scaledSize: new google.maps.Size(35, 35),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 17)
    };

    this.geolocation.getCurrentPosition().then((resp) => {
      this.map.setCenter(
        new google.maps.LatLng(
          resp.coords.latitude, resp.coords.longitude,
        )
      );
      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude),
        map: this.map,
        icon: markerIconCurrent,
        animation: google.maps.Animation.DROP,
      });
      this.circle = new google.maps.Circle({
        map: this.map,
        radius: 400,
        fillColor: "#007AFF",
        strokeWeight: 0,
        fillOpacity: 0.1
      });
      this.circle.bindTo("center", this.marker, "position");
    })
  }

  async openNearModal() {
    const modal = await this.modalController.create({
      component: NearSalonListPage,
      cssClass: 'nearSalon-modal',
      animated: true
    });
    return await modal.present();
  }

  search(data) {
    this.geocodererer.geocode({ address: data }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.map.setCenter(
          new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())
        );
      }
    });
  }

  async enableLocation() {
    const modal = await this.modalController.create({
      component: EnableLocationPage,
      cssClass: "enableLocation-modal",
      backdropDismiss: false
    });
    modal.onDidDismiss().then(() => this.initMap())
    return await modal.present();
  }

  async openFilter() {
    const modal = await this.modalController.create({
      component: FilterPage
    });
    modal.onDidDismiss().then((data) => {
      if (data['data'] != undefined) {
        !data['data'].reset ? this.branchList = data['data'] : this.branchList = this.tempData;
      }
    });
    return await modal.present();
  }

}
