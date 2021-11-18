import { Component } from '@angular/core';
//import { Facebook } from '@ionic-native/facebook';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from "ionic-angular";
import { Platform } from 'ionic-angular';
import { StorageProvider } from "../../providers/storage/storage";
import {WidgetProvider} from "../../providers/widget/widget";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  guestEmpDetails = {City_ID: "",City_Name:"",Country_ID: "",Country_Name: "",Email_ID: "",ID: "",Mobile: "",Name: "",Password: "",Plan: "0",Rem_Job_Post: "",State_ID: "",State_Name: "",plan_duration: "",plan_name: "",plan_purchase_date: ""}
  isLoggedIn= false;
  constructor(public navCtrl: NavController,public platform: Platform, public toastCtrl: ToastController, private widget: WidgetProvider,
              private localStorage: StorageProvider, public navParams: NavParams, public alertCtrl: AlertController,
             // private fb: Facebook
              ) {
    this.localStorage.storage.remove("HJ_login_status").then( data => {console.log('Removed HJ_login_status');});
  }

  ionViewWillEnter() {
   this.widget.appClose();
  }

  doLogin(): void {
   // this.navCtrl.push(PaymentSuccessPage);
   this.navCtrl.push('EmployeeloginPage').then();
  }

  getRegister(): void {
    this.widget.showLoading('').then();
    this.navCtrl.push('EmployeeregistrationPage').then(res => this.widget.hideLoading());
  }

 /* skipLogin(): void {
    this.widget.showLoading('Please wait...').then();
    this.localStorage.setStorage('employeer_details', JSON.stringify(this.guestEmpDetails));
    this.localStorage.setStorage('HJ_login_status', JSON.stringify(false));
    this.navCtrl.setRoot('MenuPage').then();
    this.widget.hideLoading().then();
  }*/

  playStore(): void {
    window.open("https://play.google.com/store/apps/details?id=com.hoteljobber.candidate", '_system', 'location=yes');
  }

  // fbLogin() {
  //   this.fb.login(['public_profile', 'email'])
  //     .then(res => {

  //       if (res.status === 'connected') {
  //         this.isLoggedIn = true;
  //         this.getUserDetail(res.authResponse.userID);
  //       } else {
  //         this.isLoggedIn = false;
  //       }
  //     })
  //     .catch(e => console.log('Error logging into Facebook', e));
  // }

  

  //  getUserDetail(userid) {

  //    this.fb.api("/" + userid + "/?fields=id,email,name,picture.type(normal),gender", ["public_profile"])
  //     .then(res => {
  //       console.log(res);

  //      this.localStorage.setStorage('fb_data', JSON.stringify(res));

  //      this.navCtrl.setRoot('MenuPage');
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

}
