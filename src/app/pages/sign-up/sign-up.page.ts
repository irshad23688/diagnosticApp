import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss']
})
export class SignUpPage implements OnInit {
  user: any = {};
  err: any = {};
  importantKeys: any;
  constructor(private api:RestService,private navCtrl: NavController) {
    this.api.get('appSetting').subscribe((res:any) => {
      this.importantKeys = res.data
    },()=>{})
  }

  ngOnInit() {}

  backPage() {
    this.navCtrl.back();
  }

  register() {
    this.api.startLoad();
    if(this.user.dateOfBirth){
      this.user.dateOfBirth = this.user.dateOfBirth.substring(0, 10);
    }
    this.api.post('register',this.user).subscribe((res:any) => {
      this.api.user.next(res.user)
      localStorage.setItem('userLoggedIn',res.user)
      if(res.success){
        setTimeout(() => {
         this.api.dismissLoad();          
        }, 500);
        this.navCtrl.navigateForward('phone-verification')
      }
      else{
        setTimeout(() => {
          this.api.dismissLoad();          
         }, 500);
      }
    },err => { 
      this.err = err.error.errors;
      setTimeout(() => {
        this.api.dismissLoad();          
       }, 500);
    }) 
  }
  
  signIn() {
    this.navCtrl.navigateBack('sign-in');
  }
}
