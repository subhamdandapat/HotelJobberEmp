import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeregistrationPage } from './employeeregistration';
import { SelectSearchableModule } from 'ionic-select-searchable';
@NgModule({
  declarations: [
    EmployeeregistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeregistrationPage),SelectSearchableModule
  ],
})
export class EmployeeregistrationPageModule {}
