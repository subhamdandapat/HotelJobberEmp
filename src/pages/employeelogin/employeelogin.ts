import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { EmployeerProvider } from '../../providers/employeer/employeer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { App, Platform } from 'ionic-angular';
import { StorageProvider } from "../../providers/storage/storage";
import { WidgetProvider } from "../../providers/widget/widget";
import { FCM } from "@ionic-native/fcm";
//import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';


@IonicPage()
@Component({
  selector: 'page-employeelogin',
  templateUrl: 'employeelogin.html',
})
export class EmployeeloginPage {
  device_token: any;
  email: any ;
  password: any ;
  login_form: FormGroup;
  isLoggedIn = false;
users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
  /* private fb: Facebook*/
  constructor(public navCtrl: NavController,public platform: Platform, public formBuilder: FormBuilder, private fcm: FCM,
              private localStorage: StorageProvider, public navParams: NavParams, public emp_service: EmployeerProvider,
              private widget: WidgetProvider,
              //private fb: Facebook
              ) {


 
    // this.localStorageService.clear();
    this.login_form = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    platform.registerBackButtonAction(() => {
      this.navCtrl.pop().then();
    });
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad EmployeeloginPage');
      this.fcm.getToken().then(token => {
        this.device_token = token;
        this.localStorage.setStorage('device_token_HJC', JSON.stringify(token));
      }, error => {
        console.log(error);
      });
  }

  private getBody(): FormData {
    this.localStorage.storage.remove("HJ_login_status").then();
    this.localStorage.storage.remove("employeer_details").then().then();
    let body = new FormData();
    body.append('option', 'login');
    body.append('Mobile_No', this.login_form.get("email").value);
    body.append('Password', this.login_form.get("password").value);
    body.append('Token', 'hotel123');
    body.append('Device_Token', this.device_token);
    return body ;
  }

  loginUser(): void {

      this.widget.showLoading(" ").then();
      this.emp_service.getEmpLogin('member.php', this.getBody()).subscribe(
        (data: any) => {
          if (data.status == 'success') {
            this.localStorage.setStorage('employeer_details', JSON.stringify(data.member));
            this.localStorage.setStorage('HJ_login_status', JSON.stringify(true));
            this.navCtrl.setRoot('MenuPage').then();
            this.widget.hideLoading().then();
          } else {
            this.widget.hideLoading().then();
            this.widget.presentToast(data.message).then();
          }
        },
        err => {
          console.log("ERROR!: ", err);
          this.widget.hideLoading().then();
        }
      );
  }


  getRegister(): void {
    this.widget.showLoading('').then();
    this.navCtrl.push('EmployeeregistrationPage').then( res => this.widget.hideLoading()).then();
  }

  forgetPassword(): void {
    this.navCtrl.push('ForgotPasswordPage').then();
  }


  // fbLogin() {

  //   this.fb.login(['public_profile', 'user_friends', 'email'])
  //     .then(res => {
  //       if (res.status === "connected") {
  //         this.isLoggedIn = true;
  //         // this.getUserDetail(res.authResponse.userID);

  //       } else {
  //         this.isLoggedIn = false;
  //       }
  //     })
  //     .catch(e => console.log('Error logging into Facebook', e));
  // }



  


  // fbLogin() {
  //   this.fb.login(['public_profile',  'email'])
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

  sociallogin(res){
    // let data  = {
    //   Provider_ID:res.id,
    //   Provider:"facebook",
    //   option:"socical-login"
    // }
    let data  = {
      Email_ID:res.email,
      Name:res.name,
      option:"rigistration"
    }
    this.emp_service.socialLogin('member.php',data).subscribe((response:any) =>{
      console.log("social login res =/------->",response)
    },err =>{
      console.log("social error0----->",err)
    })
  }

  //  getUserDetail(userid) {

  //    this.fb.api("/" + userid + "/?fields=id,email,name,picture.type(normal),gender", ["public_profile"])
  //     .then(res => {
  //       console.log("fb response---------->",res);

  //      this.localStorage.setStorage('fb_data', JSON.stringify(res));
  //      this.sociallogin(res)
  //       this.emp_service.callToast(res.picture.data.url);
  //      this.navCtrl.setRoot('MenuPage');
  //       this.users = res;
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

}
