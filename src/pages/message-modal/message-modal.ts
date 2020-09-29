import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, ViewController } from 'ionic-angular';
import { CandidateProvider } from "../../providers/candidate/candidate";
import { WidgetProvider } from "../../providers/widget/widget";
import { StorageProvider } from "../../providers/storage/storage";
import {SelectSearchable} from "ionic-select-searchable";
import {CityProvider} from "../../providers/city/city";

@IonicPage()
@Component({
  selector: 'page-message-modal',
  templateUrl: 'message-modal.html',
})
export class MessageModalPage {

  jobInfo = {
    candidateName:String, minSalary:Number, maxSalary:Number, post:String, city:String,
    loginPersonName:String, loginPersonMobile:Number, candidateID: String, index: Number, country: String
  };
  isCustomBoxOPen: boolean;
  employerID: any;
  candidateID: any;
  loginPersonName: any;
  loginPersonMobile: any;
  loginPersonID: any;
  loginPersonCity: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
              private localStorage: StorageProvider, private navParam: NavParams, private toast: ToastController,
              private service: CandidateProvider, public platform: Platform, private widget: WidgetProvider) {}

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad');
    this.getLoginPerson();
    this.jobInfo = this.navParam.get('jobInfo');
    this.candidateID = this.jobInfo.candidateID;
    this.loginPersonMobile = this.jobInfo.loginPersonMobile;
  }

  ionViewWillEnter(): void {
    console.log('ionViewWillEnter');
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss().then();
    });
  }

  getLoginPerson(): void {
    this.localStorage.getStorage('employeer_details').then((loginPerson: any) => {
      this.loginPersonName = JSON.parse(loginPerson).Name;
      this.loginPersonMobile = JSON.parse(loginPerson).Mobile;
      this.employerID = JSON.parse(loginPerson).ID;
      this.loginPersonID = JSON.parse(loginPerson).Country_ID;
      this.localStorage.getStorage('sendMessageCity').then((msgCity: any) => {
       if (msgCity != undefined) {
         this.loginPersonCity = msgCity;
       } else {
         this.loginPersonCity = JSON.parse(loginPerson).City_Name;
       }
      })
    });
  }

  // This will close modal.
  closeMessageModal(flag?): void {
   (flag)? this.viewCtrl.dismiss({index: true}).then(): this.viewCtrl.dismiss({index: false}).then();
  }

  // This will open and close message customize option in modal page.
  changeSMSSetting(): void {
    this.isCustomBoxOPen = !this.isCustomBoxOPen;
  }

  sendMessage(): void {
   if (this.loginPersonID == 101) {
     this.widget.showLoading('').then();
     let body = new FormData();
     body.append('Option', 'SendSms');
     body.append('User_ID', this.candidateID);
     body.append('Emp_ID', this.employerID);
     body.append('Name', this.loginPersonName);
     body.append('Mobile_No', this.loginPersonMobile);
     body.append('CityName', this.loginPersonCity);

     this.service.sendSMS('common-operations.php', body).subscribe((res: any) => {
       this.widget.presentToast(res.message).then();
       this.localStorage.setStorage('sendMessageCity', this.loginPersonCity);
       this.closeMessageModal(true);
     });
     this.widget.hideLoading().then();
   }
   else {
     this.widget.presentToast('Please Send SMS manually').then();
   }
    this.closeMessageModal(true);
  }

}
