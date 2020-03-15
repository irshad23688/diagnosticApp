import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
var base_url = 'Your API BASE URL goes here';
@Injectable({
  providedIn: 'root'
})
export class RestService {
  public user = new BehaviorSubject({});
  public verify = new BehaviorSubject({});
  public rate = new BehaviorSubject({ rateStatus: false });
  public dataTransfer: any = {}
  public bookingDetails: any = {}
  public services: any = []
  load: any;
  key:any = '';
  constructor(public http: HttpClient, public loadingController: LoadingController, private toastr: ToastrService) {
    this.get('appSetting').subscribe((res: any) => {
      this.key = res.mapApiKey
    })
  }

  get(url) { 
    return this.http.get(base_url + url);
  }

  getWithHeader(url) {
    let tok = 'Bearer ' + localStorage.getItem('userKey');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', tok);
    return this.http.get(base_url + url, { headers: headers });
  }

  fbUser(token) {
    return this.http.get("https://graph.facebook.com/v2.5/me?fields=email,name,picture&access_token=" + token);
  }

  google(lat, lng) {  
    return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=" + 'AIzaSyCb9lhLYxUnRjSp1oIGl6aAsXLODc3o-f4' + "");
  }

  postWithHeader(url, data) {
    let tok = 'Bearer ' + localStorage.getItem('userKey');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', tok);
    headers = headers.set('Accept', 'application/json');
    return this.http.post(base_url + url, data, { headers: headers });
  }

  post(url, data) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    return this.http.post(base_url + url, data, { headers: headers });
  }

  register(url, data) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    return this.http.post(base_url + url, data, { headers: headers });
  }

  async startLoad() {
    this.load = await this.loadingController.create({
      spinner: 'bubbles',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      animated: true
    });
    return await this.load.present();
  }

  async dismissLoad() {
    return await this.load.dismiss();
  }

  success(msg, desc) {
    this.toastr.success(msg, desc, {
      progressAnimation: 'decreasing',
      progressBar: true,
      positionClass: "toast-bottom-center",
    });
  }

  error(msg, desc) {
    this.toastr.error(msg, desc, {
      progressAnimation: 'decreasing',
      progressBar: true,
      positionClass: "toast-bottom-center"
    });
  }

}
