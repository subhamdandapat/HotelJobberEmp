import { CallNumber } from '@ionic-native/call-number';
import { Platform, IonicPage, Content, NavController, ModalOptions, ModalController, ItemSliding } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SelectSearchable } from "ionic-select-searchable";
import { Modal } from 'ionic-angular';
import { OrganizationProvider } from '../../providers/organization/organization';
import { CityProvider } from '../../providers/city/city';
import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { Component, NgZone, ViewChild } from '@angular/core';
import { CandidateProvider } from '../../providers/candidate/candidate';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import { EmployeerProvider } from "../../providers/employeer/employeer";
import {SoundProvider} from "../../providers/sound/sound";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-tab2',
  templateUrl: 'tab2.html',
})

export class Tab2Page {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  reportedID: any;
  search_flag: boolean = false;
  report_index: any;
  Plan_ID: any;
  reported_flag: boolean = false;
  report_flag: boolean = true;
  notification_count: number;
  notification_data: any[] = [];
  selectedCountryID: any;
  itemsCountryList: any;
  selectedRollID: any = "";
  itemsRollList: any[] = [];
  searchResultsCount: any;
  search_text: string;
  EMP_ID: any;
  flags: any; array: any;
  optionTitle: any;
  optionTitle1: any = "";
  likeDetails: any;
  user_id: any;
  lenght1: any;
  likes: boolean;
  Contact: any;
  candidate_flag: boolean;
  list_label:string = "My Calls";
  selectedRoll: any;
  descending: boolean = false;
  order: number;
  column: string = 'name';
  Total_Contact: any;
  View_Contact: any;
  balance_contact: any;
  flag: boolean = false;
  displatDetails: any;
  contactDetails: any;
  @ViewChild(Content)
  content: Content;
  items: any = [];
  items1: any = [];
  selectedCountry: any;
  update_flag: boolean = false;
  page: number = 0;
  titleSearch: String = "Search by Role";
  titleCity: String = "Search by City";
  ports: any = [] = [];
  hideScroll: boolean = true;
  appCloseOpen: boolean = false;
  constructor (public alertCtrl: AlertController, private cityService: CityProvider,private empProvider: EmployeerProvider,
               public org_service: OrganizationProvider, public navCtrl: NavController, public modalCtrl: ModalController,
               public platform: Platform, private callNumber: CallNumber, private localStorage: StorageProvider,private sanitizer: DomSanitizer,
               private service: CandidateProvider, private ngZone: NgZone, private widget: WidgetProvider,  private soundProvider: SoundProvider) {}


  ngOnInit() {
    this.widget.showLoading('').then();
    //Get EMP ID and get candidate list.
    this.fetchSP();
    this.flags = 'simple';
   }

   ngAfterViewInit() {
    this.content.ionScrollStart.subscribe((data) => {this.hideScroll = false; });
  }

  ionViewDidLoad(): void {
    console.log('ViewDidLoad:');
    this.getAllRoll();
    this.ports = this.cityService.getResults('');
  }

  ionViewWillEnter(): void {
    if (this.search_flag == false) {
      this.page = 0;
    }
    this.backButton();
  }

  backButton(): void { this.widget.appClose(); }

  showNotification(): void {
    this.widget.openNotification();
  }

  goToCandidateDetail(candidate, index) {

    let info = {showMobile: candidate.ShowMobile, smsSend: candidate.SmsSend, ID: candidate.ID};
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let candDetail: Modal = this.modalCtrl.create('CandidateDetailsPage',{info:info}, modalOptions);
    candDetail.onDidDismiss((data) => {
      this.ngZone.run(() => {
        this.items[index].ShowMobile = data.showMobile;
        this.items[index].SmsSend = data.smsSend;
        this.items[index].Mobile = data.number;
        this.items[index].AlowReport = data.allowReport;
        this.items[index].status = data.likeStatus;
      });
      this.backButton();
    });
    candDetail.present().then(res => {});
  }

