import { Component } from '@angular/core';
import { IonicPage, ModalController, ModalOptions, NavController, NavParams, Platform } from 'ionic-angular';
import { WidgetProvider } from "../../providers/widget/widget";
import { PlanPrizeProvider } from "../../providers/plan-prize/plan-prize";
import { BroadcastProvider } from "../../providers/broadcast/broadcast";
import {StorageProvider} from "../../providers/storage/storage";
import { checkAndUpdateTextDynamic } from '@angular/core/src/view/text';

@IonicPage()
@Component({
  selector: 'page-broadcast-payment',
  templateUrl: 'broadcast-payment.html',
})
export class BroadcastPaymentPage {
  broadMessage: any;
  transID: any;
  planList: any;
  isPaymentCompleted: boolean = false;
  plan_name: string = 'Pay Now';
  plan_id: any;
  plan_cost: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private platform: Platform,
              private widget:WidgetProvider, private planProvider: PlanPrizeProvider, private broadPlanProvider: BroadcastProvider, private storage: StorageProvider) {
    this.broadMessage = this.navParams.get('message');
    console.log('---------', this.broadMessage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BroadcastPaymentPage',  this.broadMessage);
    this.chec()
  }
  chec() {
    this.storage.getStorage('temp').then((res:any) => {
      console.log("temp--------->",res)
      let body = new FormData();
      // this will calling for check either plan purchased or not
      body.append('Option', 'broadcastJobs');
      body.append('Emp_ID', res.Emp_ID);
      body.append('City', res.City);
      body.append('CityID', res.CityID);
      body.append('Job_ID',res.Job_ID);
      body.append('Location', res.Location);
      body.append('MaxSalary', res.MaxSalary);
      body.append('MinSalary', res.MinSalary);
      body.append('Mobile_No', res.Mobile_No);
      body.append('Name', res.Name);
      body.append('PlanBroadcast', res.PlanBroadcast);
      body.append('Roll', res.Roll);
      body.append('RollID', res.RollID);
      this.broadPlanProvider.fireBroadcast('broadcast.php', body).subscribe((res:any) => {
        console.log("broadcast.php--------->",res)
        this.widget.hideLoading().then();
        if (res.status == 'success') {
          this.widget.presentToast(res.message).then();
          this.navCtrl.push('PaymentSuccessPage').then();
        }
      }, error => {
        this.widget.hideLoading().then();
        console.log("broadcast.php err--------->",error)
        alert(error);
      });
    });
  }

  ionViewWillEnter() {
    this.getBroadcastPlan();
    this.getPlanList();
    this.backButton();
  }

  backButton(): void {
    this.platform.registerBackButtonAction(() => {
      this.backPop();
    });
  }

  //Open edit modal in report modal
  openEditModal(): void {
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let modal = this.modalCtrl.create('ReportDialogPage',{ broadcast:'broadcast', jobInfo: this.broadMessage }, modalOptions);
    modal.onDidDismiss((data: any) => {
      if (data.updatedInfo) {
        this.backButton();
        this.broadMessage.City = data.updatedInfo.city;
        this.broadMessage.MinSalary = data.updatedInfo.minSal;
        this.broadMessage.MaxSalary = data.updatedInfo.maxSal;
        this.broadMessage.ContactNo = data.updatedInfo.contact;
      }
    });
    modal.present().then();
  }

  //Back button
  backPop(): void {
    this.navCtrl.pop().then();
  }

  // 1st Pay now
  payNow(): void {
    this.widget.showLoading('Please wait...').then();
    let body = new FormData();
    body.append('Employer', this.broadMessage.emp_ID);
    body.append('gatway', 'razorPay');
    body.append('option', 'checkout');
    body.append('Plan', this.plan_id);
    body.append('plan_type', 'broadcast');
    this.planProvider.checkOutRazorPay(body).subscribe(data => {
      if(data.transID !='' ) {
        this.transID = data.transID;
        this.pay(data.transID, 'Broadcast Now');
      } else {
        this.widget.presentToast('Order ID not found, please try again').then();
      }
      this.widget.hideLoading().then();
    }, error => {
      this.widget.presentToast('Failed to generate order ID, please try again').then();
      this.widget.hideLoading().then();
    });
  }

  pay(transID, planName) {
    var options = {
      description: 'Plan : '+ planName,
      currency: 'INR',
      key: "rzp_live_z3p216wTYT6CqG",
      order_id: transID,
      name: 'Hotel Jobber',
      prefill: {
        name: this.broadMessage.emp_ID,
        contact:this.broadMessage.emp_mobile,
        email: this.broadMessage.emp_email
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
      this.updatePaymentStatus();
    };

    var cancelCallback = (error) => {
      alert(error.description + ' (Status ' + error.code + ')');
    };

    this.platform.ready().then(() => {
      RazorpayCheckout.open(options, successCallback, cancelCallback).then();
    });
  }

  updatePaymentStatus(): void {
    let body = new FormData();
    body.append('Employer', this.broadMessage.emp_ID);
    body.append('gatway', 'razorPay');
    body.append('option', 'Success');
    body.append('Trans_ID', this.transID);
    this.broadPlanProvider.broadcastPaymentUpdate('payment-complete-razorpay.php', body).subscribe( (res:any) => {
      if (res.status == 'success') {
         this.fireBroadcast();
      }
    }, error => {
      alert('Problem in updating payment status:');
    });
  }

  //Fired broadcast
  fireBroadcast(): void {
    this.widget.showLoading('Please wait...').then();
    this.storage.getStorage('temp').then((res:any) => {
      let body = new FormData();
      // this will calling for check either plan purchased or not
      body.append('Option', 'broadcastJobs');
      body.append('Emp_ID', res.Emp_ID);
      body.append('City', res.City);
      body.append('CityID', res.CityID);
      body.append('Job_ID',res.Job_ID);
      body.append('Location', res.Location);
      body.append('MaxSalary', res.MaxSalary);
      body.append('MinSalary', res.MinSalary);
      body.append('Mobile_No', res.Mobile_No);
      body.append('Name', res.Name);
      body.append('PlanBroadcast', res.PlanBroadcast);
      body.append('Roll', res.Roll);
      body.append('RollID', res.RollID);
      this.broadPlanProvider.fireBroadcast('broadcast.php', body).subscribe((res:any) => {
        console.log("broadcast.php--------->",res)
        this.widget.hideLoading().then();
        if (res.status == 'success') {
          this.widget.presentToast(res.message).then();
          this.navCtrl.push('PaymentSuccessPage').then();
        }
      }, error => {
        this.widget.hideLoading().then();
        console.log("broadcast.php err--------->",error)
        alert(error);
      });
    });

  }

  //Storing information cz after razor pay page will open all the parameter is lost so we are storing first.
  storeInfo(): void {
    let temp = {Emp_ID:this.broadMessage.emp_ID, City:this.broadMessage.city, CityID:this.broadMessage.cityID, Job_ID:this.broadMessage.postID
      , Location: this.broadMessage.hotelName+','+this.broadMessage.city, MaxSalary: this.broadMessage.maxSal, MinSalary: this.broadMessage.minSal, Mobile_No: this.broadMessage.contact,
      Name:this.broadMessage.emp_Name, PlanBroadcast: this.plan_id, Roll: this.broadMessage.job_roll, RollID: this.broadMessage.rollID };
    this.storage.setStorage('temp', temp);
  }

  getBroadcastPlan(): void {
    let body = new FormData();
    // this will calling for check either plan purchased or not
    body.append('option', 'my_broadcast_plan');
    body.append('Emp_ID', this.broadMessage.emp_ID);
    this.broadPlanProvider.getBroadcastActivePlan('plans.php', body).subscribe((res:any) => {
      console.log("getBroadcastActivePlan---->",res)
      if (res.status == 'success') {
        if (res.plans.Broadcast == 'send') {
          this.isPaymentCompleted = false;
        } else if (res.plans.Broadcast == 'pending') {
          this.isPaymentCompleted = true;
          this.plan_name = res.plans.plan_name;
          this.plan_id = res.plans.plan_id;
        }
      }
    });
  }

  // This will give you all plan and details
  getPlanList(): void {
    // This will get available plans for purchase
    this.broadPlanProvider.getBroadcastPlanList('plans.php?option=broadcast_plans').subscribe((res:any) => {
      console.log("getBroadcastPlanList----------->",res)
      if (res.status == 'success') {
       /* res.plans.filter(plan => true).map(plan => {  plan['iconName'] = 'remove-circle'});*/
        this.planList = res.plans;
        this.plan_cost = res.plans[0].plan_cost;
        this.plan_id = res.plans[0].plan_id;
        this.storeInfo();
      }
    });
  }

}
