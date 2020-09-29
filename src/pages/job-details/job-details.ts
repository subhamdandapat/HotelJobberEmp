import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { JobProvider } from '../../providers/job/job';
import { WidgetProvider } from "../../providers/widget/widget";


@IonicPage()
@Component({
  selector: 'page-job-details',
  templateUrl: 'job-details.html',
})

export class JobDetailsPage {
  jobDetails: any;
  ID: any;
  item: any;
  logo: string = '';
  Organisation_Type: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform
  , public job_service: JobProvider, private widget: WidgetProvider, private viewCntrl: ViewController) {
    this.ID = navParams.get('job_ID');
    this.logo = this.navParams.get('logo');
    this.getJobDetails(this.ID);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobDetailsPage');
    this.platform.registerBackButtonAction(() => {
      this.closeModal()
    });
  }

  getJobDetails(ID) {
    this.widget.showLoading('').then();
        let body = new FormData();
        body.append('option', 'employerJobs');
        body.append('Job_ID', ID);

        this.job_service.postJob('job.php', body).subscribe(
          (data: any) => {
            if (data.status == "success") {
              this.jobDetails = data.jobs[0];
              this.jobDetails['Organisation_Type'] = this.navParams.get('org_type');
              this.widget.hideLoading().then();
            } else {
              this.widget.presentToast(data.message).then();
              this.widget.hideLoading().then();
            }
          },
          err => {
            console.log("ERROR!: ", err);
            this.widget.hideLoading().then();
          }
        );
      }

  closeModal(): void {
    this.viewCntrl.dismiss().then()
  }
}
