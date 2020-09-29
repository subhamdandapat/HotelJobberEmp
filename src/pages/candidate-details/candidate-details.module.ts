import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CandidateDetailsPage } from './candidate-details';
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    CandidateDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CandidateDetailsPage),
    MomentModule,
  ],
})
export class CandidateDetailsPageModule {}
