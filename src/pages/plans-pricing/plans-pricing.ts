import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlanPrizeProvider } from '../../providers/plan-prize/plan-prize';
import { Platform } from 'ionic-angular';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";

declare var RazorpayCheckout: any;
@IonicPage()
@Component({
  selector: 'page-plans-pricing',
  templateUrl: 'plans-pricing.html',
})

export class PlansPricingPage {
  temp: any;
  validity: any;
  plan_duration: any;
  Plan_ID: any;
  SpData: any;
  nav: any;
  planData: any;
  plansData: any;
  plan: any;
  planName: string = '';
  tranID: string = '';
  @ViewChild('wrapper', { read: ElementRef }) wrapper;
  @Input('expanded') expanded;
  @Input('height') height;
  items: any;
  data: Array<{ plan_name: string, plan_type: string, details: string, plan_duration: string, price: string, plan_id: number, icon: string, showDetails: boolean }> = [];
  statusArray: boolean[] = [];
  contact: number = 1600;
  planstatus: boolean;
  MyplansData: any;
  status: boolean;
  myPlan: string="none";
  no_plan_present: string="none";
  emp_details: any;
  planPrice: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,private widget: WidgetProvider,
              private planProvider: PlanPrizeProvider, public platform: Platform, private localStorage: StorageProvider) {
    this.nav = navParams.get("navigate");
    this.fetchSP();
    this.getReqOptions();
    this.getMyPlans();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    this.getPaymentGateway();
    this.platform.registerBackButtonAction(() => {
      this.back();
    });
  }

  getPaymentGateway(): void {
    this.planProvider.getPayMentGateway().subscribe((res: any) => {
      if (res.status == 'success') {

      }
    });
  }

  getMyPlansDetails(emp_id) {

    this.widget.showLoading('').then();
    let body = new FormData();
    body.append('option', 'my_active_plan');
    body.append('Token', 123 + "");
    body.append('Emp_ID', emp_id);

    this.planProvider.getPlans('plans.php', body).subscribe((data: any) => {

        if (data.status == "success") {
          //  this.planData=data;
          this.no_plan_present="yes_plan";
          this.MyplansData = data.plans;
          this.status = new Date(this.MyplansData.Expiry_Date) > new Date();
          if(this.status)
            this.myPlan = "active";
          else
            this.myPlan = "expired";
        } else {
          this.no_plan_present="no_plan";
        }
        this.widget.hideLoading().then();
      },
      err => {
        this.widget.hideLoading().then();
        console.log("ERROR!: ", err);
        // this.planProvider.dismissLoading();
      }
    );
  }


  getMyPlans() {
    let body = new FormData();
    body.append('option', 'all_plans');
    body.append('Token', 123 + "");

    this.planProvider.getPlans('plans.php', body).subscribe((data: any) => {
        this.planData = data;
        this.plansData = data.plans;

        for (let j = 0; j < this.plansData.length; j++) {

          if(j == 0)
            this.statusArray.push(true);
          else
            this.statusArray.push(false);

          this.contact = this.contact / 2;
          this.data.push({
            plan_name: this.plansData[j].plan_name,
            plan_type: this.plansData[j].plan_type,
            details: this.plansData[j].plan_description,
            plan_id: this.plansData[j].plan_id,
            plan_duration: this.plansData[j].plan_duration,
            price: this.plansData[j].plan_cost,
            icon: 'add-circle',
            showDetails: this.statusArray[j]
          });
          //   }
        }
      },
      err => {
        console.log("ERROR!: ", err);
        // this.planProvider.dismissLoading();
      }
    );
  }

  toggleDetails(data, index) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'add-circle';
    } else {
      data.showDetails = true;
      data.icon = 'remove-circle';
    }
    for (let i = 0; i < this.data.length; i++) {
      if (i != index) {
        this.data[i].showDetails = false;
        this.data[i].icon = 'add-circle';
      }
    }
  }

  getReqOptions() {
    this.planProvider.getPlan("assets/data/plan.json").subscribe((response: any) => {
      this.items = response.data;
    });
  }

  back(): void {
    this.navCtrl.pop().then();
  }

  // this will take you ccAvanue payment gtwy.
 /* purchasePlans(data): void {
      this.navCtrl.push('PaymentDetailsPage', {data: data}).then();
  }*/

  fetchSP(): void {
    this.localStorage.getStorage('employeer_details').then((val: any) => {
      if (JSON.parse(val) == null || JSON.parse(val) == undefined) {
        this.planstatus = false;
      } else {
        this.emp_details = JSON.parse(val);
        this.planstatus = true;
        this.getMyPlansDetails(JSON.parse(val).ID)
      }
    });
  }

  buyNow(plan): void {
    this.widget.showLoading('Please wait...').then();
    let body = new FormData();
    body.append('Employer', this.emp_details.ID);
    body.append('gatway', 'razorPay');
    body.append('option', 'checkout');
    body.append('Plan', plan.plan_id);
    body.append('plan_type', 'relief');
    this.planName = plan.plan_name;
    this.planPrice = plan.price;
    this.planProvider.checkOutRazorPay(body).subscribe(data => {
      if(data.transID !='' ) {
        this.tranID = data.transID;
        this.pay(data.transID);
      } else {
        this.widget.presentToast('Order ID not found, please try again').then();
      }
      this.widget.hideLoading().then();
    }, error => {
      this.widget.presentToast('Failed to generate order ID, please try again').then();
      this.widget.hideLoading().then();
    });
  }

  pay(transID) {
    var options = {
      description: 'Plan : '+ this.planName,
      currency: 'INR',
      key: "rzp_live_z3p216wTYT6CqG",
      order_id: transID,
      name: 'Hotel Jobber',
      prefill: {
        name: this.emp_details.Name,
        contact:this.emp_details.Mobile,
        email: this.emp_details.Email_ID
      },
      theme: {
        color: '#0093AD'
      },
      modal: {
        ondismiss: function() {
          alert('Payment dismissed')
        }
      }
    };

    var successCallback = (payment_id) => {
      this.updatePayStatus(payment_id);
    };

    var cancelCallback = (error) => {
      alert(error.description + ' (Status ' + error.code + ')');
    };

    this.platform.ready().then(() => {
      RazorpayCheckout.open(options, successCallback, cancelCallback).then();
    });

  }

  updatePayStatus(payment_id): void {
    let body = new FormData();
    body.append('option', 'Success');
    body.append('Trans_ID', this.tranID);
    body.append('Employer', this.emp_details.ID);
    this.planProvider.updateRzrPayStatus(body).subscribe(res => {
      let order_details = { paymentID: payment_id, planPrice: this.planPrice, planName: this.planName };
      this.navCtrl.push('PaymentSuccessPage', { order_details: order_details }).then();
    });
  }

}
