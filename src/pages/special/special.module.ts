import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecialPage } from './special';
import {SelectSearchableModule} from "ionic-select-searchable";

@NgModule({
  declarations: [
    SpecialPage,
  ],
  imports: [
    IonicPageModule.forChild(SpecialPage),
    SelectSearchableModule,
  ],
})
export class SpecialPageModule {}
