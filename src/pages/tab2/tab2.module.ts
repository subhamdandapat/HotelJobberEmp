import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tab2Page } from './tab2';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { MomentModule } from "angular2-moment";
@NgModule({
  declarations: [
    Tab2Page,
  ],
  imports: [
    IonicPageModule.forChild(Tab2Page), AutoCompleteModule,
    SelectSearchableModule, MomentModule
  ],
})
export class Tab2PageModule {}
