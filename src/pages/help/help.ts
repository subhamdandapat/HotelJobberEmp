import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { OrganizationProvider } from "../../providers/organization/organization";
import {StorageProvider} from "../../providers/storage/storage";
import {WidgetProvider} from "../../providers/widget/widget";

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  clientList: any;
  appVer: string;
  constructor(public navCtrl: NavController,private socialSharing: SocialSharing,private iab: InAppBrowser, private storage: StorageProvider,
              public navParams: NavParams,private callNumber: CallNumber, private orgProvider: OrganizationProvider, private widget: WidgetProvider ) {
    this.geHotClient();
    this.appVersion();
  }

  ionViewWillEnter() {
    this.backButton();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

  appVersion(): void {
    this.storage.getStorage('versionCode').then( (res:any) => {
      this.appVer = res;
    });
  }

  backButton(): void {
    this.widget.appClose();
  }

  call(telephoneNumber) {
    this.callNumber.callNumber(telephoneNumber, true).then();
  }

  shareViaMail() {
    this.socialSharing.canShareViaEmail().then(() => {
    // Sharing via email is possible
    }).catch(() => {
    // Sharing via email is not possible
    });

    // Share via email
    this.socialSharing.shareViaEmail('', '', ['support@hoteljobber.com']).then(() => {
    // Success!
    }).catch(() => {
      // Error!
   });
}

  geHotClient(): void {
    this.orgProvider.getHotClient().subscribe((client: any) => {
      console.log('Client list:', client);
        this.clientList = client;
    });
  }

  openWeb(){
    const browsers = this.iab.create("https://www.hoteljobber.com", "_blank", {
      location: 'yes'
    });
  }

  back(): void {
    this.navCtrl.setRoot('TabsPage', {
      index: "0"
    }).then();
  }
}
