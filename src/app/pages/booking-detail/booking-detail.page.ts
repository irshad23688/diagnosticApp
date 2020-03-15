import { BookingSuccessfullyPage } from './../booking-successfully/booking-successfully.page';
import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit, HostListener } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
declare var StripeCheckout;

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss']
})
export class BookingDetailPage implements OnInit {
  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }
  handler: any;
  paymentType: any = 'Bank Account';
  dispData: any = {}
  paymentKeys: any = {}
  constructor(
    private payPal: PayPal,
    private geolocation: Geolocation,
    public modalController: ModalController,
    private navCtrl: NavController,
    private api: RestService
  ) {
    this.api.startLoad();

    this.api.getWithHeader('CompanyDetail/' + this.api.dataTransfer).subscribe((res: any) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.dispData.salon = res.data;
        this.api.dismissLoad();
        this.dispData.salon.distance = Number(this.distance(resp.coords.latitude, resp.coords.longitude, this.dispData.salon.lat, this.dispData.salon.lang, 'K')).toFixed(1)
      }).catch(() => { this.api.dismissLoad() })
    }, err => this.api.dismissLoad())
    this.api.bookingDetails.note = 'nothing';
    this.api.bookingDetails.discount = 0;
    this.api.bookingDetails.payment_status = 1;

    this.api.bookingDetails.customer_id = localStorage.getItem('userLoggedIn');
    this.dispData = this.api.bookingDetails;
    this.api.get('appSetting').subscribe((res: any) => {

      this.paymentKeys = res.data
      this.handler = StripeCheckout.configure({
        key: 'pk_test_n56atH9x5k506LqzqeyqpwqK',
        image: './assets/logois.png',
        locale: 'auto',
        token: token => {
          this.api.bookingDetails.payment_type = 'STRIPE';
          this.api.bookingDetails.payment_token = token.id;
          this.PayWithApi();
        }
      })
    }, () => { })

  }

  ngOnInit() { }

  backPage() {
    this.navCtrl.back();
  }

  async modal() {
    const modal = await this.modalController.create({
      component: BookingSuccessfullyPage,
      cssClass: 'success-modal',
      backdropDismiss: false,
      animated: true
    });
    return await modal.present();
  }

  async continue() {
    let ser: any = []
    let totduration: any = 0;
    this.api.bookingDetails.services.forEach(element => {
      totduration += element.duration
      ser.push(element.id)
      this.api.bookingDetails.service_id = ser
      this.api.bookingDetails.duration = totduration
    });

    if (this.paymentType == 'PayPal') {
      this.api.startLoad();
      this.payPal.init({
        PayPalEnvironmentProduction: this.paymentKeys.PayPalEnvironmentProduction,
        PayPalEnvironmentSandbox: this.paymentKeys.PayPalEnvironmentSandbox
      }).then(() => {
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        })).then(() => {
          let payment = new PayPalPayment(this.dispData.payment, 'USD', 'Description', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((res) => {
            this.api.bookingDetails.payment_type = 'PAYPAL';
            this.api.bookingDetails.payment_token = res.response.id;
            this.api.dismissLoad()
            this.PayWithApi();
          }, (err) => {
            this.api.dismissLoad()
            // Error or render dialog closed without being successful
          });
        }, (err) => {
          this.api.dismissLoad()
          // Error in configuration
        });
      }, (err) => {
        this.api.dismissLoad()
        // Error in initialization, maybe PayPal isn't supported or something else
      });
    } else if (this.paymentType == 'Bank Account') {
      this.handler.open({
        name: 'bookApoint',
        amount: this.dispData.payment * 100,
      });
    } else {
      this.api.bookingDetails.payment_type = 'LOCAL';
      // this.api.bookingDetails.payment_token = 'res.response.id';
      this.api.bookingDetails.payment_status = 0;
      this.PayWithApi()
    }
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

  PayWithApi() {
    this.api.startLoad();
    this.api.postWithHeader('createAppointment', this.api.bookingDetails).subscribe((res: any) => {
      if (res.success == true) {
        this.api.dismissLoad();
        this.modal()
      }
    }, err => {
      if (err.error.message == 'Unauthenticated.') {
        this.api.dismissLoad();
        this.navCtrl.navigateRoot('sign-in')
      }
      else {
        this.api.dismissLoad();
      }
    })
  }

}