  fetchSP() {
    this.localStorage.fetchSP().then((val: any) => {
      this.EMP_ID = JSON.parse(val).ID;
      this.Plan_ID = JSON.parse(val).Plan;
      this.getCandidates();
    });
  }

  play(): void {
    this.soundProvider.play('buttonClick')
  }

  addReport(event, cand_details, i) {
    event.stopPropagation();
    let modal = this.modalCtrl.create('ReportDialogPage', { broadcast: 'report', cand_details: cand_details.ID });
    modal.onDidDismiss(data => {

      if (data == "success") {
        this.report_index = i;
        this.reportedID = cand_details.ID;
        this.items[i].AlowReport = false;
      }
    });
    modal.present().then();
  }

  sendMsg(index): void {
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
  }

  getAllRoll() {
    let body = new FormData();
    body.append('option', 'AllActiveRoles');
    this.org_service.createOrganization('common-operations.php', body).subscribe((data: any) => {
        this.itemsRollList = data;
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
      }
    );
  }

  getStatusColor(status) {
    return 'none';
  }

  myLikes(type) {
    if (type == "likes") {
      this.list_label="My Likes";
      this.likes = true;
      this.page = 0;
      this.flags = "simple";
    }
    else {
      this.likes = false;
      this.list_label="My Calls";
      this.page = 0;
    }
    this.getCandidates();
    this.items = [];
  }

  portChangeRoll(event: { component: SelectSearchable, value: any }) {
    this.titleSearch = "";
    this.flags = "search";
    this.search_flag = true;
    this.selectedRollID = event.value.RoleID;
    //this.selectedCountry=event.value.Name;

    this.localStorage.setStorage('search_roll_index', this.itemsRollList.indexOf(event.value));
    this.page = 0;
    console.log('this.getCandidates()  called:');
    this.getCandidates();
    this.items = '';
  }

  searchPorts(event: { component: SelectSearchable, text: string }) {
    let text = (event.text || '').trim().toLowerCase();

    if (!text) {
      event.component.items = [];
      return;
    } else if (event.text.length < 3) {
      return;
    }

   event.component.isSearching = true;
    this.cityService.getResults(text).subscribe(ports => {
      event.component.items = ports.filter(port => {
        return port.optionTitle.toLowerCase().indexOf(text) !== -1;
      });
     event.component.isSearching = false;
    });
  }

  portSelectCity(event: { component: SelectSearchable, value: any }) {
    this.titleCity = "";
    this.flags = "search";

    let city = event.value;
    this.array = city.optionTitle.split(",");

    this.optionTitle1 = event.value.optionId;

    let obj = {
      "optionId": city.optionId,
      "optionTitle": city.optionTitle
    };
    this.localStorage.setStorage('search_roll_city', obj);
    this.page = 0;
    this.getCandidates();
    this.items = '';
  }

  closeSwipe(itemSlide: ItemSliding, item: any, index: number): void {
    this.widget.showLoading(' ').then();
    this.ngZone.run(() => {
      this.items[index].shortlist = true;
    });
    this.service.addShortlist(item.ID, this.EMP_ID).subscribe((res: any) => {
      if (res.status == 'success') {}
    });
    this.widget.hideLoading().then();
    this.onlyCloseSwipe(itemSlide);
  }

  onlyCloseSwipe(itemSlide:ItemSliding): void {
    itemSlide.close();
  }

  //Open whats app with message
  getWtsApp(mobile: number): SafeUrl {
    return this.widget.whatsAppOpen(mobile);
  }

 /* getFilter() {
   /!* this.page = 0;
    this.items = [];
    let body = new FormData();

    if (this.likes) {
      body.append('Option', 'mylikes');
    } else {
      body.append('Option', 'SearchCandidatesViewed');
    }

    body.append('ItemPerPage', '50');
    body.append('PageNo', '' + this.page++);
    body.append('Employer_ID', this.EMP_ID);
    body.append('RoleID', this.selectedRollID);
    body.append('City', this.optionTitle1);

    this.service.getCandidates('candidate.php', body).subscribe(data => {
        this.contactDetails = data;
        if (data.status=="success") {
          this.balance_contact = this.contactDetails.balance_contact;
          this.Contact=this.contactDetails.view_contact;

         this.Total_Contact = this.contactDetails.total_contact;
         this.items = data.candidates;
         this.lenght1 = this.items.length;
         if(this.lenght1==0)
         this.candidate_flag=true;
        }
        //this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);
        //  this.org_service.dismissLoading();
      // this.widget.hideLoading().then();
      }
    );*!/
  }*/

