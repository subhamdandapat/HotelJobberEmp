import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BroadcastPage } from './broadcast';
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    BroadcastPage,
  ],
  imports: [
    IonicPageModule.forChild(BroadcastPage),
    MomentModule,
  ],
})
export class BroadcastPageModule {}
