import { NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss']
})
export class SliderPage implements OnInit {
  @ViewChild('slides') slides: any;
  activeIndex: any = 0;
  slideOpts: any = {
    speed: 400
  };

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
    this.activeIndex = 1;
  }
  start() {
    this.navCtrl.navigateRoot('/tabs/nearBy');
  }
}
