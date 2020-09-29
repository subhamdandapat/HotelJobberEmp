import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {
  step: string;
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public splashScreen: SplashScreen) {

  }

  ionViewDidEnter(): void {
    this.splashScreen.hide();
    setTimeout(() => {
      this.viewCtrl.dismiss().then();
    }, 3000);
  }

}
