import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-appoinments-list',
  templateUrl: './appoinments-list.page.html',
  styleUrls: ['./appoinments-list.page.scss']
})
export class AppoinmentsListPage implements OnInit {
  activeTab: any = 'Upcomming';
  appointments: any = {}
  constructor(private navCtrl: NavController, private api: RestService) {
    this.api.startLoad();
    this.api.getWithHeader('userAppointment').subscribe((res: any) => {
      this.appointments = res.data;
      this.api.dismissLoad();
    }, err => {
      this.api.dismissLoad();
    })
  }

  doRefresh(event) {
    this.api.getWithHeader('userAppointment').subscribe((res: any) => {
      this.appointments = res.data;
      event.target.complete();
    }, err => {
      event.target.complete();
    })
  }

  ngOnInit() { }

  chageViewAppoinment(event) {
    this.activeTab = event.detail.value;
  }

  rateNow(salon) {
    salon.rateStatus = true;
    salon.state = 'Review'
    this.api.dataTransfer = salon.location_id
    this.api.rate.next(salon);
    this.navCtrl.navigateForward('salon-detail')
  }
}
