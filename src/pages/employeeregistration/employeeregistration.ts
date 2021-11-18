import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EmployeerProvider } from '../../providers/employeer/employeer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform } from 'ionic-angular';
import { SelectSearchable } from 'ionic-select-searchable';
import { OrganizationProvider } from '../../providers/organization/organization';
import { CityProvider } from '../../providers/city/city';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
//import { Facebook } from '@ionic-native/facebook';

@IonicPage()
@Component({
  selector: 'page-employeeregistration',
  templateUrl: 'employeeregistration.html',
})
export class EmployeeregistrationPage {
  device_token: any;
  selectedCountryID: any;
  selectedStateID: any;
  selectedCityID: any;
  emailid: any = '';
  password: any;
  city: any = '';
  name: any = '';
  mobile: any;
  conform_password: any;

  titleCity: any = "Search by City Name";
  itemsCountryList: any;
  itemsStateList: any;
  itemsCityList: any;
  registration_form: FormGroup;
  optionTitle1: any;
  optionId: any;
  array: any[] = [];
  removeLabel: any;
  isLoggedIn: boolean  =false;

  constructor(public navCtrl: NavController, private cityService: CityProvider, public org_service: OrganizationProvider,
              public formBuilder: FormBuilder, public platform: Platform, private localStorage: StorageProvider,
              public navParams: NavParams, public emp_service: EmployeerProvider, private widget: WidgetProvider,
              //private fb: Facebook
              ) {
    this.registration_form = formBuilder.group({
      name: ['', [Validators.required]],
      selectedCity: ['', Validators.required],

      password: ['', [Validators.required, Validators.minLength(6)]],
      emailid: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]],
      mobile: ['', [Validators.required, Validators.maxLength(16),Validators.minLength(6), Validators.pattern('[0-9]*')]],
      conform_password: ['', [Validators.required, Validators.minLength(6)]]
    });

    platform.registerBackButtonAction(() => {
      this.navCtrl.pop().then();
    });
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad EmployeeregistrationPage');
  }

  getBody(): FormData {
    let body = new FormData();
    body.append('option', 'rigistration');
    body.append('Mobile_No', this.registration_form.get("mobile").value);
    body.append('Password', this.registration_form.get("password").value);
    body.append('Email_ID', this.registration_form.get("emailid").value);
    body.append('Name', this.registration_form.get("name").value);
    body.append('CityID', this.optionId);//remaining
    body.append('City', this.optionTitle1);//remaining
    body.append('Token', 'hotel123');
    body.append('Device_Token', this.device_token);
    return body;
  }

  register(): void {
    this.widget.showLoading('Submitting..').then();
    this.localStorage.getStorage('device_token_HJ').then((val: any) => {
      this.device_token = JSON.parse(val);

      if (this.registration_form.get("password").value == this.registration_form.get("conform_password").value) {

        this.emp_service.getEmpLogin('member.php', this.getBody()).subscribe((data: any) => {

            if (data.status == 'success') {
              this.localStorage.setStorage('employeer_details', JSON.stringify(data.member));
              this.localStorage.setStorage('HJ_login_status', JSON.stringify(true));
              this.navCtrl.setRoot('MenuPage').then();
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
      } else {
        this.widget.hideLoading().then();
        this.widget.presentToast("Password does not match").then();
      }
    });

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
    // this.flags = "search"

    let city = event.value;

    this.array = city.optionTitle.split(",");
    this.optionId = event.value.optionId;
    this.optionTitle1 = this.array[0];
    this.removeLabel = event.value;
    this.registration_form.get('selectedCity').setValue(event.value);

  }

 playStore(): void {
  window.open("https://play.google.com/store/apps/details?id=com.hoteljobber.candidate", '_system', 'location=yes');
 }

  goToLogin(): void {
    this.navCtrl.push('EmployeeloginPage').then();
  }


  // fbLogin() {
  //   this.fb.login(['public_profile', 'email'])
  //     .then(res => {

  //       if (res.status === 'connected') {
  //         this.isLoggedIn = true;
  //         this.getUserDetail(res.authResponse.userID);
  //       } else {
  //         this.isLoggedIn = false;
  //       }
  //     })
  //     .catch(e => console.log('Error logging into Facebook', e));
  // }

  

  //  getUserDetail(userid) {

  //    this.fb.api("/" + userid + "/?fields=id,email,name,picture.type(normal),gender", ["public_profile"])
  //     .then(res => {
  //       console.log(res);

  //      this.localStorage.setStorage('fb_data', JSON.stringify(res));

  //       //this.emp_service.callToast(res.picture.data.url);
  //      this.navCtrl.setRoot('MenuPage');
  //       //this.users = res;
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }
}
