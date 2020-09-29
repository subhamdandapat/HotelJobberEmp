import { Component } from '@angular/core';
import { IonicPage, Modal, ModalController, ModalOptions, NavController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import { EmployeerProvider } from "../../providers/employeer/employeer";
import {SoundProvider} from "../../providers/sound/sound";

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})

export class NotificationPage {

  list: any[] = [];
  nav: any;
  EMP_ID: any;
  page: any = 0;
  totalNotification: number = 0;
  constructor(public alertCtrl: AlertController,public navCtrl: NavController, private localStorage: StorageProvider,
              public viewCtrl: ViewController, private empProvider: EmployeerProvider,private soundProvider: SoundProvider,
              public platform: Platform, private widget: WidgetProvider, private modalCtrl: ModalController) {
    this.localStorage.getStorage('employeer_details').then((val: any) => {
      this.EMP_ID = JSON.parse(val).ID;
      this.widget.showLoading(' ').then();
      this.getNotifications();
    });
  }

  ionViewWillEnter() {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss().then();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    this.widget.hideLoading().then();
  }

  getNotifications(): void {
    this.empProvider.getEmpNotifications(this.EMP_ID, this.page).subscribe((data: any) => {
      if (data.status == 'success') {
        console.log('First:->', data);
        this.totalNotification = data.total;
        if (data.items.length) {
          this.empProvider.getNotificationRead(data.items[data.items.length-1].id,data.items[0].id, this.EMP_ID).subscribe((read: any) => {
            console.log('After:->', read);
            if (read.length) {
              for (let i = 0; i < read.length; i++) {
                data.items.filter(noty => noty.id == read[i].EmpNot_ID).map((res: any) => {
                  res.read_status = 'read';
                });
              }
            }
            if (this.list) {
              for (let i = 0; i < data.items.length; i++) {
                this.list.push(data.items[i]);
              }
            } else {
              this.list = data.items;
            }
          });
        }
      }
    }, error => {this.widget.presentToast(''+error).then()});
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.getNotifications();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 2000);
  }


  navigate(item, index) {
    this.widget.showLoading('').then();
    if (item.read_status == 'unread') {
      this.empProvider.totalNotification--;
      this.list[index].read_status ='read';
    }
    let info = { showMobile: false, smsSend: false, ID: item.navigate_page_id };
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    this.widget.hideLoading().then();
    let candDetail: Modal = this.modalCtrl.create('CandidateDetailsPage',{info:info}, modalOptions);
    candDetail.onDidDismiss((data) => {});
    candDetail.present().then(res => {});
  }

  back(): void {
    this.viewCtrl.dismiss().then();
  }

  clearNotification(): void {
    let alert = this.alertCtrl.create({
      cssClass: 'noty_alert',
      title: 'Are you sure, you want to clear notifications?',
      buttons: [
        {
          text: 'Clear All',
          cssClass: 'noty-btn',
          handler: () => {
            this.clearNotificationUpdate();
          }
        }
      ],
      //  enableBackdropDismiss: false
    });
    alert.present().then();
  }

  play(): void {
    this.soundProvider.play('clear')
  }

  clearNotificationUpdate(): void {
    this.widget.showLoading('Deleting...').then();
    let body = new FormData();
    body.append('Option','clear');
    body.append('EmpId', this.EMP_ID);
    this.empProvider.clearNotification(body).subscribe((res: any) => {
      if (res.statusText == 'OK') {
        this.play();
        this.list = [];
        this.empProvider.totalNotification = 0;
      }
      this.widget.hideLoading().then();
    }, error => {
      this.widget.hideLoading().then();
      console.log(error);
    });
  }
}
