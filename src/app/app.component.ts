import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, ModalOptions, Modal, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ToastController } from 'ionic-angular';
import { StorageProvider } from "../providers/storage/storage";
import { FCM } from "@ionic-native/fcm";
import { AppUpdate } from "@ionic-native/app-update";
import { WidgetProvider } from "../providers/widget/widget";
import { CheckupdateProvider } from "../providers/checkupdate/checkupdate";
import { Network } from "@ionic-native/network";
import { NetworkProvider } from "../providers/network/network";

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  notificationMsg: { "title": string; "message": string; "ID": string; "redirection": string; "status": string, "date": number, "type": string };
  notification_data: string;
  response: any;
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any;
  constructor(public platform: Platform, statusBar: StatusBar, public toastCtrl: ToastController,private widget: WidgetProvider, public events: Events,
              public modalCtrl: ModalController, splashScreen: SplashScreen, private fcm: FCM, private appUpdate: AppUpdate, private network: Network,
              private localStorage: StorageProvider, private update: CheckupdateProvider, private alertCntrl: AlertController, private networkProvider: NetworkProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.fetchSP();
      /*Set app current version*/
      this.localStorage.setStorage('versionCode','10132');

      if (this.platform.is('cordova')) {
        const updateUrl = 'https://www.hoteljobber.com/api/apk/update.xml';
        this.appUpdate.checkAppUpdate(updateUrl).then(() => {
          console.log('Update Available');
        });
      }

      if (this.platform.is('cordova')) {
        this.fcm.subscribeToTopic('all').then();
        this.fcm.getToken().then(token => {
          this.localStorage.setStorage('device_token_HJ', JSON.stringify(token));
        });

        fcm.onNotification().subscribe((data: any) => {
          let today: number = Date.now();
          this.notificationMsg =
            {
              "title": data.title,
              "message": data.message,
              "ID": data.nav_id,
              "redirection": data.redirection,
              "status": "unread",
              "date": today,
              "type": data.type,
            };

          if (data.wasTapped) {
            // App is open in background or close.
              this.localStorage.getStorage('HJ_login_status').then((val: any) => {
                if (JSON.parse(val) == true) {
                  //Navigate User Profile
                  /*if (data.type == "applied-job") {
                    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
                    this.widget.presentAlert('ID = '+data.nav_id, ''+data.type).then();
                    let openAppliedJob: Modal = this.modalCtrl.create('AppliedCandidatePage',{info:data.nav_id}, modalOptions);
                    openAppliedJob.onDidDismiss((data) => {
                      // Do something here if require.
                      this.setRootPage();
                    });
                    openAppliedJob.present().then(res => {});

                  }*/
                  if (data.redirection == "user-profille") {
                    let info = {showMobile: false, smsSend: false, ID: this.notificationMsg.ID};
                    const modalOptions: ModalOptions = {enableBackdropDismiss: false};
                    let candDetail: Modal = this.modalCtrl.create('CandidateDetailsPage', {info: info}, modalOptions);
                    candDetail.onDidDismiss((data) => {
                      //this.setRootPage();
                      this.rootPage = 'MenuPage';
                      this.widget.appClose();
                    });
                    candDetail.present().then(res => {});
                  }

                } else {
                  this.rootPage = 'LoginPage';
                }
              });
           }
        });
      }
    });
    this.checkConnection();
  }

  setRootPage(): void {
    this.navCtrl.setRoot('MenuPage').then();
  }

  checkConnection(): void {
    this.networkProvider.initializeNetworkEvents();

    // Offline event
    this.events.subscribe('network:offline', () => {
      alert('Please check internet connection');
    });

    // Online event
    this.events.subscribe('network:online', () => {
     this.widget.presentToast('Back to online').then();
    });

  }

  fetchSP(): void {
    this.localStorage.getStorage('HJ_login_status').then((val: any) => {
      //Here we will get login status if terms of true and undefined/false.
      (JSON.parse(val))?  this.rootPage = 'MenuPage': this.rootPage = 'LoginPage';
    });
  }
}
