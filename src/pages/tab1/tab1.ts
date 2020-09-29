import { Component, NgZone, ViewChild} from '@angular/core';
import { IonicPage, NavController, Content, ModalOptions, Modal, ItemSliding } from 'ionic-angular';
import { CandidateProvider } from '../../providers/candidate/candidate';
import { CallNumber } from '@ionic-native/call-number';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SelectSearchable } from 'ionic-select-searchable';
import { ModalController } from 'ionic-angular';
import { OrganizationProvider } from '../../providers/organization/organization';
import { CityProvider } from '../../providers/city/city';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import { AutoCompleteComponent } from "ionic2-auto-complete";
import { DatePipe } from "@angular/common";
import { EmployeerProvider } from "../../providers/employeer/employeer";
import { CheckupdateProvider } from "../../providers/checkupdate/checkupdate";
import { SoundProvider } from "../../providers/sound/sound";
import { SafeUrl} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-tab1',
  templateUrl: 'tab1.html',
})

export class Tab1Page {
  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;
  reportedID: any;
  search_flag: boolean = false;
  report_index: any;
  Plan_ID: any;
  //reported_flag:boolean=false;
  report_flag:boolean=true;
  notification_count: number;
  notification_data: any[] = [];
  selectedCountryID: any;
  itemsCountryList: any;
  selectedRollID: any="";
  itemsRollList: any[] = [];
  searchResultsCount: any;
  search_text: string;
  EMP_ID: any;
  flags: any;array: any;
  optionTitle: any;
  searchCityID: any="";
  likeDetails: any;
  user_id: any;
  countsData: any;
  refresh: boolean;
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
  //@ViewChild("refresherRef") refresherRef: Refresher;
  items: any = [];
  items1: any = [];
  selectedCountry: any;
  update_flag:boolean=false;
  page: number = 0;
  titleSearch: String = "Search by Role";
  titleCity: String = "Search by City Name";
  ports: any  []=[];
  hideScroll: boolean = true;
  flagName: string = 'in';
  preLocation: string = null;
  locationFlag: string;
  selectedLocation: string;
  tempNum: number = 1;
  cityObject = {
    "optionId": '',
    "optionTitle": '',
    "stateID": '',
    "countryID": ''
  };
  do_Refresh: boolean = false;
  appCloseOpen: boolean = false;
 wtsURL: string = '';
  finalWtsUrl: any;
  constructor( public alertCtrl: AlertController, private cityService:CityProvider, private checkUpdate: CheckupdateProvider,
               public org_service: OrganizationProvider, private empProvider: EmployeerProvider,
               public navCtrl: NavController, public modalCtrl: ModalController, private datePipe: DatePipe,
               public platform: Platform, private callNumber: CallNumber, private ngZone: NgZone, private soundProvider: SoundProvider,
               private localStorage: StorageProvider, private service: CandidateProvider, private widget: WidgetProvider ) {}

  ngOnInit() {
    this.fetchSP();
  }

  ngAfterViewInit() {
   this.content.ionScrollStart.subscribe((data) => { this.hideScroll = false; });
  }

  ionViewDidLoad(): void {
    setInterval(() => {
      this.countNotification();
    },25000);
    this.widget.showLoading('').then();
    //This will fetch all job roll.
    this.getAllRoll();
    this.checkUpdateAvailable();
  }

  ionViewWillEnter(): void {
    if (this.search_flag == false) {
      this.page = 0;
    }
    this.backButton();
  }

  play(): void {
    this.soundProvider.play('buttonClick')
  }

  backButton(): void {
    this.widget.appClose();
  }

  showNotification(): void {
   this.widget.openNotification();
  }

  //Open whats app with message
  getWtsApp(mobile: number): SafeUrl {
    return this.widget.whatsAppOpen(mobile);
  }

