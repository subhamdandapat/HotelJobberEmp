import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShortlistedPage } from './shortlisted';
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    ShortlistedPage,
  ],
  imports: [
    IonicPageModule.forChild(ShortlistedPage),
    MomentModule,
  ],
})
export class ShortlistedPageModule {}
