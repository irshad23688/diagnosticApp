import { NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from 'src/app/rest.service';
@Component({
  selector: 'app-otpverification',
  templateUrl: './otpverification.page.html',
  styleUrls: ['./otpverification.page.scss']
})
export class OTPVerificationPage implements OnInit {
  opt: any = {};
  user: any = {};
  @ViewChild("a") a;
  time: any;
  key: any = ''
  remainingTime: any = 62;
  timeDisp: any;
  randomCode: any;
  constructor(private api: RestService, private navCtrl: NavController) {
    this.timerTick()
    setTimeout(() => {
      this.a.setFocus();
    }, 200);
    this.api.user.subscribe((res: any) => {
      this.user = res
    })

    this.randomCode = Math.floor(1000 + Math.random() * 9000);

  }

  ngOnInit() { }
  backPage() {
    this.navCtrl.back();
  }

  moveFocus(event, nextElement, previousElement) {
    if (event.keyCode == 8 && previousElement) {
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else {
      event.path[0].value = '';
    }
  }

  resendCode() {
    this.randomCode = Math.floor(1000 + Math.random() * 9000);

    this.remainingTime = 62;
    this.timerTick();

    // this.api.startLoad();
    // let d = new FormData()
    // d.append('id', this.user.id)
    // d.append('phone', this.user.forVerify)
    // this.api.post('verifyPhone', d).subscribe((res: any) => {
    //   if (res.success) {
    //     this.api.success('', 'send again..')
    //     this.remainingTime = 62;
    //     this.timerTick();
    //     setTimeout(() => {
    //       this.a.setFocus();
    //     }, 200);
    //     this.api.dismissLoad();
    //   }
    // }, (err) => {
    //   this.api.error('', err.error.message)
    //   this.api.dismissLoad();
    // })
  }

  // for testing purpose ===================================================================

  // continue() {
  //   let otp: any = this.opt.a + '' + this.opt.b + '' + this.opt.c + '' + this.opt.d;

  //   if (otp == this.randomCode) {
  //     let d = new FormData();
  //     d.append('phone', this.user.phone)
  //     d.append('id', this.user.id)
  //     d.append('verify', '1')


  //     this.api.post('verify', d).subscribe((res: any) => {
  //       if (res.success) {
  //         localStorage.setItem('userLoggedIn', res.data.id)
  //         localStorage.setItem('userKey', res.data.token)
  //         this.api.success('', 'You are verifide :)')
  //         this.navCtrl.navigateRoot('slider')
  //       }
  //       else {
  //         this.api.error('', 'invalid otp')
  //       }
  //     }, err => {
        
  //       this.api.error('', err.error.errors.phone[0])
  //     })
  //   }
  //   else {
  //     this.api.error('', "invalid code :/")
  //   }
  // }

  // for professional purpose ===================================================================

  continue() {
    this.api.startLoad();
    let d = new FormData()
    d.append('id', this.user.id)
    d.append('phone', this.user.phone)
    d.append('otp', this.opt.a + '' + this.opt.b + '' + this.opt.c + '' + this.opt.d)
    this.api.post('checkOTP', d).subscribe((res: any) => {
      if (res.success) {
        localStorage.setItem('userLoggedIn', res.data.id)
        localStorage.setItem('userKey', res.data.token)
        this.api.success('', res.msg)
        setTimeout(() => {
          this.api.dismissLoad();
        }, 300);
        this.navCtrl.navigateForward('slider');
      }
    }, (err) => {
      this.api.error('', 'Invalid OTP number.')
      setTimeout(() => {
        this.api.dismissLoad();
      }, 300);
    })
  }

  timerTick() {
    setTimeout(() => {
      this.remainingTime--;
      var h = Math.floor(this.remainingTime / 3600);
      var m = Math.floor(this.remainingTime % 3600 / 60);
      var s = Math.floor(this.remainingTime % 3600 % 60);
      let hDisplay = h > 0 ? h : 0;
      let mDisplay = m > 0 ? m : 0;
      let sDisplay = s > 0 ? s : 1;
      this.timeDisp = mDisplay + 'm : ' + sDisplay + 's'
      if (this.remainingTime != 0) {
        this.timerTick();
      }
    }, 1000);
  }

}
