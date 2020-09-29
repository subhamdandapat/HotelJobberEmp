import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BroadcastSentPage } from './broadcast-sent';
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    BroadcastSentPage,
  ],
  imports: [
    IonicPageModule.forChild(BroadcastSentPage),
    MomentModule,
  ],
})
export class BroadcastSentPageModule {}
