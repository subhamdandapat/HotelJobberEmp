import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateOrganizationPage } from './create-organization';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { AutoCompleteModule } from 'ionic2-auto-complete';
//import { SelectSearchable } from 'ionic-select-searchable';
@NgModule({
  declarations: [
    CreateOrganizationPage
  ],
  imports: [
    IonicPageModule.forChild(CreateOrganizationPage),AutoCompleteModule,
    SelectSearchableModule
  ],
})
export class CreateOrganizationPageModule {}
