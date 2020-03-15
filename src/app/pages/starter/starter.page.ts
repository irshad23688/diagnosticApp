import { RestService } from '../../rest.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.page.html',
  styleUrls: ['./starter.page.scss']
})
export class StarterPage implements OnInit {
  deviceToken: any;
  constructor(private navCtrl: NavController,
    private googlePlus: GooglePlus,
    private oneSignal: OneSignal, private api: RestService, private navController: NavController, private fb: Facebook) {
    this.oneSignal.startInit('29561882-aa25-43ef-b277-83a677b09524', '900958756549');
    this.oneSignal.getIds().then((ids) => {
      this.deviceToken = ids.userId
    })
    this.oneSignal.endInit();
  }

  ngOnInit() { }

  signInPage() {
    this.navController.navigateForward('sign-in');
  }

  fbLogin() {
    this.fb.login(["email"]).then(response => {
      this.api.fbUser(response.authResponse.accessToken).subscribe((res: any) => {
        this.api.user.next(res)
        let d = new FormData();
        d.append('provider', 'FACEBOOK')
        d.append('provider_token', res.id)
        d.append('name', res.name)
        d.append('device_token', this.deviceToken)

        this.api.post('login', d).subscribe((res: any) => {
          this.api.user.next(res.data)
          if (res.success) {
            this.api.dismissLoad()
            localStorage.setItem('userLoggedIn', res.data.id)
            localStorage.setItem('userKey', res.data.token)
            this.api.success('', 'Login Success')
            this.navCtrl.navigateRoot('/tabs/nearBy');
          }
          else {
            this.api.error('', res.msg)
            this.api.dismissLoad()
            this.navCtrl.navigateForward('phone-verification');
          }
        }, err => {
          this.api.user.next(err.error.data)
          this.api.dismissLoad()
          this.api.error('', err.error.msg)
          if (err.error.msg == "Please Verify Your Phone number.") {
            this.navCtrl.navigateForward('phone-verification');
          }
        })
      })
    }).catch(e => { })
  }

  googleLogin() {

    this.googlePlus.login(
      {
        webClientId: "1058223007287-shgn0kj8d7rm3qg38etnsljct0s5cciv.apps.googleusercontent.com",

      }).then(response => {
        this.api.user.next(response)
      
        let d = new FormData();
        d.append('provider', 'GOOGLE')
        d.append('provider_token', response.userid)
        d.append('name', response.displayName)
        d.append('device_token', this.deviceToken)
        d.append('email', response.email)

        this.api.post('login', d).subscribe((res: any) => {
          this.api.user.next(res.data)
          if (res.success) {
            this.api.dismissLoad()
            localStorage.setItem('userLoggedIn', res.data.id)
            localStorage.setItem('userKey', res.data.token)
            this.api.success('', 'Login Success')
            this.navCtrl.navigateRoot('/tabs/nearBy');
          }
          else {
            this.api.error('', res.msg)
            this.api.dismissLoad()
            this.navCtrl.navigateForward('phone-verification');
          }
        }, err => {
          alert(JSON.stringify(err)) 
          this.api.user.next(err.error.data)
          this.api.dismissLoad()
          this.api.error('', err.error.msg)
          if (err.error.msg == "Please Verify Your Phone number.") {
            this.navCtrl.navigateForward('phone-verification');
          }
        })
      }).catch((err) => {
        alert(JSON.stringify(err))
      })
  }
}
