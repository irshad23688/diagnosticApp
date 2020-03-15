import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  passId:any;
  constructor(private loadingController:LoadingController) { }

  async presentLoading(state) {
    var loading = await this.loadingController.create({
      message: 'Wait...',
      duration: 2000
    });
    if(state == false){
      await loading.present();
    }
    else{
      if(loading){
        const { role, data } = await loading.onDidDismiss();
      }
    }
  }
}
