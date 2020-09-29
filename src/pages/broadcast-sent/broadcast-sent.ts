import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {BroadcastProvider} from "../../providers/broadcast/broadcast";

@IonicPage()
@Component({
  selector: 'page-broadcast-sent',
  templateUrl: 'broadcast-sent.html',
})
export class BroadcastSentPage {

  page: number = 0;
  broadcastList: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private broadcastProvider: BroadcastProvider, private platform: Platform) {
    this.getSentList();
    this.backButton();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BroadcastSentPage');

  }

  getSentList(): void {
    this.broadcastProvider.getBroadcastSentList('broadcast.php?Option=sendList&ItemPerPage=50&Emp_ID='+this.navParams.get('emp_ID')+'&PageNo='+this.page)
      .subscribe((res: any) => {
        if (res.status == 'success') {
          if ( this.broadcastList.length > 0 ) {
            for (let i = 0; i < res.broadcast_list.length; i++) {
              this.broadcastList.push(res.broadcast_list[i]);
            }
          } else {
            this.broadcastList = res.broadcast_list;
          }
        }
      })
  }

  //Scroll for broadcast message to be send
  doInfinite(infiniteScroll) {
    this.page++;
    this.getSentList();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 3000);
  }

  backButton(): void {
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop().then();
    });
  }

  //Post job
  createOrganizationPage() {
    this.navCtrl.parent.select(2);
    this.navCtrl.pop().then();
  }
}
