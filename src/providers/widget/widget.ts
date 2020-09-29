import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  Modal,
  ModalController,
  ModalOptions,
  Platform,
  ToastController
} from "ionic-angular";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
/*
This service for all kind of widget in entire application like loading, alert, toast etc.
*/
@Injectable()
export class WidgetProvider {
  loader: any;
  appCloseOpen: boolean = false;
  whatsAppUrl: string;
  constructor(public toast: ToastController, public alert: AlertController, public platform: Platform,private sanitizer: DomSanitizer,
              public loading: LoadingController, public modalCtrl: ModalController ) {
    console.log('Hello WidgetProvider Provider');
    this.whatsAppUrl = 'whatsapp://send?text=Hello are you looking for job? &phone=+91';
  }

  // Displaying Toast
  async presentToast(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present().then();
  }

  // Loading present
  async showLoading(message) {
    this.loader = this.loading.create({
      content: message,
      duration: 3000
    });
    this.loader.present().then();
  }

  // Loading dismissed
  async hideLoading() {
    if(this.loading) {
      this.loader.dismiss();
    }
  }

  // Display Alert this is simple Okay alert
  async presentAlert(title: string, message: string) {
    const alert = await this.alert.create({
      title: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present().then();
  }

  appClose(): void {

    this.platform.registerBackButtonAction(() => {
      const alert = this.alert.create({
        cssClass: 'titleAlert',
        title: 'Want to close?',
        buttons: [{
          text: 'Cancel',
          cssClass: 'myAppCloseCancel',
          role: 'cancel',
          handler: () => {
            this.appCloseOpen = false;
            console.log('Application exit prevented!');
          }
        }, {
          text: 'Close',
          cssClass: 'myAppClose',
          handler: () => {
            this.platform.exitApp(); // Close this application
          }
        }]
      });

      if (!this.appCloseOpen) {
        alert.present().then();
        this.appCloseOpen = true;
      }
    });
  }

  openNotification(): void {
    const modalOptions: ModalOptions = { enableBackdropDismiss: false, leaveAnimation: 'modal-translate-up-leave', enterAnimation: 'modal-translate-up-enter' };
    let candDetail: Modal = this.modalCtrl.create('NotificationPage', {}, modalOptions);
    candDetail.onDidDismiss((data) => {
      // Do something here if  required.
      this.appClose();
    });
    candDetail.present().then(res => {});
  }

  whatsAppOpen(mobile): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.whatsAppUrl+mobile);
  }

}
