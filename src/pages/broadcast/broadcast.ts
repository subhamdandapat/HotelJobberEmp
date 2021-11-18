import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  Modal,
  ModalController,
  ModalOptions,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import { StorageProvider } from "../../providers/storage/storage";
import { EmployeerProvider } from "../../providers/employeer/employeer";
import { JobProvider } from "../../providers/job/job";
import { WidgetProvider } from "../../providers/widget/widget";
import {BroadcastProvider} from "../../providers/broadcast/broadcast";
import {PlanPrizeProvider} from "../../providers/plan-prize/plan-prize";
import {OrganizationProvider} from "../../providers/organization/organization";

@IonicPage()
@Component({
  selector: 'page-broadcast',
  templateUrl: 'broadcast.html',
})
export class BroadcastPage {
  Emp: any;
  myPostedJob: any[] = [];
  appCloseOpen: boolean = false;
  page: number = 0;
  transID: string = '';
  noJobsFound: boolean = false;
  noOrgFound: boolean = false;
  planList: any;
  plan_cost: any;
  plan_id: any;
  islist: boolean  =false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private localStorage: StorageProvider, private platform: Platform,
              private modalCtrl: ModalController, private empProvider: EmployeerProvider,  public job_service: JobProvider, private planProvider: PlanPrizeProvider,
              public alertCtrl: AlertController, private widget:WidgetProvider, private orgProvider: OrganizationProvider,
              private broadPlanProvider: BroadcastProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad BroadcastPage');
    this.fetchSP();
    this.getPlanList()
  }

  ionViewWillEnter(): void {
    console.log('ionViewWillEnter BroadcastPage');
    this.backButton();
  }

  backButton(): void {
    this.widget.appClose();
  }

  fetchSP(): void {
    // This should be in local provider.
    this.localStorage.getStorage('employeer_details').then((employeeDetail: any) => {
      this.Emp =  JSON.parse(employeeDetail);
      this.getMyJob(this.Emp.ID);
      this.getSentList()
    });
  }

  moreInfo(): void {
    const modalOptions: ModalOptions = { enableBackdropDismiss: true };
    let modal = this.modalCtrl.create('ReportDialogPage',{ broadcast:'more-info'}, modalOptions);
    modal.onDidDismiss((data: any) => {
     // Do things if required :-)
      this.backButton();
    });
    modal.present().then();
  }

  //Finally Broadcast page
  openBroadcast(post): void {
    let broadMessage = { job_roll: post.Roll, emp_Name: this.Emp.Name, rollID: post.RollID, cityID: post.CityID, emp_mobile: this.Emp.Mobile, emp_email: this.Emp.Email_ID, emp_ID: this.Emp.ID, postID: post.ID, jobTitle: post.JobTitle, city: post.City, hotelName: post.Organisation_Name, minSal: post.MinSalary, maxSal: post.MaxSalary, contact: post.ContactNo};
    this.navCtrl.push('BroadcastPaymentPage', {message: broadMessage}).then();
  }

  //Navigate to notification page.
  showNotification(): void {
    this.widget.openNotification();
  }

  openSentList(): void {
    this.navCtrl.push('BroadcastSentPage', {emp_ID: this.Emp.ID}).then();
  }

  //Get my posted job
  getMyJob(EMP_ID) {
    let body = new FormData();
    body.append('option', 'employerJobs');
    body.append('Page_No', this.page+'');
    body.append('Jobs_Per_Page', '100');
    body.append('Emp_ID', EMP_ID);

    this.job_service.postJob('job.php', body).subscribe((data:any) => {
      console.log("myPostedJob------->>",data)
       if (data.status == "success") {
         if (this.myPostedJob.length > 0) {
           for (let i = 0; i < data.jobs.length; i++) {
             if (!data.jobs[i].Job_Expired ) {
               this.myPostedJob.push(data.jobs[i]);
             }
           }
         } else {
           for (let i = 0; i < data.jobs.length; i++) {
             if (data.jobs[i].Job_Expired) {
               //this.myPostedJob.push(data.jobs[i]);
             }
           }
         }
       }

        //Check when no jobs available
        if (this.myPostedJob.length == 0) {
          console.log('myPostedJob.length == 0');
          this.setCursonIfNoJobs();
        }
      },
      err => {
        console.log("ERROR!: ", err);
        //this.widget.hideLoading().then();
      }
    );
  }

  //Job Details Page
  jobDetails(job): void {
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let jobDetails: Modal = this.modalCtrl.create('JobDetailsPage',{job_ID: job.ID, logo: job.organisation_logo, org_type: job.Organisation_Type}, modalOptions);
    jobDetails.onDidDismiss((data) => {
      this.backButton();
    });
    jobDetails.present().then(res => {console.log('')});
  }

  //Scroll for broadcast message to be send
  doInfinite(infiniteScroll) {
    this.page++;
    this.getMyJob(this.Emp.ID);
    setTimeout(() => {
      infiniteScroll.complete();
    }, 3000);
  }


  setCursonIfNoJobs(): void {
    this.orgProvider.getMyOrganization(this.Emp.ID).subscribe((data: any) => {
        if (data.organisation.length > 0) {
          this.noJobsFound = true;
          this.noOrgFound = false;
        } else {
          this.noJobsFound = false;
          this.noOrgFound = true;
        }
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  /*togglePlan(plan): void {
    if(plan.showDetails) {
      plan.iconName = 'add-circle';
      plan.showDetails = false;
    } else {
      plan.showDetails = true;
      plan.iconName = 'remove-circle';
    }
  }*/

  //Post job
  createOrganizationPage() {
    this.navCtrl.parent.select(2);
  }

  //This will refresh page or reload
  doRefresh(event): void {
    this.page = 0;
    this.myPostedJob = [];
    this.getMyJob(this.Emp.ID);
    setTimeout(() => {
      event.complete();
    }, 2000);
  }

  openAppliedList(jobID): void {
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let openAppliedJob: Modal = this.modalCtrl.create('AppliedCandidatePage',{info:jobID}, modalOptions);
    openAppliedJob.onDidDismiss((data) => {
      this.backButton();
    });
    openAppliedJob.present().then(res => {});
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
          
        }
      });
    }

    getSentList(): void {
      this.broadPlanProvider.getBroadcastSentList('broadcast.php?Option=sendList&ItemPerPage=50&Emp_ID='+this.Emp.ID+'&PageNo='+this.page)
        .subscribe((res: any) => {
          console.log(res)
          if (res.status == 'success') {
            if ( res.broadcast_list.length > 0 ) {
             this.islist  = true
            } else {
              
            }
          }
        })
    }

}
