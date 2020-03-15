import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {
  data:any;
  constructor(public api:RestService,private socialSharing: SocialSharing,private navParams:NavParams) { 
    this.data = this.navParams.get('data');
  }

  ngOnInit() {}  

  viaFacebook(){
    this.socialSharing.shareViaFacebook('Address:'+this.data.address+' '+'name:'+this.data.name, this.data.imagePath+this.data.image, this.data.website).then((res) => {
      
    }).catch((err) => {
      
    });
  }

  viaWhatsapp(){
    this.socialSharing.shareViaWhatsApp('Address:'+this.data.address+' '+'name:'+this.data.name, this.data.imagePath+this.data.image, this.data.website).then((res) => {
      
    }).catch((err) => {
      
    });
  }

  viaInstagram(){
    this.socialSharing.shareViaInstagram('Address:'+this.data.address+' '+'name:'+this.data.name, this.data.imagePath+this.data.image).then((res) => {
      
    }).catch((err) => {
      
    });
  }

  viaTwitter(){
    this.socialSharing.shareViaTwitter('Address:'+this.data.address+' '+'name:'+this.data.name, this.data.imagePath+this.data.image).then((res) => {
      
    }).catch((err) => {
      
    });
  }

  viaSms(){
    this.socialSharing.shareViaSMS('Address:'+this.data.address+' '+'name:'+this.data.name, this.data.imagePath+this.data.image).then((res) => {
      
    }).catch((err) => {
      
    });
  }

  viaEmail(){
    this.api.user.subscribe((res:any) => {
      this.socialSharing.shareViaEmail('Address:'+this.data.address+' '+'name:'+this.data.name, 'My custom subject', [res.email], null, null).then(() => {
      }).catch((e) => {
      });
    })
  
    // this.socialSharing.shareViaEmail('','',[],[]).then((res) => {
    //   
    // }).catch((err) => {
    //   
    // });
  }

}
