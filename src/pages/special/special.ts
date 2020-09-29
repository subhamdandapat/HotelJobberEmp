import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { JobProvider } from '../../providers/job/job';
import { OrganizationProvider } from '../../providers/organization/organization';
import { Platform } from 'ionic-angular';
import { SelectSearchable } from 'ionic-select-searchable';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";


@IonicPage()
@Component({
  selector: 'page-special',
  templateUrl: 'special.html',
})
export class SpecialPage {
  salList: any[]=[];
  min_sal: number;
  max_sal: any;
  max_sal_List: any[]=[];
  label_array: String[] = [];
  Max_Sal_label: string;
  Min_Sal_label: string;

  tag: any;
  itemsRollList: any;
  roleListData: any;
  selectedRollID: string;
  job_title: string;
  job_type: number = 1;
  looking_for: any;
  max_salary: any;
  min_salary: any;
  job_desc: string;
  SpData: any;
  roll_name: any = "";
  organizationDetails: any;
  org_ID: any;
  roleList: any;
  visible: boolean;
  min_exp: any;
  vacuncy: any;
  vacuncyList: any[] = [];
  expList: any[] = [];
  salaryList: any[] = [];
  looking_for1: any = "";
  titleLookingFor: String = "Select Role";
  titleMinSal: String = "Minimum Salary";
  titleMaxSal: String = "Maximum Salary";
  titleMinExp: String = "Minimum Experience";
  titleVacuncy: String = "Vacancy";
  postjob_form: FormGroup;
  maxSalaryList:any[] = [];
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams,
    public org_service: OrganizationProvider, public platform: Platform, public job_service: JobProvider,
              private localStorage: StorageProvider, private widget: WidgetProvider ) {
    this.postjob_form = formBuilder.group({

      job_title: ['', Validators.required],
      job_type: ['', Validators.required],
      selectedRoll: ['', Validators.required],
      min_salary: ['', Validators.required],
      looking_for1: ['', ''],
      max_salary: ['', Validators.required],
      min_exp: ['', Validators.required],
      vacuncy: ['', Validators.required],
      job_desc: ['', Validators.required]

    });
    this.postjob_form.get('job_type').setValue(1);
    this.org_ID = navParams.get('postJob').org_ID;
    this.tag = navParams.get('tag');

    platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot('OrganizationPage').then();
    });
    this.getOrganisationDetails(this.org_ID);
    //this.getRoles();

    for (let i = 1; i <= 50; i++) {
      this.vacuncyList.push(i);
    }

    for (let i = 0; i <= 30; i++) {
      this.expList.push(i);
    }
   // this.expList.push("Above 10")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpecialPage');
     this.fetchSData();
    this.getAllRoll();
    this.basicSalary();
  }

  fetchSData() {
    this.localStorage.getStorage('employeer_details').then((val: any) => {
      this.SpData = JSON.parse(val);
    });
  }

  basicSalary(): void {
    let sal = 5000;
    for (let i=0; i<50; i++) {
      this.salaryList.push(sal);
      sal = sal+2000;
    }
  }

  updateSalaryList(minSalary): void {
    //this.minSalEmpty = false;
    this.maxSalaryList = [];
    let sal = parseInt(minSalary) + 2000;
    for (let i = 0; i < 5; i++) {
      this.maxSalaryList.push(sal);
      sal = sal + 2000;
    }
  }

  getOrganisationDetails(Org_ID) {
    let body = new FormData();
    body.append('option', 'get_org');
    body.append('Org_ID', Org_ID);
    this.org_service.getOrganisationDetails('organisation.php', body).subscribe(
      (data: any) => {
        if (data.status == "failed") {
          this.widget.presentToast(data.message).then();
        } else {
          this.organizationDetails = data.organisation;
        }
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }


  getAllRoll() {
    let body = new FormData();

    body.append('option', 'AllRoles');
    this.org_service.createOrganization('common-operations.php', body).subscribe(
      data => {
        console.log("Country: ", data);
        this.itemsRollList = data;
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );
  }

  portChangeRoll(event: { component: SelectSearchable, value: any }) {

    //this.flags="search"

    //alert(parentElement.className);
    this.titleLookingFor = "";
    this.selectedRollID = event.value.ID;

    if (this.selectedRollID.trim() == "") {
      this.visible = true;
    } else {
      this.visible = false;
      this.looking_for1 = "";
    }
  }


  // portChangeRoll(event: { component: SelectSearchable, value: any }) {
  //   console.log('Roll ID:', event.value.ID);
  // //  this.looking_for="";

  //   this.looking_for = event.value.ID;


  //   // if (this.looking_for.trim() == "") {
  //   //   this.visible = true;
  //   // } else {
  //   //   this.visible = false;
  //   //   this.looking_for1 = "";
  //   // }
  //   //this.selectedCountry=event.value.Name;

  // }


  postJob() {
    this.widget.showLoading('').then();

    let body = new FormData();
    body.append('option', 'PostJob');
    body.append('Or_ID', this.organizationDetails.ID);
    body.append('Employer_ID', this.organizationDetails.EMP_ID);
    body.append('JobTitle',this.postjob_form.get('job_title').value);
    body.append('Organisation_Name', this.organizationDetails.organisation_name);
    body.append('Organisation_Type', this.organizationDetails.organisation_type);
    body.append('Address', this.organizationDetails.organisation_address);

    body.append('Job_Type', this.postjob_form.get('job_type').value);
    body.append('Role_ID', this.postjob_form.get('selectedRoll').value.ID);
    body.append('New_Roll', this.postjob_form.get('looking_for1').value);

    body.append('Vacancy', this.postjob_form.get('vacuncy').value);
    body.append('MinExp',this.postjob_form.get('min_exp').value);

    body.append('landline', "");
    body.append('MinSalary',this.postjob_form.get('min_salary').value);
    body.append('MaxSalary',this.postjob_form.get('max_salary').value);
    body.append('JD', this.postjob_form.get('job_desc').value);

    // body.append('ContactName', this.organizationDetails.Contact_name);
    body.append('Website', this.organizationDetails.Website);
    body.append('Organisation_branch', this.organizationDetails.organisation_branch);

    body.append('Country', this.organizationDetails.Country);
    body.append('State', this.organizationDetails.State);
    body.append('City', this.organizationDetails.City);
    body.append('Mobile', this.organizationDetails.organisation_phone);
    body.append('Mobile1', this.organizationDetails.organisation_phone1);
    //  body.append('Email_ID',this.organizationDetails.organisation_email);

    this.job_service.postJob('job.php', body).subscribe((data: any) => {

      if (data.status == "success") {
          console.log('data.status post job:-', data);
          this.navCtrl.push('PostJobPayNowPage', {job_id: data.job_id, totalPost: this.navParams.get('postJob').totalJob}).then();
      } else {
          this.widget.presentToast(data.message).then();
      }
      this.widget.hideLoading().then();
      },
      err => {
        console.log("ERROR!: ", err);
        this.widget.hideLoading().then();
      }
    );
  }

  getVacuncy(item_vacuncy, key) {
    this.titleVacuncy = "";
    this.label_array[key] = "none";
    this.vacuncy = item_vacuncy;
  }

  get_exp(item_min_exp, key) {
    this.titleMinExp = "";
    this.label_array[key] = "none";
    this.min_exp = item_min_exp;
  }

  // getmin_salary(selected_min_salary, key) {
  //   this.titleMinSal = "";
  //   this.label_array[key] = "none";
  //   this.min_salary = 0;
  //   this.min_salary = selected_min_salary;
  //   // this.max_salary = parseInt(selected_min_salary) + 5000;
  //   console.log("_salary: ", this.max_salary);



  // }


  // getmax_salary(selected_max_salary, key) {
  //   this.titleMaxSal = "";

  //   this.label_array[key] = "none";
  //   this.max_salary = 0;
  //   this.max_salary = selected_max_salary;
  //   //this.min_salary = parseInt(selected_max_salary) - 5000;
  //   console.log("_salary: ", this.min_salary);
  // }


  get_max_sal(max_salary) {
        //set bmin sal as default
        let min_val = parseInt(this.postjob_form.get("max_salary").value) - 5000;
        this.max_sal = max_salary;
        this.min_sal = min_val;
  }

      get_min_sal(min_salary) {

        this.max_sal_List= [];
        let max_val1 = parseInt(this.postjob_form.get("min_salary").value) + 5000;
        // for (var i = 0; i <= 30; i++) {

        //   this.max_sal_List.push(max_val);
        //   max_val += 5000;

        // }
        for (var i = 0; i <= 30; i++) {

          if (i <= 20) {
            this.max_sal_List.push(max_val1);
            max_val1 += 5000;
          }
          else {
            this.max_sal_List.push(max_val1);
            max_val1 += 25000;
          }

        }

        this.min_sal = min_salary;

      }



  // getSeleceteditem_looking_for(looking_for) {
  //   this.looking_for = looking_for;

  //   if (this.looking_for.trim() == "") {
  //     this.visible = true;
  //   } else {
  //     this.visible = false;
  //     this.looking_for1 = "";
  //   }

  // }

  back(): void {
    this.navCtrl.setRoot('OrganizationPage').then();
  }

}
