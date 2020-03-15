import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss']
})
export class FilterPage implements OnInit {
  allCategory: any = [];
  activeSerice: any;
  activeSortType: any;
  ratingValue: any = 3;
  // gender: any = 'Woman';
  distance: any = { lower: 0, upper: 10 };
  activePrice: any = 2;
  sortData: any = []
  constructor(
    private geolocation: Geolocation,
    public modalCtrl: ModalController,
    private api: RestService,
  ) {
    this.api.startLoad();
    this.api.get('allCategory').subscribe((res: any) => {
      this.allCategory = res.data;
      if (res.data.length != 0) {
        this.activeSerice = res.data[0]
      }
      this.api.dismissLoad();
    }, err => {
      this.api.dismissLoad();
    })
  }

  ngOnInit() { }

  cancel() {
    this.modalCtrl.dismiss();
  }

  reset() {
    let data: any = {};
    data.reset = true;
    this.modalCtrl.dismiss(data);
  }

  setRating(val) {
    this.ratingValue = val;
  }

  setService(service) {
    this.activeSerice = service;
  }

  setSortType(type) {
    this.activeSortType = type;
  }

  setPrice(type) {
    this.activePrice = type;
  }

  applyFilter() {
    this.sortData = [];
    this.geolocation.getCurrentPosition().then((resp) => {

      let d = new FormData()
      d.append('category', this.activeSerice.id)
      d.append('rate', this.ratingValue)
      this.api.post('searchBranch', d).subscribe((res: any) => {
        res.data.forEach(element => {
          element.distance = Number(this.getDistance(resp.coords.latitude, resp.coords.longitude, element.lat, element.lang, 'K')).toFixed(1)

          // Filter with stars
          if (this.activeSortType != 'Most Popular') {
            if (element.rate <= this.ratingValue) {
              this.sortData.push(element)
            }
          }

          // distance filter here 
          if (element.distance >= Number(this.distance.lower).toFixed(1) && element.distance <= Number(this.distance.upper).toFixed(1)) {
            this.sortData.push(element)
          }

          //  Calculate price for min service max service

          element.MinCost = 0;
          element.MaxCost = 0;
          element.services.forEach(ser => {
            if (ser.category_id == this.activeSerice.id) {
              if (element.MinCost == 0) {
                element.MinCost = ser.price;
              }
              else {
                if (element.MinCost >= ser.price) {
                  element.MinCost = ser.price;
                }
              }
              if (element.MaxCost == 0) {
                element.MaxCost = ser.price
              }
              else {
                if (element.MaxCost <= ser.price) {
                  element.MaxCost = ser.price
                }
              }
            }
          });
        })

        if (this.activeSortType == 'Cost Low to High' || this.activePrice == 1) {
          res.data.sort(function (a, b) { return a.MinCost - b.MinCost });
          this.sortData = res.data;
        } else if (this.activeSortType == 'Cost High to Low' || this.activePrice == 3) {
          res.data.sort(function (a, b) { return b.MinCost - a.MinCost });
          this.sortData = res.data;
        } else if (this.activeSortType == 'Most Popular') {
          res.data.sort(function (a, b) { return b.rate - a.rate });
          this.sortData = res.data;
        }

        if (this.activePrice == 2 && this.activeSortType == '') {
          res.data.sort(function (a, b) {
            return a < b;
          });
          let diff: any = {};
          res.data.filter(function (x) {
            diff.min = x.MinCost
            diff.max = x.MaxCost
            return x.MinCost > diff.min && x.MaxCost < diff.max;
          });
        }

      }, err => { }, () => {
        this.modalCtrl.dismiss(this.sortData)
      }); 
    })
  }

  getDistance(lat1, lon1, lat2, lon2, unit) {
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

}