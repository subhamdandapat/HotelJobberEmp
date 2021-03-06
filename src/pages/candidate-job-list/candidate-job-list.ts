import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams, ModalOptions, Modal, Content} from 'ionic-angular';
import { JobProvider } from '../../providers/job/job';
import { Platform } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { AlertController } from 'ionic-angular';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import { EmployeerProvider } from "../../providers/employeer/employeer";
import { SelectSearchable } from "ionic-select-searchable";
import { BroadcastProvider } from '../../providers/broadcast/broadcast';

@IonicPage()
@Component({
  selector: 'page-candidate-job-list',
  templateUrl: 'candidate-job-list.html',
})
export class CandidateJobList {
  Emp: any;
  candidateJobList: any[] = [];
  jobRollList: any[] = [];
  empJobList: any[] = [];
  page: number = 0;
  appCloseOpen: boolean = false;
  selectedRollID: string = '';
  removeLabel: boolean = false;
  @ViewChild(Content)
  content: Content;
  hideScroll: boolean = false;
  myJobsOpen: boolean = false;
  pageTitle: string = 'Jobs Available';
  bCount: boolean = false;
  totalJobs: number = 0;
  expiredJobCount: number = 0;
  activeJobCount: number = 0;
  currentDate :any = new Date()
  planList: any;
  plan_cost: any;
  plan_id: any;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private alertCtrl: AlertController,
              private datePipe: DatePipe, public platform: Platform, public navParams: NavParams,private empProvider: EmployeerProvider,
              private localStorage: StorageProvider, public job_service: JobProvider, private widget: WidgetProvider,
              private broadPlanProvider: BroadcastProvider) {
    this.getCandidateJobList();
    this.getAllRoll();
    this.fetchSData();
    this.getPlanList()
  }

  ionViewWillEnter(): void {
    if (this.bCount) {
      this.myJobsOpen = false;
      this.pageTitle = 'Jobs Available';
    } else {
      this.bCount = true;
    }
    this.backButton();
    this.content.ionScrollStart.subscribe((data) => { this.hideScroll = false; });
  }

  backButton(): void {
    this.widget.appClose();
  }

  fetchSData(): void {
    this.localStorage.fetchSP().then((employeeDetail: any) => {
      this.Emp =  JSON.parse(employeeDetail);
     this.getMyJobs(JSON.parse(employeeDetail).ID);
    });
  }

  getMyJobs(Emp_ID): void {
    this.job_service.getEmpMyJobs('job.php?option=employerJobs&Jobs_Per_Page=100&Emp_ID='+Emp_ID+'&Org_ID=&Page_No=0&OrderBy=').subscribe( (data:any) => {
      if (data.status == 'success') {
        console.log("my jobs data------->",data.jobs);
       // this.empJobList = data.jobs;
        this.countNumberOfJobs(this.empJobList);
        if (this.empJobList.length > 0) {
          for (let i = 0; i < data.jobs.length; i++) {
            if (!data.jobs[i].Job_Expired ) {
              this.empJobList.push(data.jobs[i]);
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
    })
  }

  countNumberOfJobs(jobList): void {
    let expiredList = jobList.filter( job => job.Expired);
    this.activeJobCount = (jobList.length - expiredList.length);
    this.expiredJobCount = expiredList.length;
  }

  ionViewDidLoad() {}

  getCandidateJobList() {
    this.job_service.getCandidateJobList('job.php?option=userJobs&Jobs_Per_Page=100&User_ID=&Page_No='+this.page+'&OrderBy=desc&quicksearch='+this.selectedRollID).subscribe((data: any) => {
      if (data.status == 'success' && data.jobs) {
        
        console.log("jobs data------->",data.jobs);

        this.totalJobs = data.total_job_count;
        if (this.candidateJobList.length > 0) {
          for (let i = 0; i < data.jobs.length; i++) {
            this.candidateJobList.push(data.jobs[i])
          }
        } else {
          this.candidateJobList = data.jobs;
        }
      }
    },
      err => {
        console.log("ERROR!: ", err);
        //this.widget.hideLoading().then();
      }
    );
  }

  portChangeRoll(event: { component: SelectSearchable, value: any }) {
    this.selectedRollID = event.value.RoleID;
    this.candidateJobList = [];
    this.page = 0;
    this.removeLabel = true;
    // Get available job list for candidate
    this.getCandidateJobList();
  }

  showNotification(): void {
    this.widget.openNotification();
  }

  getAllRoll() {
    let body = new FormData();
    body.append('option', 'AllActiveRoles');
    this.job_service.getJobRolls('common-operations.php', body).subscribe(data => {
      this.jobRollList = data;
    },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  showCandidateApp(): void {
   // let broadMessage = { postID: post.ID, jobTitle: post.JobTitle, city: post.City, hotelName: post.Organisation_Name, minSal: post.MinSalary, maxSal: post.MaxSalary, contact: post.ContactNo};
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let modal = this.modalCtrl.create('ReportDialogPage',{ broadcast:'candidateApply' }, modalOptions);
    modal.onDidDismiss((data: any) => {});
    modal.present().then();
  }

  openAppliedList(jobID): void {
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let openAppliedJob: Modal = this.modalCtrl.create('AppliedCandidatePage',{info:jobID}, modalOptions);
    openAppliedJob.onDidDismiss((data) => {
      this.backButton();
    });
    openAppliedJob.present().then(res => {});
  }

  myJobDetails(job_ID): void {
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let jobDetails: Modal = this.modalCtrl.create('JobDetailsPage',{job_ID: job_ID}, modalOptions);
    jobDetails.onDidDismiss((data) => {
      this.backButton();
    });
    jobDetails.present().then(res => {console.log('')});
  }

  candidateJobDetails(job): void {
    this.navCtrl.push('CandidateJobDetailsPage', {jobID: job.ID , logo: job.organisation_logo}).then();
  }

  changePage(): void {
    (!this.myJobsOpen)? this.pageTitle = 'My Jobs': this.pageTitle = 'Jobs Available';
    this.myJobsOpen = !this.myJobsOpen;
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.getCandidateJobList();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 2000);
  }

  ScrollToTop() {
    this.content.scrollToTop(1500).then(res => {
      this.hideScroll = true;
    });
  }

   //Finally Broadcast page
   openBroadcast(post): void {
    let broadMessage = { job_roll: post.Roll, emp_Name: this.Emp.Name, rollID: post.RollID, cityID: post.CityID, emp_mobile: this.Emp.Mobile, emp_email: this.Emp.Email_ID, emp_ID: this.Emp.ID, postID: post.ID, jobTitle: post.JobTitle, city: post.City, hotelName: post.Organisation_Name, minSal: post.MinSalary, maxSal: post.MaxSalary, contact: post.ContactNo};
    this.navCtrl.push('BroadcastPaymentPage', {message: broadMessage}).then();
  }
  doRefresh(event) {
    this.candidateJobList = [];
    this.getCandidateJobList();
    setTimeout(() => {
      event.complete();
    }, 3000);
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
}
