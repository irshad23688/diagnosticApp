import { Component, ViewChildren, QueryList } from '@angular/core';
import { Platform, NavController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { RestService } from './rest.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  appPages: any = [
    { name: 'Filter', path: '/filter' },
    { name: 'Book Appointment', path: '/book-appointment' },
    { name: 'Select Service', path: '/select-service' },
    { name: 'Booking Detail', path: '/booking-detail' },
    { name: 'Verify Phone number', path: '/phone-verification' },
    { name: 'Verify Otp', path: '/otpverification' }
  ];
  importantKeys: any = {};
  constructor(
    private oneSignal: OneSignal,
    public router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private api: RestService
  ) {
    this.api.get('appSetting').subscribe((res: any) => {
      this.importantKeys = res.data
    }, () => { })
    this.api.getWithHeader('userProfile').subscribe((res: any) => {
      this.api.user.next(res.data)
    }, err => {
      if (err.error.message == "Unauthenticated.") {
        localStorage.clear()
        this.navCtrl.navigateRoot('starter')
      }
    })

    if (localStorage.getItem('userLoggedIn')) {
      this.navCtrl.navigateRoot('/tabs/nearBy')
    }
    else {
      this.navCtrl.navigateRoot('starter')
    }
    this.initializeApp();
  }

  initializeApp() {
    this.backButtonEvent()
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#551b1d23');
      this.splashScreen.hide();
      this.oneSignal.startInit(this.importantKeys.oneSignalAppID, this.importantKeys.oneSignalProjectNo);
      this.oneSignal.endInit();
    });
  }

  backButtonEvent() {
    console.log('this.api.load', this.api.load)
    this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if ((this.router.url === '/tabs/nearBy')
          || (this.router.url === '/tabs/appoinment')
          || (this.router.url === '/tabs/notification')
          || (this.router.url === '/tabs/profile')
          || (this.router.url === '/starter')) {
          navigator['app'].exitApp();
        }
      });
    });
  }
}
