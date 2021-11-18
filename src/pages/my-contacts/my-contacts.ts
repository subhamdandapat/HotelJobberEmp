import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App, Platform } from 'ionic-angular';
import { PlanPrizeProvider } from '../../providers/plan-prize/plan-prize';
import { OrganizationProvider } from '../../providers/organization/organization';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";

@IonicPage()
@Component({
  selector: 'page-my-contacts',
  templateUrl: 'my-contacts.html',
})
export class MyContactsPage {
  nav: any;
  SpData: any;
  countsData: any;
  data: any;
  plan_id: any = 0;
  plans: any[] = [];
  index: any;
  flag: boolean;
  items: any;
  Total_Contact: any;
  View_Contact: any;
  balance_contact: number;
  newDate: number;
  plan_Id: any;
  planstatus: any;
  constructor(private app: App, public navCtrl: NavController, private localStorage: StorageProvider,
              public org_service: OrganizationProvider, public platform: Platform, public navParams: NavParams,
              private service: PlanPrizeProvider, private widget: WidgetProvider) {

    this.nav = navParams.get("navigate");
    this.fetchSData();
    platform.registerBackButtonAction(() => {
     this.back();
    });
  }

  ionViewDidLoad() {
    this.getMyPlans();
    console.log('ionViewDidLoad MyContactsPage');
  }

  fetchSData() {
    this.localStorage.getStorage('employeer_details').then((val: any) => {
      this.SpData = JSON.parse(val);
      this.getDashboardCount(this.SpData.ID);
    });
  }

  getDashboardCount(ID) {
    let body = new FormData();

    body.append('option', 'DashboardCounts');
    body.append('Employer_ID', ID);

    this.org_service.createOrganizationforplans('common-operations.php', body).subscribe((data: any) => {
      console.log(data)
        this.countsData = data;
        this.balance_contact = data.balance_contact;
        this.View_Contact = data.View_Contact;
        this.Total_Contact = data.Total_Contact;

        var date = new Date(this.countsData.order_date);
        this.newDate = date.setMonth(parseInt(this.countsData.plan_duration) + 1);
        if(data.plan_id){
          this.plan_Id = data.plan_id
        }
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  setStatusColor(flag, index, plan_data) {
    this.flag = flag;
    this.index = index;
    this.data = plan_data;
    console.log('Plan--', plan_data);
    this.plan_id = plan_data.plan_id;
  }
  getStatusColor(status) {
    if (status) {
      return '#FFFFDD';
    }
    else {
      return '#ffffff';
    }
  }

  getMyPlans() {
    this.widget.showLoading('').then();
    let body = new FormData();
    body.append('option', 'addon_plans');
    body.append('Token', 123 + "");

    this.service.getPlans('plans.php', body).subscribe((data: any) => {
      console.log('get my Plans--', data);
        this.plans = data.plans;
        this.planstatus = data.status
        this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
      }
    );
  }

  PaymentDetails():void {
    this.navCtrl.push('PaymentDetailsPage', {
      data: this.data
    }).then();
  }

  back(): void {
    this.navCtrl.pop().then();
  }
  gotoPlans(){
      this.navCtrl.push("PlansPricingPage",{navigate:this.nav}).then();
  }
}
