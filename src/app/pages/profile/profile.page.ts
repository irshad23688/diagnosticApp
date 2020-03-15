import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { RestService } from 'src/app/rest.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  user: any = {};
  appointments: any = {};
  activeTab: any = 'Upcomming';
  main: any = 'My_Bookings';
  myFeb: any = [];
  constructor(private googleplus: GooglePlus, private events: Events, private navCtrl: NavController, private api: RestService) { }

  ngOnInit() {
    this.api.getWithHeader('userAppointment').subscribe((res: any) => {
      this.appointments = res.data
    }, err => {
      if (err.error.message == "Unauthenticated.") {
        localStorage.clear()
        this.navCtrl.navigateRoot('starter')
      }
    })

    this.api.getWithHeader('userFavourite').subscribe((res: any) => {
      this.myFeb = res.data
    }, err => {
    })

    this.events.subscribe('user:created', (user) => {
      this.user = user;
    });
  }

  ionViewWillEnter() {
    this.api.startLoad();
    this.api.getWithHeader('userProfile').subscribe((res: any) => {
      this.user = res.data
      this.api.dismissLoad();
    }, err => {
      this.api.dismissLoad();
    })
  }

  changeProfile() {
    this.navCtrl.navigateForward('editprofile')
  }

  doRefresh(event) {
    this.api.getWithHeader('userAppointment').subscribe((res: any) => {
      this.appointments = res.data;
      event.target.complete();
    }, err => {
      event.target.complete();
    })
    this.api.getWithHeader('userFavourite').subscribe((res: any) => {
      this.myFeb = res.data
    }, err => {
    })
  }

  signOut() {
    console.log(this.user)
    this.googleplus.logout();
    localStorage.clear();
    this.navCtrl.navigateRoot('starter');
  }

  remove(salon) {
    this.api.startLoad();
    let d = new FormData()
    d.append('location_id', salon.id)
    this.api.postWithHeader('addFavourite', d).subscribe((res: any) => {
      if (res.msg == "Remove from Bookmark!") {
        this.api.error('', res.msg)
        setTimeout(() => {
          this.api.getWithHeader('userFavourite').subscribe((res: any) => {
            this.myFeb = res.data
            this.api.dismissLoad();
          }, err => {
            this.api.dismissLoad();
          })
        }, 500);
      }
      else {
        setTimeout(() => {
          this.api.dismissLoad();
          this.api.getWithHeader('userFavourite').subscribe((res: any) => {
            this.myFeb = res.data
            this.api.dismissLoad();
          }, err => {
            this.api.dismissLoad();
          })
        }, 500);
        this.api.success('', res.msg)
      }
    }, err => {
      setTimeout(() => {
        this.api.dismissLoad();
      }, 500);
    })

  }

  rateNow(salon) {
    salon.rateStatus = true;
    salon.state = 'Review'
    this.api.dataTransfer = salon.location_id
    this.api.rate.next(salon);
    this.navCtrl.navigateForward('salon-detail')
  }

  back() {
    this.navCtrl.navigateRoot('/tabs/nearBy')
  }
}