  //Open profile picture
 /* viewPhoto(img): void {
    console.log('ViewPhoto--');
    this.photoViewer.show('https://www.freakyjolly.com/wp-content/uploads/2017/08/cropped-fjlogo2.png');
  }
*/
  candidateDetail(candidate, index) {
    this.items[index].Status = true;
    let info = {showMobile: candidate.ShowMobile, smsSend: candidate.SmsSend, ID: candidate.ID};
    let likeInfo = { allowReport: candidate.AlowReport, likeStatus: candidate.like_status, status:candidate.status};
    console.log('Like information:', likeInfo);
    const modalOptions: ModalOptions = { enableBackdropDismiss: false };
    let candDetail: Modal = this.modalCtrl.create('CandidateDetailsPage',{info:info, likeInfo}, modalOptions);
    candDetail.onDidDismiss((data) => {
        this.ngZone.run(() => {
         this.items[index].ShowMobile = data.showMobile;
         this.items[index].SmsSend = data.smsSend;
         this.items[index].Mobile = data.number;
         if (this.items[index].AlowReport || !this.items[index].AlowReport) {
           this.items[index].AlowReport = data.allowReport;
         } else {
           this.items[index]['AlowReport'] = data.allowReport;
         }
         this.items[index].like_status = data.likeStatus;

        });
        this.backButton();
    });
    candDetail.present().then(res => {});
  }

  fetchSP() {
    // This should be in local provider.
    this.localStorage.fetchSP().then((employeeDetail: any) => {
      this.EMP_ID = JSON.parse(employeeDetail).ID;
      this.Plan_ID = JSON.parse(employeeDetail).Plan;
      this.getDashboardCount(this.EMP_ID);
      this.countNotification();
    });
  }

  countNotification(): void {
    this.empProvider.getEmpNotifications(this.EMP_ID, 0).subscribe((res: any) => {
      if (res.status == 'success' && res.items.length) {
        this.empProvider.getNotificationCount(this.EMP_ID,  res.items[0].id).subscribe((count:any) => {
          this.ngZone.run(() => {
            this.empProvider.totalNotification = (count.total - count.read);
          });
        });
      }
    })
  }
  //showBackdrop: false

  addReport(event,cand_details ,i): void {
    event.stopPropagation();
    let modal = this.modalCtrl.create('ReportDialogPage',{broadcast: 'report', cand_details:cand_details.ID});
    modal.onDidDismiss(data => {
      if (data=="success") {
        this.report_index = i;
        this.reportedID = cand_details.ID;
        //this.reported_flag=true;
        this.items[i].AlowReport = false;
      }
    });
    modal.present().then();
  }

