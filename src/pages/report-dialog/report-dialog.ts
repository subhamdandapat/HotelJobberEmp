import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { OrganizationProvider } from '../../providers/organization/organization';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BroadcastProvider} from "../../providers/broadcast/broadcast";

@IonicPage()
@Component({
  selector: 'page-report-dialog',
  templateUrl: 'report-dialog.html',
})
export class ReportDialogPage {
  EMP_ID: any;
  reportResponse: any;
  itemsReport: any;
  cand_details: any;
  reportDtata: any;
  item: any;
  minSalary: number = 0;
  maxSalary: number = 0;
  salaryList: number[] = [];
  maxSalaryList: number[] = [];
  broadMessage: any;
  broadcast_form: FormGroup;
  canApply: boolean = false;
  reportPage: boolean = false;
  broadcast: boolean = false;
  org_ID: string;
  moreInfo: boolean = false;
  planList: any;
  constructor(public navCtrl: NavController, public service: ServiceProvider, public org_service: OrganizationProvider, private platform: Platform,
    public navParams: NavParams, public viewCtrl: ViewController,private localStorage: StorageProvider,
              private widget: WidgetProvider, public formBuilder: FormBuilder, private broadPlanProvider: BroadcastProvider) {

    this.broadcast_form = formBuilder.group({
      mobile: ['', [Validators.required, Validators.maxLength(16),Validators.minLength(6), Validators.pattern('[0-9]*')]],
    });
    this.cand_details = this.navParams.get("cand_details");
    this.getOptions();
    this.fetchSP();
    this.editBroad();
  }

  ionViewWillLoad(): void {
    console.log('ionViewWillLoad');
    this.platform.registerBackButtonAction(() => {
      this.closeBroadcast();
    });
  }

  editBroad(): void {
    console.log('edit broadcast working::');
    if (this.navParams.get('broadcast') == 'broadcast') {
      this.broadcast = true;
      this.broadMessage = this.navParams.get('jobInfo');
      this.broadcast_form.get('mobile').setValue(this.broadMessage.contact);
      this.basicSalary();
    } else if(this.navParams.get('broadcast') == 'candidateApply') {
      this.canApply = true;
    } else if (this.navParams.get('broadcast') == 'report') {
      this.reportPage = true;
    } else if (this.navParams.get('broadcast') == 'remove_Org') {
      this.org_ID = this.navParams.get('org_ID');
    } else if (this.navParams.get('broadcast') == 'more-info') {
      this.getPlanList();
      this.moreInfo = true;
    }
  }

  // This will give you all plan and details
  getPlanList(): void {
    // This will get available plans for purchase
    this.broadPlanProvider.getBroadcastPlanList('plans.php?option=broadcast_plans').subscribe((res:any) => {
      if (res.status == 'success') {
        /* res.plans.filter(plan => true).map(plan => {  plan['iconName'] = 'remove-circle'});*/
        this.planList = res.plans[0];
        console.log('---------',  this.planList);
      }
    });
  }

  bindContact(): void {
    this.broadMessage.contact = this.broadcast_form.get('mobile').value;
  }

  basicSalary(): void {
    let sal = 5000;
    for (let i=0; i<50; i++) {
      this.salaryList.push(sal);
      sal = sal+2000;
    }
  }

  updateSalaryList(minSalary): void {
    this.broadMessage.minSal = minSalary;
    // Check maximum salary according to minimum
    if (parseInt(minSalary) > parseInt(this.broadMessage.maxSal)) {
      this.broadMessage.maxSal = parseInt(minSalary) + 2000;
    }
    this.maxSalaryList = [];
    let sal = parseInt(minSalary) + 2000;
    for (let i = 0; i < 5; i++) {
      this.maxSalaryList.push(sal);
      sal = sal + 2000;
    }
  }

  updateMaxSalary(maxSalary) : void {
    this.broadMessage.maxSal = maxSalary;
  }

  saveBroadcast(): void {
    this.viewCtrl.dismiss({updatedInfo:this.broadMessage}).then();
  }

  closeBroadcast(): void {
    this.viewCtrl.dismiss({updateInfo:undefined}).then();
  }

  ionViewDidLoad() {}

  closeReport(): void {
    this.viewCtrl.dismiss().then();
  }

  getOptions() {
    this.service.getDashOptions("assets/data/report-option.json").subscribe((response: any) => {
      this.itemsReport = response.data;
    });
  }

  fetchSP() {
    this.localStorage.getStorage('employeer_details').then((val: any) => {
      this.EMP_ID =  JSON.parse(val).ID;
    });
  }

  reportUser() {
    this.widget.showLoading('').then();
    let body = new FormData();
    body.append('option', 'ReportUser');
    body.append('Employer_ID', this.EMP_ID );
    body.append('user_id', this.cand_details);
    body.append('report_message', this.reportDtata);

    this.org_service.createOrganization('common-operations.php', body).subscribe(
      (data: any) => {
        this.reportResponse = data;
        this.widget.presentToast(this.reportResponse.message).then();
        this.widget.hideLoading().then();
        this.viewCtrl.dismiss(data.status).then();
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
      }
    );
  }

  removeOrg(): void {
    this.widget.showLoading('Please wait...').then();
    let body = new FormData();
    body.append('option', 'delete_org');
    body.append('Employer_ID',  this.EMP_ID);
    body.append('Org_ID', this.org_ID);

    this.org_service.createOrganization('organisation.php', body).subscribe((data: any) => {
        if (data.status=="success") {
          this.widget.presentToast("Organisation deleted successfully").then();
          this.viewCtrl.dismiss(data.status).then();
        }
        this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
      });
  }

  playStore(): void {
    window.open("https://play.google.com/store/apps/details?id=com.hoteljobber.candidate", '_system', 'location=yes');
  }

}
