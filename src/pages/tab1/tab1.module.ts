import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Tab1Page } from './tab1';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [
    Tab1Page,
  ],
  imports: [
    IonicPageModule.forChild(Tab1Page), AutoCompleteModule,
    SelectSearchableModule, MomentModule
  ],
})
export class Tab1PageModule {}
