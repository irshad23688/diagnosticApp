import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss']
})
export class SignInPage implements OnInit {
  user: any = {};
  deviceToken: any = '123';
  importantKeys: any = {};

  constructor(private oneSignal: OneSignal, private navCtrl: NavController, private api: RestService) {
    this.user.email = 'emma@gmail.com';
    this.user.password = '123456';
    this.api.get('appSetting').subscribe((res: any) => {
      this.importantKeys = res.data
    }, () => { })
    this.oneSignal.startInit(this.importantKeys.oneSignalAppID, this.importantKeys.oneSignalProjectNo);
    this.oneSignal.getIds().then((ids) => {
      this.deviceToken = ids.userId
    })
    this.oneSignal.endInit();
    this.deviceToken = '123';
  }

  ngOnInit() { }

  login() {
    this.api.startLoad()
    let d = new FormData()
    d.append('email', this.user.email)
    d.append('password', this.user.password)
    d.append('provider', 'LOCAL')
    d.append('device_token', this.deviceToken)

    this.api.post('login?=', d).subscribe((res: any) => {
      this.api.user.next(res.data)
      if (res.success) {
        setTimeout(() => {
          this.api.dismissLoad();
        }, 500);
        localStorage.setItem('userLoggedIn', res.data.id)
        localStorage.setItem('userKey', res.data.token)
        this.api.success('', 'Login Success')
        this.navCtrl.navigateRoot('/tabs/nearBy');
      } else {
        this.api.error('', res.msg)
        setTimeout(() => {
          this.api.dismissLoad();
        }, 500);
      }
    }, err => {
      this.api.user.next(err.error.data)
      setTimeout(() => {
        this.api.dismissLoad();
      }, 500);
      this.api.error('', err.error.msg)
      if (err.error.msg == "Please Verify Your Phone number.") {
        this.navCtrl.navigateForward('phone-verification');
      }
    })

  }

  forgotPassword() {
    this.navCtrl.navigateForward('forgot-password');
  }

  signUp() {
    this.navCtrl.navigateForward('sign-up');
  }
}
