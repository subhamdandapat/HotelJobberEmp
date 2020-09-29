import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppliedCandidatePage } from './applied-candidate';
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    AppliedCandidatePage,
  ],
  imports: [
    IonicPageModule.forChild(AppliedCandidatePage),
    MomentModule,
  ],
})
export class AppliedCandidatePageModule {}
