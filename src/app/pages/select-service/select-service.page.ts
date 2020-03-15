import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.page.html',
  styleUrls: ['./select-service.page.scss']
})
export class SelectServicePage implements OnInit {
  gender: any = 'Woman';
  cet: any = [];
  price: any = 0;
  selectedServices: any = [];

  constructor(private navCtrl: NavController, private api: RestService, public modalController: ModalController) {
    this.api.startLoad();
    this.api.get('category/' + this.api.dataTransfer).subscribe((res: any) => {
      this.cet = res.data;
      this.cet.forEach(element => {
        element.services = []
      });
      this.api.get('ServiceCategory/' + this.api.dataTransfer).subscribe((res: any) => {
        if (this.cet.length != 0 && res.sub.length != 0) {
          this.cet.forEach(cet => {
            cet.header = {
              header: cet.name
            }
            res.sub.forEach(subSer => {
              if (cet.id == subSer.category_id) {
                cet.services.push(subSer)
              }
            });
          });
        }
        this.api.dismissLoad();
      })
    }, err => {
      this.api.dismissLoad();
    })
  }

  changePrice() {
    this.selectedServices = [];
    this.price = 0;

    this.cet.forEach(element => {
      element.services.forEach(el => {
        if (el.id == element.selected) {
          
          this.price += el.price;
          this.selectedServices.push(el)
        }
      });
    });
  }

  ngOnInit() { }

  backPage() {
    this.navCtrl.back();
  }

  continue() {
    if(this.price != 0){
      this.api.bookingDetails.services = this.selectedServices;
      this.api.bookingDetails.payment = this.price;
      this.api.services = this.selectedServices
      this.navCtrl.navigateForward('book-appointment')
    }
    else{
      this.api.error('','There is no service to continue ;(')
    }
  }

}
