import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, Events } from '@ionic/angular';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  user: any = {};
  changeImage: any;
  img: any;
  err: any = {};
  constructor(private events: Events, private actionSheetController: ActionSheetController, private camera: Camera, private api: RestService) {
    this.api.startLoad();
    this.api.getWithHeader('userProfile').subscribe((res: any) => {
      this.user = res.data
      this.api.dismissLoad();
    }, err => {
      this.api.dismissLoad();
    })
  }

  ngOnInit() {
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select an option",
      buttons: [
        {
          text: "Camera",
          role: "destructive",
          icon: "camera",
          handler: () => {
            this.getGallary();
          }
        },
        {
          text: "Gallary",
          icon: "photos",
          handler: () => {
            this.getCamera();
          }
        },
        {
          text: "Close",
          icon: "close",
          handler: () => { }
        }]
    });
    await actionSheet.present();
  }

  getGallary() {
    const cameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then(
      file_uri => {
        this.img = 'data:image/jpg;base64,' + file_uri;
        this.user.image = file_uri;
        this.changeImage = true;
      })
  }

  getCamera() {
    const cameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
    };
    this.camera.getPicture(cameraOptions).then(
      file_uri => {
        this.img = 'data:image/jpg;base64,' + file_uri;
        this.user.image = file_uri;
        this.changeImage = true;
      })
  }

  change() {
    this.api.startLoad();
    let d = new FormData();
    d.append('user_id', this.user.name)
    d.append('user_name', this.user.email)
    if (this.user.dateOfBirth.length >= 10) {
      
      d.append('dateOfBirth', this.user.dateOfBirth.substring(0, 10))
    }
    else {
      d.append('dateOfBirth', this.user.dateOfBirth)
    }

    d.append('phone', this.user.phone)
    if (this.changeImage) {
      d.append('image', this.user.image)
    }

    this.api.postWithHeader('updateProfile', d).subscribe((res: any) => {
      this.api.dismissLoad();
      if (res.success) {
        this.api.success('', 'Profile has been edited...')
        this.err = {};
        this.img = '';
        this.events.publish('user:created', res.data);
        this.changeImage = false;
        this.user = res.data;
      }
    }, err => {
      this.api.dismissLoad();
      this.err = err.error.errors;
    })
  }

}
