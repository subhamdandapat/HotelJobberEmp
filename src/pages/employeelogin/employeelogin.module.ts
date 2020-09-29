import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeloginPage } from './employeelogin';
//import { CommonHeaderPage } from '../../pages/common-header/common-header';
@NgModule({
  declarations: [
    EmployeeloginPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeloginPage),
  ],
})
export class EmployeeloginPageModule {}
