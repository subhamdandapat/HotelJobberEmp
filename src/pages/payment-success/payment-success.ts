import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { OrganizationProvider } from '../../providers/organization/organization';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import {SoundProvider} from "../../providers/sound/sound";

@IonicPage()
@Component({
  selector: 'page-payment-success',
  templateUrl: 'payment-success.html',
})
export class PaymentSuccessPage {

  EMP_ID: any;
  res : any;
  order_details = { paymentID:'' , planName: '', planPrice: '' };
  broadcast: boolean = false;
  pageTitle: string;
  pageSubTitle: string;
  constructor(public navCtrl: NavController, public org_service: OrganizationProvider, private navParams: NavParams,
              private localStorage: StorageProvider, private widget: WidgetProvider, private platform: Platform, private sound: SoundProvider) {
    if (this.navParams.get('order_details') == undefined) {
      this.broadcast = true;
      this.pageSubTitle = 'Broadcast Successful';
      this.pageTitle = 'Payment';
    } else {
      this.order_details = this.navParams.get('order_details');
      this.pageTitle = 'Payment Detail';
      this.pageSubTitle = 'Payment Successful'
    }
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad PaymentSuccessPage');
  }

  ionViewWillEnter(): void {
    this.sound.play('success');
    this.platform.registerBackButtonAction(() => {
      this.back();
    });
  }

  // Also continue..
  back(): void {
    this.navCtrl.popToRoot().then();
  }
}
