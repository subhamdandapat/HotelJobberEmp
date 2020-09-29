import {Component, NgZone, ViewChild} from '@angular/core';
import {
  AlertController,
  Content,
  IonicPage, Modal,
  ModalController,
  ModalOptions,
  NavController,
  NavParams,
  Platform, ViewController
} from 'ionic-angular';
import {CityProvider} from "../../providers/city/city";
import {OrganizationProvider} from "../../providers/organization/organization";
import {CallNumber} from "@ionic-native/call-number";
import {StorageProvider} from "../../providers/storage/storage";
import {CandidateProvider} from "../../providers/candidate/candidate";
import {WidgetProvider} from "../../providers/widget/widget";
import {SafeUrl} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-applied-candidate',
  templateUrl: 'applied-candidate.html',
})
export class AppliedCandidatePage {

  Plan_ID: any;
  EMP_ID: any;
  displatDetails: any;
  items: any = [];
  items1: any = [];
  contactDetails: any;
  page: number = 0;
  info : any;

  constructor (public alertCtrl: AlertController, private cityService: CityProvider, private navParam: NavParams,
               public org_service: OrganizationProvider, public navCtrl: NavController, public modalCtrl: ModalController,
               public platform: Platform, private callNumber: CallNumber, private localStorage: StorageProvider,
               private service: CandidateProvider, private ngZone: NgZone, private widget: WidgetProvider,
               private viewCtrl: ViewController) {}

  ionViewDidLoad(): void {
    console.log('ViewDidLoad:');
    this.fetchSP();
  }

  ionViewWillEnter(): void {
    console.log('ionViewWillEnter:');
    this.platform.registerBackButtonAction(() => {
      this.closeModal();
    });
  }

  // Fetch SP
  fetchSP(): void {
    // This should be in local provider.
    this.localStorage.fetchSP().then((employeeDetail: any) => {
      this.EMP_ID = JSON.parse(employeeDetail).ID;
      this.Plan_ID = JSON.parse(employeeDetail).Plan;
      this.getCandidateList();
      this.widget.showLoading('').then();
    });
  }

  //This will open candidate detail modal and after that update value in back end.
  goToCandidateDetail(candidate, index) {
    let info = { showMobile: candidate.ShowMobile, smsSend: candidate.SmsSend, ID: candidate.ID, nav: 'AppliedList', mobile: candidate.Mobile };

    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let candDetail: Modal = this.modalCtrl.create('CandidateDetailsPage',{info:info}, modalOptions);
    candDetail.onDidDismiss((data) => {
      this.ngZone.run(() => {
        // Do something here if needed...
      });
    });
    candDetail.present().then(res => {});
  }

  /*sendMsg(index): void {
    const jobInfo = {
      candidateName: this.items[index].FirstName, minSalary: this.items[index].MinSalary,
      maxSalary: this.items[index].MaxSalary, post: this.items[index].Roll, city: this.items[index].City,
      candidateID: this.items[index].ID, country: this.items[index].Country ,index: index
    };
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let messageModal: Modal = this.modalCtrl.create('MessageModalPage',{jobInfo: jobInfo}, modalOptions);
    messageModal.onDidDismiss((data) => {
      if (data.index) {
        this.ngZone.run(() => {
          this.items[index].SmsSend = true;
        });
      }
    });
    messageModal.present().then(res => {});
  }*/

  getCandidateList(): void {
    this.service.getApliedCandidateList(this.navParam.get('info'), this.EMP_ID, this.page).subscribe((data: any) => {

        if (data.status=="success") {
          this.contactDetails = data.candidates[0].JobTitle;
          data.candidates.filter(object => object.ID == object.ID).map((res: any) => {
            if (res.Reg_Date) {
              let last = res.Last_Update.split(' ');
              let reg = res.Reg_Date.split(' ');
              (last[0] == reg[0])?  res['MyLabel'] = 'Reg On': res['MyLabel'] = 'Last Seen';
            } else {
              res['MyLabel'] = 'Last Seen';
            }
          });
          if (this.items.length) {
            for (let i = 0; i < data.candidates.length; i++) {
              this.items.push(data.candidates[i]);
            }
          } else  {
            this.items = data.candidates;
          }
        }
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  //Open whats app with message
  getWtsApp(mobile: number): SafeUrl {
    return this.widget.whatsAppOpen(mobile);
  }

  callJoint(telephoneNumber): void {
    this.callNumber.callNumber(telephoneNumber, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  closeModal(): void {
    this.viewCtrl.dismiss().then()
  }

  doInfinite(infiniteScroll) {
    // this.page = this.page+1;
    setTimeout(() => {
      this.page++;
      this.getCandidateList();
      infiniteScroll.complete();
    }, 2000);
  }

}
