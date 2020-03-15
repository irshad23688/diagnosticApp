import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ImageModalPage } from 'src/app/image-modal/image-modal.page';
import { SharePage } from '../share/share.page';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import * as moment from "moment";
declare var google;
declare var window;

@Component({
  selector: 'app-salon-detail',
  templateUrl: './salon-detail.page.html',
  styleUrls: ['./salon-detail.page.scss']
})
export class SalonDetailPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  dirService = new google.maps.DirectionsService();
  dirRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false });
  services: any = [];
  reviews: any = [];
  activeStar: any = 3;
  avtiveSegment: any = 'About';
  aboutData: any = {}
  stylistData: any = []
  gallary: any = []
  map: any;
  state: any = 1;
  show = false;
  marker: any;
  rateData: any = {};
  user: any = {};
  comment: any = '';
  salonStatus: any = false;
  constructor(private launchNavigator: LaunchNavigator, private geolocation: Geolocation, private navCtrl: NavController, private api: RestService, public modalController: ModalController) {
    this.api.startLoad();
    this.api.rate.subscribe((res: any) => {
      this.rateData = res;
      this.avtiveSegment = res.rateStatus ? res.state : 'About'
    }).unsubscribe()

    this.api.getWithHeader('userProfile').subscribe((res: any) => {
      this.user = res.data;
    }, err => {
    })

    this.api.getWithHeader('CompanyDetail/' + this.api.dataTransfer).subscribe((res: any) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.aboutData = res.data;
        this.aboutData.distance = Number(this.distance(resp.coords.latitude, resp.coords.longitude, this.aboutData.lat, this.aboutData.lang, 'K')).toFixed(1)

        let current = moment().format('HH:mm');
        let start = moment("2019-07-19 " + this.aboutData.openTime).format('HH:mm');
        let stop = moment('2019-07-27 ' + this.aboutData.closeTime).format('HH:mm');

        if (current >= start && current <= stop) {
          this.salonStatus = true;
          this.api.dismissLoad()
        }
        else {
          this.salonStatus = false;
          this.api.dismissLoad()
        }
      })
    }, err => {
      this.api.dismissLoad()
    })

    this.api.get('getSpecialist/' + this.api.dataTransfer).subscribe((res: any) => {
      this.stylistData = res.data;
    }, err => { })

    this.api.get('category/' + this.api.dataTransfer).subscribe((res: any) => {
      this.services = res.data;
    }, err => { })

    this.api.get('gallery/' + this.api.dataTransfer).subscribe((res: any) => {
      this.gallary = res.data;
    }, err => { })

    this.api.get('branchReviews/' + this.api.dataTransfer).subscribe((res: any) => {
      this.reviews = res.data;
      this.reviews.forEach(element => {
        let dt = new Date(element.created_at)
        element.ago = moment([dt.getFullYear(), dt.getMonth(), dt.getDate()]).fromNow();
      });
    }, err => { })

  }

  ngOnInit() {
    if (this.avtiveSegment == 'About') {
      setTimeout(() => {
        this.initMap()
      }, 1000);
    }
    setTimeout(() => {
    }, 1000);
  }

  showTime(val) {
    this.show = val;
  }

  viewCet() {
    this.api.bookingDetails.location_id = this.api.dataTransfer;
    this.navCtrl.navigateForward('select-service')
  }

  setRating(no) {
    this.activeStar = no;
  }

  backPage() {
    this.navCtrl.navigateBack('tabs/nearBy');
  }

  logScrolling(ev) {
    if (ev.detail.scrollTop >= 200) {
      this.state = 2
    }
    else {
      this.state = 1
    }
  }

  openPreview(img, index) {
    let privew: any = {}
    privew.images = img;
    privew.index = index;

    this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        img: privew,
        index: index
      },
      cssClass: 'my-modal'
    }).then(modal => {
      modal.present();
    });
  }

  initMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let mapoption = {
        center: new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude),
        zoom: 15,
        streetViewControl: false,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapoption);
      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude),
        map: this.map
      });
    })
  }

  bookNow() {
    this.api.bookingDetails.salon_id = this.api.dataTransfer;
    this.navCtrl.navigateForward('select-service')
  }

  openWeb() {
    var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    window.open(this.aboutData.website, "CNN_WindowName", strWindowFeatures);
  }

  async share() {
    const modal = await this.modalController.create({
      component: SharePage,
      componentProps: {
        data: this.aboutData
      },
      cssClass: 'shareModal'
    });
    return await modal.present();
  }

  getDirection() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let a = resp.coords.latitude + ',' + resp.coords.longitude;
      let b = this.aboutData.lat + ',' + this.aboutData.lang
      this.dirRenderer.setMap(this.map);
      var request = {
        origin: a,
        destination: b,
        travelMode: google.maps.TravelMode.DRIVING
      };
      this.dirService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          this.dirRenderer.setDirections(result);
          this.marker.setMap(null);
        }
        else {
          this.api.error('', 'its a way way long')
        }
      });
    }).catch((error) => {

    });
  }

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

  bookmark() {
    this.api.startLoad();
    let d = new FormData()
    d.append('location_id', this.aboutData.id)
    this.api.postWithHeader('addFavourite', d).subscribe((res: any) => {
      if (res.msg == "Remove from Bookmark!") {
        this.aboutData.favourite = 'no'
        this.api.error('', res.msg)
        setTimeout(() => {
          this.api.dismissLoad();
        }, 500);
      }
      else {
        this.aboutData.favourite = 'yes'
        setTimeout(() => {
          this.api.dismissLoad();
        }, 500);
        this.api.success('', res.msg)
      }
    }, err => {
      setTimeout(() => {
        this.api.dismissLoad();
      }, 500);
    })
  }

  openMap() {
    let options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.USER_SELECT
    }
    this.launchNavigator.navigate(this.aboutData.address, options)
  }

  post() {
    let d = new FormData()
    d.append('appointment_id', this.rateData.id)
    d.append('employee_id', this.rateData.employee_id)
    d.append('customer_id', this.user.id)
    d.append('location_id', this.rateData.location_id)
    d.append('message', this.comment)
    d.append('rate', this.activeStar)

    this.api.postWithHeader('addReviews', d).subscribe((res: any) => {
      this.api.get('branchReviews/' + this.api.dataTransfer).subscribe((res: any) => {
        this.reviews = res.data;
        this.reviews.forEach(element => {
          let dt = new Date(element.created_at)
          element.ago = moment([dt.getFullYear(), dt.getMonth(), dt.getDate()]).fromNow();
        });
        this.api.rate.next({ rateStatus: false })
        this.rateData.rateStatus = false
      }, err => { })
    }, err => {
    })
  }

  ionViewWillLeave() {
    this.api.rate.next({ rateStatus: false })
  }
}
