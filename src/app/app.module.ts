import { BookingSuccessfullyPage } from './pages/booking-successfully/booking-successfully.page';
import { CodeSendModalPage } from './pages/code-send-modal/code-send-modal.page';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NearSalonListPage } from './pages/near-salon-list/near-salon-list.page';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ImageModalPageModule } from './image-modal/image-modal.module';
import { PayPal } from '@ionic-native/paypal/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { EnableLocationPage } from './pages/enable-location/enable-location/enable-location.page';
import { FilterPage } from './pages/filter/filter.page';
import { FormsModule } from '@angular/forms';
import { SharePage } from './pages/share/share.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@NgModule({
  declarations: [
    AppComponent,
    CodeSendModalPage,
    BookingSuccessfullyPage,
    NearSalonListPage,
    EnableLocationPage,
    FilterPage,
    SharePage
  ],
  entryComponents: [
    CodeSendModalPage,
    BookingSuccessfullyPage,
    NearSalonListPage,
    EnableLocationPage,
    FilterPage,
    SharePage
  ],
  imports: [ToastrModule.forRoot(),BrowserAnimationsModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,ImageModalPageModule,FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    PayPal,
    Facebook,
    LaunchNavigator,
    GooglePlus,
    OneSignal,
    Camera,
    Diagnostic,
    LocationAccuracy
    ], 
    bootstrap: [AppComponent]
})
export class AppModule {}
