import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: any = 'Tab1Page';
  tab2Root:any ='Tab2Page';
  tab3Root: any = 'OrganizationPage';
  tab4Root:any ='CandidateJobList';
  tab5Root: any = 'BroadcastPage';
  myIndex: number;
  index:any = 0;
  constructor(public navParams: NavParams, public modalCtrl: ModalController) {
    this.index = navParams.get("index");
    // Set the active tab based on the passed index from menu.ts
    this.myIndex = navParams.data.tabIndex ||  this.index;
  }

   ionViewDidEnter(): void {
    console.log('ionViewDidEnter -> TabsPage');
   }

   /*playClick(): void {
      if (this.soundProvider.activeTouchSound) {
        this.soundProvider.play('tabSwitch');
      }
   }*/

  /*tabChanged($ev) {
    console.log('ev.root:--', $ev.root);

  }*/

}
