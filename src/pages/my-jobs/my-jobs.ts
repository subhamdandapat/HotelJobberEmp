import { Component } from '@angular/core';
import {IonicPage, Modal, ModalController, ModalOptions, NavController, NavParams, Platform} from 'ionic-angular';
import { JobProvider } from "../../providers/job/job";

@IonicPage()
@Component({
  selector: 'page-my-jobs',
  templateUrl: 'my-jobs.html',
})
export class MyJobsPage {
  orgInformation: any;
  page: number = 0;
  jobList: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private  job_service: JobProvider, private modalCtrl:  ModalController,
              private platform: Platform) {
    this.orgInformation = this.navParams.get('orgInfo');
    this.getMyJobList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyJobsPage');
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

