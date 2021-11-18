import { Component } from '@angular/core';
import {IonicPage, Modal, ModalController, ModalOptions, NavController, NavParams, Platform} from 'ionic-angular';
import { BroadcastProvider } from '../../providers/broadcast/broadcast';
import { JobProvider } from "../../providers/job/job";
import { StorageProvider } from '../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'page-my-jobs',
  templateUrl: 'my-jobs.html',
})
export class MyJobsPage {
  Emp: any;
  orgInformation: any;
  page: number = 0;
  jobList: any[] = [];
  jobtitle:any="My Jobs";
  currentDate :any = new Date()
  planList: any;
  plan_cost: any;
  plan_id: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private  job_service: JobProvider, private modalCtrl:  ModalController,
              private platform: Platform,private localStorage: StorageProvider,private broadPlanProvider: BroadcastProvider) {
    this.orgInformation = this.navParams.get('orgInfo');
    console.log(this.orgInformation)
    this.getMyJobList();
    this.getPlanList()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyJobsPage',this.currentDate);
    this.localStorage.fetchSP().then((employeeDetail: any) => {
      this.Emp =  JSON.parse(employeeDetail);
    });
  }

  ionViewWillEnter() {
    this.back();
  }

  back(): void {
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop().then();
    });
  }

  getMyJobList() {
    this.job_service.getJobList('job.php?option=employerJobs&Jobs_Per_Page=50&Emp_ID='+this.orgInformation.emp_ID+'&Org_ID='+this.orgInformation.org_ID+'&Page_No='+this.page).subscribe((data: any) => {

        if (data.status == 'success' && data.jobs) {
          console.log("my jobs----->k,",data.jobs);
          this.jobtitle  ="Jobs In" + " " +data.jobs[0].Organisation_Name
          //If jobList empty or not
          if (this.jobList.length > 0) {
            for (let i = 0; i < this.jobList.length; i++) {
              this.jobList.push(data.jobs[i])
            }
          } else {
              this.jobList = data.jobs;
          }
        }
      },
      err => {
        console.log("ERROR!: ", err);
        //this.widget.hideLoading().then();
      }
    );
  }

  jobDetails(job): void {
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let jobDetails: Modal = this.modalCtrl.create('JobDetailsPage',{job_ID: job.ID, logo: job.organisation_logo, org_type: job.Organisation_Type}, modalOptions);
    jobDetails.onDidDismiss((data) => {
      this.back();
    });
    jobDetails.present().then(res => {console.log('')});
  }

  openAppliedList(jobID): void {
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let openAppliedJob: Modal = this.modalCtrl.create('AppliedCandidatePage',{info:jobID}, modalOptions);
    openAppliedJob.onDidDismiss((data) => {
      this.back();
    });
    openAppliedJob.present().then(res => {});
  }

   //Finally Broadcast page
   openBroadcast(post): void {
    let broadMessage = { job_roll: post.Roll, emp_Name: this.Emp.Name, rollID: post.RollID, cityID: post.CityID, emp_mobile: this.Emp.Mobile, emp_email: this.Emp.Email_ID, emp_ID: this.Emp.ID, postID: post.ID, jobTitle: post.JobTitle, city: post.City, hotelName: post.Organisation_Name, minSal: post.MinSalary, maxSal: post.MaxSalary, contact: post.ContactNo};
    this.navCtrl.push('BroadcastPaymentPage', {message: broadMessage}).then();
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
  /*deleteJob(Job_id) {
    let alert = this.alertCtrl.create({
      title: '',
      message: 'Are you sure you want to  delete this Job?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.widget.showLoading('please wait..').then();
            let body = new FormData();
            body.append('option', 'empmyjobremove');
            body.append('job_id', Job_id);
            body.append('Emp_ID', this.E_ID);

            this.job_service.postJob('job.php', body).subscribe(
              data => {

                if (data.status == "success") {
                  // this.job_service.callToast(data.message);
                  this.widget.hideLoading().then();
                  this.fetchSData()
                } else {
                  // this.job_service.callToast(data.message);
                  this.widget.hideLoading().then();
                }
              },
              err => {
                console.log("ERROR!: ", err);
                this.widget.hideLoading().then();
              }
            );
          }
        }
      ]
    });
    alert.present().then();
  }*/
}

