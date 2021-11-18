import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, Modal, ModalOptions, Navbar, NavController, NavParams, ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { CandidateProvider } from '../../providers/candidate/candidate';
import { ModalController } from 'ionic-angular';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import { SoundProvider } from "../../providers/sound/sound";
import {SafeUrl} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-candidate-details',
  templateUrl: 'candidate-details.html',
})

export class CandidateDetailsPage {
  Plan_ID: any;
  EMP_ID: any;
  candidateDetails: any;
  nav: any;
  number: any;
  info: any;
  candidateNotFound: string;
  item: any;
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController, private callNumber: CallNumber, public modalCtrl: ModalController,
              private localStorage: StorageProvider, public platform: Platform, public navParams: NavParams,
              private service: CandidateProvider,  private ngZone: NgZone, private viewCtrl: ViewController,
              private widget: WidgetProvider,private  soundProvider: SoundProvider ) {
    this.info = navParams.get('info');
    this.item = navParams.get('likeInfo');
    this.fetchSP();
  }


  ionViewDidLoad(): void {
    this.backButton();
  }

  backButton(): void {
    this.platform.registerBackButtonAction(() => {
      this.closeModal();
    });
  }

  fetchSP(): void {
    this.localStorage.getStorage('employeer_details').then((val: any) => {
      this.EMP_ID = JSON.parse(val).ID;
      this.Plan_ID = JSON.parse(val).Plan;
      this.getDetails();
    });
  }

  getDetails(updating?): void {
    if (!updating) {
      this.widget.showLoading('').then();
    }

    let body = new FormData();
    body.append('Option', 'CandidateDetails');
    body.append('ID', this.info.ID);
    body.append('ItemPerPage', "100");
    body.append('PageNo', "0");
    body.append('Employer_ID', this.EMP_ID);

    this.service.getCandidateNewDetails('candidate.php', body).subscribe(
      (data: any) => {
        if (data.candidate.length > 0 || data.candidate.ID) {
          this.candidateDetails = data.candidate;
          if (this.info.nav == "AppliedList") {
            this.candidateDetails.ShowMobile = this.info.showMobile;
            this.candidateDetails.Mobile = this.info.mobile
          }
         // this.countryFlag =  (this.candidateDetails.Country_Name.charAt(0)+this.candidateDetails.Country_Name.charAt(1)).toLowerCase();
          this.updateReadStatus();
        } else {
          this.candidateNotFound = 'Candidate profile link broken...';
          this.widget.presentToast(data.message).then();
        }
        if (!updating) {
          this.widget.hideLoading().then();
        }
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
        this.candidateNotFound = 'Candidate profile link broken...';
        this.widget.presentToast('Please retry or try again after some time').then();
      }
    );
  }

  updateReadStatus(): void {
   this.service.updateReadStatus(this.info.ID,this.EMP_ID).subscribe((res:any) => {
     console.log('Updated read status', res);
   });
  }

  callJoint(telephoneNumber) {
    this.callNumber.callNumber(telephoneNumber, true).then(data => this.backButton());
  }

  play(): void {
    this.soundProvider.play('buttonClick')
  }

  displayContact(candidate_id): void  {
    this.play();
    if (this.Plan_ID > 0) {
      this.widget.showLoading('').then();
      let body = new FormData();
      body.append('Option', 'ViewContacts');
      body.append('User_ID', candidate_id);
      body.append('Employer_ID', this.EMP_ID);
      this.service.getCandidatesforopen('common-operations.php', body).subscribe((data: any) => {
          this.widget.hideLoading().then();
          console.log("ERROR!: ", data);
          if (data.access) {
            this.candidateDetails.ShowMobile = true;
            this.getDetails(true);
          }else {
            
            this.widget.hideLoading().then();
            this.widget.presentToast(data.message).then()
          }
          
        },
        err => {
          this.widget.presentToast('Please try after some time').then();
          console.log("ERROR!: ", err);
          this.widget.hideLoading().then();
        }
      );
    } else {
      let modal = this.modalCtrl.create('DialogModalPage', {modal:'modal'});
      modal.onDidDismiss(data => {
        this.closeModal();
      });
      modal.present().then();
    }
  }

  // This function will handle message sending process it will open message model.
  sendMsg(): void {
    const jobInfo = {
      candidateName: this.candidateDetails.FirstName,
      minSalary: this.candidateDetails.MinSalary,
      maxSalary: this.candidateDetails.MaxSalary,
      post: this.candidateDetails.Roll,
      city: this.candidateDetails.City,
      candidateID: this.candidateDetails.ID,
      country: this.candidateDetails.Country ,
      index: 0
    };
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let messageModal: Modal = this.modalCtrl.create('MessageModalPage', {jobInfo: jobInfo}, modalOptions);
    messageModal.onDidDismiss((data) => {
      if (data.index) {
        this.ngZone.run(() => {
          //this.smsSend = data.index;
          this.candidateDetails.SmsSend = data.index;
          this.backButton();
        });
      }
    });
    messageModal.present().then(res => {});
  }

  //Allow Report
  addReport() {
    event.stopPropagation();
    let modal = this.modalCtrl.create('ReportDialogPage',{broadcast: 'report', cand_details:this.candidateDetails.ID});
    modal.onDidDismiss(data => {
      if (data=="success") {
        this.candidateDetails.AlowReport = false;
      }
    });
    modal.present().then();
  }


  //Like Deslike
  myLikesDislikes(status) {
    this.play();
    this.widget.showLoading('').then();
    this.candidateDetails.LikeStatus = status;
    let body = new FormData();
    body.append('Option', 'myLikesDislikes');
    body.append('User_ID', this.candidateDetails.ID);
    body.append('Employer_ID', this.EMP_ID);
    body.append('status', status);
    this.service.getCandidates('candidate.php', body).subscribe((data: any) => {
        this.widget.hideLoading().then();
      },
      err => {
        this.widget.hideLoading().then();
        console.log("ERROR!: ", err);
      }
    );
  }

  //Close modal with return param
  closeModal(): void {
    this.viewCtrl.dismiss({
      smsSend: this.candidateDetails.SmsSend, showMobile: this.candidateDetails.ShowMobile, number:this.candidateDetails.Mobile,
      allowReport:this.candidateDetails.AlowReport, likeStatus: this.candidateDetails.LikeStatus}).then()
  }

  //Open whats app with message
  getWtsApp(mobile: number): SafeUrl {
    return this.widget.whatsAppOpen(mobile);
  }

  viewProfile(): void {
   /* let url = 'https://hoteljobber.com/user_image/'+this.candidateDetails.Image;
    this.photoView.show('https://www.justinbiebermusic.com/wp-content/themes/justinbieber2/images/bieber-news.png');*/
    /*this.candidateDetails.Name, {share: false}*/
  }
}