  // This function will handle message sending process it will open message model.
  sendMsg(index): void {
    const jobInfo = {
      candidateName: this.items[index].FirstName,
      minSalary: this.items[index].MinSalary,
      maxSalary: this.items[index].MaxSalary,
      post: this.items[index].Roll,
      city: this.items[index].City,
      candidateID: this.items[index].ID,
      country: this.items[index].Country ,
      index: index
    };
    const modalOptions: ModalOptions = { enableBackdropDismiss: true };
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

  //This will give you user plan and contact details.
  getDashboardCount(ID) {
    let body = new FormData();

    body.append('option', 'DashboardCounts');
    body.append('Employer_ID', ID);
    this.org_service.createOrganization('common-operations.php', body).subscribe(
      (data: any) => {
        this.countsData = data;
        this.balance_contact = data.balance_contact;
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  // This will get all job roll/Job type.
  getAllRoll() {
    let body = new FormData();
    body.append('option', 'AllActiveRoles');
    this.org_service.createOrganization('common-operations.php', body).subscribe(
      (data: any) => {
        this.itemsRollList = data;
        this.getFilter();
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  getStatusColor(status) {
    return 'none';
  }

  onClear(event: { component: SelectSearchable, value: any }) {}

  portChangeRoll(event: { component: SelectSearchable, value: any }) {
    this.titleSearch = "";
    this.flags = "search";
    this.search_flag = true;
    this.selectedRollID = event.value.RoleID;
    //this.selectedCountry=event.value.Name;
    this.localStorage.setStorage('search_roll_index', this.itemsRollList.indexOf(event.value));
    //this.page = 0;
    this.items = [];
    this.getFilter(true);
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
        return port.optionTitle.toLowerCase().indexOf(text) !== -1 ;
      });
      event.component.isSearching = false;
    });
  }

  portSelectCity(event: { component: SelectSearchable, value: any }) {
    this.titleCity = "";
    this.flags = "search";

    let city = event.value;
    this.array = city.optionTitle.split(",");
    this.searchCityID = event.value.optionId;

     this.cityObject = {
       "optionId":city.optionId,
       "optionTitle":city.optionTitle,
       "stateID": city.StateID,
       "countryID": city.CountryID
     };

    this.localStorage.setStorage('search_roll_city',this.cityObject);
    this.items = [];
    this.getFilter(true);
    let splitLocation = this.cityObject.optionTitle.split(',');
    this.selectedLocation = this.cityObject.optionTitle;
    this.preLocation = splitLocation[0];
  }

 getFilter(searchByCity?) {
    this.service.getCandidateList('SearchCandidatesShow',this.EMP_ID, this.page, this.searchCityID, this.selectedRollID).subscribe(
      (data: any) => {
        this.Total_Contact = data.total_contact;
        if (data.status == 'success') {
          // After get data then will update existing according to condition. this.do_Refresh
          if (!this.selectedLocation) {
            this.page = 0;
            this.items = [];
          }
          if (this.do_Refresh) {
            this.items = [];
            this.do_Refresh = false;
          }
          this.candidateLike();
          data.candidates.filter(object => object.ID == object.ID).map((res: any) => {
            res.Education = res.Education.toString().trim().split(" ", 1);
            if (res.Reg_Date) {
              let last = res.Last_Update.split(' ');
              let reg = res.Reg_Date.split(' ');
              (last[0] == reg[0])?  res['MyLabel'] = 'Reg On': res['MyLabel'] = 'Last Seen';
            } else {
              res['MyLabel'] = 'Last Seen';
            }
          });

          if (searchByCity) {

            data.candidates.filter(object => true).map((dataRes: any) => {

              // Slice P_City for get the P and code.
              let splitArray = dataRes.P_City.toString().split(',');

              let firstCS  = splitArray[0].toString().slice(0,1);

              let csCode = dataRes.P_City.toString().slice(1, (dataRes.P_City.length));

              // First condition according to country ready to work all over india.
              if (firstCS == 'p' && csCode == '101') {
                dataRes['Preferred_location'] = this.selectedLocation;
              }
              // This is perfect checking if id match, then prefer city same as selected
              if (parseInt(splitArray[0])) {
                splitArray.filter(obj => obj == this.searchCityID).map((obj:any) => {
                  dataRes['Preferred_location'] = this.selectedLocation;
                });
              }
              // If preferred location is state.
              if (firstCS == 's' && csCode == this.cityObject.stateID) {
                dataRes['Preferred_location'] = this.selectedLocation;
              }
            })
          }
          if (this.items.length > 0) {
            for (let i = 0; i < data.candidates.length; i++) {
              this.items.push( data.candidates[i]);
            }
            this.candidateLike();
          } else {
            this.items = data.candidates;
          }
        }
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.presentToast('Please check internet connection and retry').then();
      }
    );
 }

 candidateLike(): void {
    this.service.getLike('CandEtra', this.EMP_ID, this.page,this.searchCityID, this.selectedRollID).subscribe((res: any) => {
      this.ngZone.run( run => {
        for (let index = 0; index < 50; index++) {
          this.items.filter(object => object.ID == res.candidates[index].ID).map((itemReplace: any) => {
              itemReplace['like_status'] = res.candidates[index].like_status;
              itemReplace['full_name'] = res.candidates[index].LastName;
              if (res.candidates[index].shortList == undefined) {
                itemReplace['shortlist'] == undefined;
              } else {
                itemReplace['shortlist'] = res.candidates[index].shortList;
              }
          });
        }
      });
    });
 }

 goToContactPage() {
    if (this.Plan_ID > 0) {
      this.navCtrl.push('MyContactsPage', {

      }).then();
    } else {
      let modal = this.modalCtrl.create('DialogModalPage',{nav:"dialog",bal: this.balance_contact});
      modal.onDidDismiss(data => {});
      modal.present().then();
    }
  }

  gotoPlans(): void {
    this.navCtrl.setRoot("PlansPricingPage", {}).then();
  }

  // This will auto pop-up the native calling pad.
  callJoint(telephoneNumber): void {
    this.callNumber.callNumber(telephoneNumber, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  displayContact(candidate_id, index) {
    //this.reported_flag=false;
    this.play();
    this.widget.showLoading('').then();

    if (this.Plan_ID > 0) {
      let body = new FormData();
      body.append('Option', 'ViewContacts');
      body.append('User_ID', candidate_id);
      body.append('Employer_ID', this.EMP_ID);

      this.service.getCandidates('candidate.php', body).subscribe(
        (data: any) => {
          this.displatDetails = data;
          if (this.displatDetails.access) {
            this.items[index].AlowReport = true;
            this.flag = true;
            this.items[index].ShowMobile = true;
            this.items[index].Mobile = data.user.Mobile;
            this.balance_contact = data.user.Balance_Contact;
            this.View_Contact = this.displatDetails.user.View_Contact;
          } else {
            this.flag = false;
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
      let modal = this.modalCtrl.create('DialogModalPage',{nav:"tab1Page"});
      modal.onDidDismiss(data => {
      });
      modal.present().then();
    }
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

  getCandidates(): void {
    this.service.getCandidateList('SearchCandidatesShow',this.EMP_ID, this.page, this.searchCityID, this.selectedRollID).subscribe((data: any) => {
        this.items1 = data.candidates;
        if (data.status == 'success') {
          this.items1.filter(object => object.ID == object.ID).map((res: any) => {
            if (res.Reg_Date) {
              let last = res.Last_Update.split(' ');
              let reg = res.Reg_Date.split(' ');
              (last[0] == reg[0])?  res['MyLabel'] = 'Reg On': res['MyLabel'] = 'Last Seen';
            } else {
              res['MyLabel'] = 'Last Seen';
            }
          });
          this.candidateLike();
          for (let i = 0; i < this.items1.length; i++) {
              this.items.push(this.items1[i]);
          }
        }
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  myLikesDislikes(event,userData,status,index) {
    this.play();
    this.widget.showLoading('').then();
    this.items[index].like_status = status;
    let body = new FormData();
    body.append('Option', 'myLikesDislikes');
    body.append('User_ID', userData.ID);
    body.append('Employer_ID', this.EMP_ID);
    body.append('status', status);

    this.service.getCandidates('candidate.php', body).subscribe(data => {
        this.likeDetails = data;
        if (this.likeDetails.status=="success") {
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

  checkUpdateAvailable(): void {

    this.localStorage.getStorage('versionCode').then((version:any) => {
      this.checkUpdate.checkUpdate(this.EMP_ID).subscribe((data:any) => {
        if (parseInt(version) < parseInt(data.Version)) {
          let alert = this.alertCtrl.create({
            title: 'New Version Available',
            message: 'Please update application to experience new feature.',
            buttons: [
              {
                text: 'Later',
                role: 'cancel'
              }
              ,
              {
                text: 'Update',
                role: 'cancel',
                handler: () => {
                  window.open("https://play.google.com/store/apps/details?id=com.hoteljobber.HoteljobberApp", '_system', 'location=no');
                }
              }
            ]
          });
          alert.present().then();
        }
      }, error => {
        console.log('Error', error);
      })
    });
  }

  parsCurrency(value): number {
    return parseInt(value);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    if (this.selectedLocation) {
      this.getFilter(true);
    } else {
      this.getCandidates();
    }
    setTimeout(() => {
      infiniteScroll.complete();
    }, 3000);
  }

  doRefresh(event) {
    this.do_Refresh = true;
    this.hideScroll = true;
    this.page = 0;
    this.getDashboardCount(this.EMP_ID);
    this.getFilter();
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

