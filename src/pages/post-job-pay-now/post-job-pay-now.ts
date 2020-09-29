import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { PlanPrizeProvider } from '../../providers/plan-prize/plan-prize';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import {SoundProvider} from "../../providers/sound/sound";

@IonicPage()
@Component({
  selector: 'page-post-job-pay-now',
  templateUrl: 'post-job-pay-now.html',
})
export class PostJobPayNowPage {

  flag: boolean;
  SPData: any;
  Rem_Job_Post: any;
  Plan: any;
  ID: any;
  plan_cost: any;
  plans: any;
  totalPost: number;

  constructor(public navCtrl: NavController, private localStorage: StorageProvider, public platform: Platform,private soundProvider: SoundProvider,
              private service: PlanPrizeProvider, public navParams: NavParams, private widget: WidgetProvider) {

    this.fetchSP();
    this.getMyPlans();
    this.play();
    platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot('SpecialPage').then();
    });
  }

  ionViewDidLoad(): void {
    //this.navParams.get('totalPost')
    this.totalPost = parseInt('5');
    console.log('TotalJob Posted yet', this.totalPost);
  }

  fetchSP(): void {
    this.localStorage.getStorage('employeer_details').then((val: any) => {
      this.SPData = JSON.parse(val);
      this.Plan = this.SPData.Plan;
      this.Rem_Job_Post = this.SPData.Rem_Job_Post;
      this.ID = this.SPData.ID;
      (this.Plan > 0 && this.Rem_Job_Post > 0)? this.flag = true: this.flag = false;
    });
  }

  play(): void {
    this.soundProvider.play('success')
  }

  getMyPlans() {
    this.widget.showLoading('').then();
    let body = new FormData();
    body.append('option', 'job_plans');
    body.append('Token', 123 + "");

    this.service.getPlans('plans.php', body).subscribe((data: any) => {
        this.plans = data.plans;
        if(this.plans!=undefined){
          this.plan_cost = this.plans[0].plan_cost;
        }
        this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
        // this.service.dismissLoading();
      }
    );
  }

 /* paymentPage(): void {
    this.navCtrl.push('PaymentDetailsPage', {
      data: this.plans[0]
    }).then();
  }*/


 /* converttoHot() {

    this.widget.showLoading('').then();
    let body = new FormData();
    body.append('option', 'ConvertFreeToHot');
    body.append('Job_id', this.job_id);
    body.append('Emp_ID', this.ID);

    this.service.getPlans('job.php', body).subscribe(data => {
        if (data.status == "success") {
          this.widget.presentToast(data.message).then();
          this.navCtrl.parent.select(3);
        } else {
          this.widget.presentToast(data.message).then();
        }
        this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);
        // this.service.dismissLoading();
      }
    );
  }*/

  goToJobList() {
    this.navCtrl.parent.select(3);
    this.back();
  }

  back(): void {
    this.navCtrl.setRoot('OrganizationPage').then();
  }
}
