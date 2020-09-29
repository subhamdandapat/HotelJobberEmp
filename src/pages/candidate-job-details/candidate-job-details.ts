import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { WidgetProvider } from "../../providers/widget/widget";
import { StorageProvider } from "../../providers/storage/storage";
import {CandidateProvider} from "../../providers/candidate/candidate";

@IonicPage()
@Component({
  selector: 'page-candidate-job-details',
  templateUrl: 'candidate-job-details.html',
})
export class CandidateJobDetailsPage {
  jobDetails: any;
  item: any;
  candidateInfo: any;
  openModal: boolean = false;
  update: boolean = false;
  logo: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: StorageProvider,
              public platform: Platform, private widget: WidgetProvider, private alertCtrl: AlertController,
              private viewCtrl: ViewController, private candidateProvider: CandidateProvider) {
     this.logo = this.navParams.get('logo');
  }

  ionViewDidLoad(): void {
    this.getJobDetails();
    this.platform.registerBackButtonAction(() => {
     this.back();
    });
  }

  getJobDetails(): void {
        this.candidateProvider.getCandidateJobDetails('job.php?option=jobDetails&Job_ID='+this.navParams.get('jobID')+'&User_ID=').subscribe(
          (data: any) => {
            console.log('---', data);
            if (data.status == "success") {
              this.jobDetails = data.jobs;
            }
          },
          err => {
            console.log("ERROR!: ", err);
          }
        );
  }

  back(): void {
        if (this.navParams.get('openModal'))
          this.viewCtrl.dismiss({update: this.update}).then();
        else
          this.navCtrl.pop().then();
  }

  playStore(): void {
    window.open("https://play.google.com/store/apps/details?id=com.hoteljobber.candidate", '_system', 'location=yes');
  }

}