  gotoPlans(): void {

    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let candDetail: Modal = this.modalCtrl.create('PlansPricingPage',{navigate:"tab2"}, modalOptions);
    candDetail.onDidDismiss((data) => {
      // Do something here if  required.
    });
    candDetail.present().then(res => {});
  }

  callJoint(telephoneNumber): void {
    this.callNumber.callNumber(telephoneNumber, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.getCandidates();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 2000);
  }

  getCandidates() {
    let body = new FormData();
    if (this.flags == "simple") {
      if (this.likes) {
        body.append('Option', 'mylikes');
      } else {
        body.append('Option', 'SearchCandidatesViewed');
      }

    } else if (this.flags == "search") {
      if (this.likes) {
        body.append('Option', 'mylikes');
      } else {
        body.append('Option', 'SearchCandidatesViewed');
      }
    } else {
      body.append('Option', 'SearchCandidatesViewed');
    }
    body.append('ItemPerPage', '25');
    body.append('PageNo', '' + this.page);
    body.append('Employer_ID', this.EMP_ID);
    body.append('RoleID', this.selectedRollID);
    body.append('City', this.optionTitle1);
    this.service.getCandidates('candidate.php', body).subscribe((data: any) => {
        if (data.status == "success") {
          //Lets put last seen label based on regDate == lastUpdate.
          this.items1 = data.candidates;
          this.items1.filter(object => object.ID == object.ID).map((res: any) => {
            res.Education = res.Education.toString().trim().split(" ", 1);
            if (res.Reg_Date) {
              let last = res.Last_Update.split(' ');
              let reg = res.Reg_Date.split(' ');
              (last[0] == reg[0])?  res['MyLabel'] = 'Reg On': res['MyLabel'] = 'Last Seen';
            } else {
              res['MyLabel'] = 'Last Seen';
            }
          });
          this.balance_contact = data.balance_contact;
          this.Contact = data.view_contact;
          this.Total_Contact = data.total_contact;
          if (this.items.length > 0) {
            for (let i = 0; i < this.items1.length; i++) {
              this.items.push(this.items1[i]);
            }
          } else {
            this.items = this.items1;
          }
        }
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  myLikesDislikes(event, userData, status, index) {
    this.play();
    this.widget.showLoading('').then();
    this.items[index].status = status;
    event.stopPropagation();
    let body = new FormData();
    body.append('Option', 'myLikesDislikes');
    body.append('User_ID', userData.ID);
    body.append('Employer_ID', this.EMP_ID);
    body.append('status', status);

    // console.log(headers);
    this.service.getCandidates('candidate.php', body).subscribe(data => {
        this.likeDetails = data;
        if (this.likeDetails.status == "success") {
          this.items[index].status = status;
          this.user_id = userData.ID;
        }
        this.widget.hideLoading().then();
      },
      err => {
        this.widget.hideLoading().then();
        console.log("ERROR!: ", err);
      }
    );
  }

  parsCurrency(value): number {
    return parseInt(value);
  }

  doRefresh(event) {
    this.items = '';
    this.page = 0;
    this.getCandidates();
    setTimeout(() => {
      event.complete();
    }, 2000);
  }

  checkDate(lastUpdate, regDate): boolean {
    let last = lastUpdate.split(' ');
    let reg = regDate.split(' ');
    return last[0] == reg[0];
  }

  ScrollToTop() {
    this.content.scrollToTop(1500).then(res => {
      this.hideScroll = true;
    });
  }

}
