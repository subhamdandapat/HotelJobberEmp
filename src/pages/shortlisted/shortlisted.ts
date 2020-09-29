import {Component, NgZone} from '@angular/core';
import {
  IonicPage,
  ItemSliding,
  Modal,
  ModalController,
  ModalOptions,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import {WidgetProvider} from "../../providers/widget/widget";
import {CandidateProvider} from "../../providers/candidate/candidate";
import {StorageProvider} from "../../providers/storage/storage";
import {CallNumber} from "@ionic-native/call-number";
import {SoundProvider} from "../../providers/sound/sound";
import {SafeUrl} from "@angular/platform-browser";

/**
 This will display list of shorted candidate
 */

@IonicPage()
@Component({
  selector: 'page-shortlisted',
  templateUrl: 'shortlisted.html',
})
export class ShortlistedPage {
  candidateList: any = [];
  empl_details: any;
  page: number = 0;
  totalShortListed: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private widget: WidgetProvider,public modalCtrl: ModalController,
              private platform: Platform, private candidateProvider: CandidateProvider, private localStorage: StorageProvider,
              private ngZone: NgZone, private callNumber: CallNumber, private soundProvider: SoundProvider) {}

  ionViewDidLoad() {
    this.fetchSP();
    this.platform.registerBackButtonAction(() => {
      this.back();
    });
  }

  fetchSP(): void {
    this.localStorage.fetchSP().then((val: any) => {
      this.empl_details = JSON.parse(val);
      this.getShortlist(this.empl_details.ID);
    });
  }

  back(): void {
    this.navCtrl.pop().then();
  }

  // Bring the shortlisted candidate list
  getShortlist(Emp_ID: number): void {
    this.candidateProvider.getShortlist(Emp_ID, this.page).subscribe((res:any) => {
      if (res.status == 'success') {
        this.totalShortListed = res.total;
        res.candidates.filter(object => object.ID == object.ID).map((res: any) => {
          res.Education = res.Education.toString().trim().split(" ", 1);
          if (res.Reg_Date) {
            let last = res.Last_Update.split(' ');
            let reg = res.Reg_Date.split(' ');
            (last[0] == reg[0])?  res['MyLabel'] = 'Reg On': res['MyLabel'] = 'Last Seen';
          } else {
            res['MyLabel'] = 'Last Seen';
          }
          res['removed'] = false;
        });
        if (this.candidateList.length) {
          console.log('this.candidateList');
          for (let i = 0; i < res.candidates.length; i++) {
            this.candidateList.push(res.candidates[i]);
          }
        } else {
          console.log('list is empty');
          this.candidateList = res.candidates;
        }
      } else {
        this.widget.presentToast('Please try again later').then();
      }
    });
  }

  goToCandidateDetail(candidate, index): void {

    let info = {showMobile: candidate.ShowMobile, smsSend: candidate.SmsSend, ID: candidate.ID};
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let candDetail: Modal = this.modalCtrl.create('CandidateDetailsPage',{info:info}, modalOptions);
    candDetail.onDidDismiss((data) => {
      this.ngZone.run(() => {
        this.candidateList[index].ShowMobile = data.showMobile;
        this.candidateList[index].SmsSend = data.smsSend;
        this.candidateList[index].Mobile = data.number;
      });
    });
    candDetail.present().then(res => {});
  }

  displayContact(candidate_id, index) {
    this.play();
    this.widget.showLoading('').then();

    if (this.empl_details.Plan > 0) {
      let body = new FormData();
      body.append('Option', 'ViewContacts');
      body.append('User_ID', candidate_id);
      body.append('Employer_ID', this.empl_details.ID);

      this.candidateProvider.getCandidates('candidate.php', body).subscribe(
        (data: any) => {
          if (data.access) {
            this.candidateList[index].AlowReport = true;
            this.candidateList[index].ShowMobile = true;
            this.candidateList[index].Mobile = data.user.Mobile;
          }
          this.widget.hideLoading().then();
        },
        err => {
          this.widget.hideLoading().then();
          console.log("ERROR!: ", err);
          //  this.org_service.dismissLoading();
        }
      );
    } else {
      this.widget.hideLoading().then();
      let modal = this.modalCtrl.create('DialogModalPage',{nav:" "});
      modal.onDidDismiss(data => {});
      modal.present().then();
    }
  }
  //Open whats app with message
  getWtsApp(mobile: number): SafeUrl {
    return this.widget.whatsAppOpen(mobile);
  }

  // This function will handle message sending process it will open message model.
  sendMsg(index): void {
    const jobInfo = {
      candidateName: this.candidateList[index].FirstName,
      minSalary: this.candidateList[index].MinSalary,
      maxSalary: this.candidateList[index].MaxSalary,
      post: this.candidateList[index].Roll,
      city: this.candidateList[index].City,
      candidateID: this.candidateList[index].ID,
      country: this.candidateList[index].Country ,
      index: index
    };
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let messageModal: Modal = this.modalCtrl.create('MessageModalPage',{jobInfo: jobInfo}, modalOptions);
    messageModal.onDidDismiss((data) => {
      if (data.index) {
        this.ngZone.run(() => {
          this.candidateList[index].SmsSend = true;
        });
      }
    });
    messageModal.present().then(res => {});
  }

  // This will auto pop-up the native calling pad.
  callJoint(telephoneNumber): void {
    this.callNumber.callNumber(telephoneNumber, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  parsCurrency(value): number {
    return parseInt(value);
  }

  removeCandidate(itemSlide: ItemSliding, item: any, index: number): void {
    this.widget.showLoading(' ').then();
    this.candidateProvider.removeShortlist(item.ID, this.empl_details.ID).subscribe((res: any) => {
      if (res.status == 'success') {
        this.ngZone.run(() => {
          this.candidateList[index].removed = true;
        });
        this.totalShortListed = this.totalShortListed - 1;
      }
    });
    this.widget.hideLoading().then();
    this.onlyCloseSwipe(itemSlide);
  }

  onlyCloseSwipe(itemSlide:ItemSliding): void {
    itemSlide.close();
  }

  undo(itemSlide: ItemSliding, item: any, index: number): void {
    this.widget.showLoading(' ').then();
    this.candidateProvider.addShortlist(item.ID, this.empl_details.ID).subscribe((res: any) => {
      if (res.status == 'success') {
        this.ngZone.run(() => {
          this.candidateList[index].removed = false;
        });
        this.totalShortListed = this.totalShortListed + 1;
      }
    });
    this.widget.hideLoading().then();
    this.onlyCloseSwipe(itemSlide);
  }

  play(): void {
    this.soundProvider.play('buttonClick');
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.getShortlist(this.empl_details.ID);
    setTimeout(() => {
      infiniteScroll.complete();
    }, 3000);
  }

  doRefresh(event) {
    this.page = 0;
    this.getShortlist(this.empl_details.ID);
    this.candidateList = [];
    setTimeout(() => {
      event.complete();
    }, 2000);
  }
}
