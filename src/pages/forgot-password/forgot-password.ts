import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
//import { Facebook,  } from '@ionic-native/facebook';
import { EmployeerProvider } from '../../providers/employeer/employeer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WidgetProvider } from "../../providers/widget/widget";

declare var SMS:any;
declare var document:any;
@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})

export class ForgotPasswordPage {
  device_token: any;
  isLoggedIn: boolean = false;

  //ga0RGNYHvNM5d0SLGQfpQWAPGJ8=
  //C:\bin
  login_data: any;
  email: any ;
  password: any ;
  login_form: FormGroup;
  otpFlag: boolean;
  uerFlag: boolean=true;
  newFlag: boolean;
  emp_id: any;
  otp ='';
  mobile ='';

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams,
              public emp_service: EmployeerProvider,  private widget: WidgetProvider, public platform:Platform) {

    this.login_form = formBuilder.group({
      emailORmobile: ['', Validators.required],
      otp: ['', ],
      password: ['',[ Validators.minLength(6)]],
      c_password: ['',[ Validators.minLength(6)]]
    });
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad EmployeeloginPage');
  }

  sendOTP() {
      this.widget.showLoading('').then();
      let body = new FormData();
      body.append('option', 'send-otp');
      body.append('emailORmobile', this.login_form.get("emailORmobile").value);
      body.append('Token', 'hotel123');

      this.emp_service.getEmpLogin('member.php', body).subscribe((data: any) => {
          if (data.status == 'success') {
            //save data in Sp
            this.uerFlag = false;
            this.otpFlag = true;
           this.emp_id=data.member.ID;
            this.widget.presentToast(data.message).then();
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

  verify(): void {
      this.widget.showLoading('').then();
      let body = new FormData();
      body.append('option', 'verify-otp');
      body.append('otp', this.login_form.get("otp").value);
      body.append('emp_id',this.emp_id );
      body.append('Token', 'hotel123');
      this.emp_service.getEmpLogin('member.php', body).subscribe((data: any) => {
          if (data.status == 'success') {
            this.otpFlag=false;
            this.uerFlag=false;
            this.newFlag=true;
            this.widget.presentToast(data.message).then();
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

  changePassword(): void {

    if(this.login_form.get("password").value.trim()!="" && this.login_form.get("c_password").value.trim() !=""){
    if(this.login_form.get("password").value==this.login_form.get("c_password").value){

      this.widget.showLoading('').then();
      let body = new FormData();

      body.append('option', 'new-password');
      body.append('new_pass', this.login_form.get("password").value);
      body.append('emp_id',this.emp_id );
      body.append('Token', 'hotel123');

      this.emp_service.getEmpLogin('member.php', body).subscribe((data: any) => {
          if (data.status == 'success') {
            this.widget.presentToast(data.message).then();
            this.widget.hideLoading().then();
            this.navCtrl.pop().then();
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
      } else {
      this.widget.presentToast('Password Mismatch').then();
      }
    } else {
      this.widget.presentToast("Enter Password").then();
    }
  }

}
