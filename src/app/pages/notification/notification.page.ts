import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import * as moment from "moment";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  userId: any = localStorage.getItem('userLoggedIn');
  notiData: any = [];
  constructor(private api: RestService) {
    this.api.startLoad();
    this.api.getWithHeader('viewNotification/' + this.userId).subscribe((res: any) => {
      this.notiData = res.data;
      this.notiData.forEach(element => {
        let dt = new Date(element.created_at)
        element.ago = moment(dt.getTime()).fromNow();
      });
      this.api.dismissLoad();
    }, () => this.api.dismissLoad())
  }

  ngOnInit() {
  }

  doRefresh(event) {
    this.api.getWithHeader('viewNotification/' + this.userId).subscribe((res: any) => {
      this.notiData = res.data;
      event.target.complete();
      this.notiData.forEach(element => {
        let dt = new Date(element.created_at)
        element.ago = moment([dt.getFullYear(), dt.getMonth(), dt.getDate()]).fromNow();
      });
    }, () => event.target.complete())
  }

}
