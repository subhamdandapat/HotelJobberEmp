import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';


@IonicPage()
@Component({
  selector: 'page-dialog-modal',
  templateUrl: 'dialog-modal.html',
})
export class DialogModalPage {
  bal_contact: any;
  nav: any;
//avi_quantity: any;
  item: any;
  currentNumber: any = 1;
  commingFrom: string;
constructor(public navCtrl: NavController,public service: ServiceProvider,
   public navParams: NavParams,public viewCtrl: ViewController) {

 this.nav = this.navParams.get("nav");
 this.commingFrom = this.navParams.get("modal");
 this.bal_contact = this.navParams.get("bal");
}

ionViewDidLoad() {}

dismiss(): void {
  this.viewCtrl.dismiss().then();
}

gotoPlans(){
  this.viewCtrl.dismiss().then();
    this.navCtrl.push("PlansPricingPage",{navigate:this.nav}).then();
}

}
