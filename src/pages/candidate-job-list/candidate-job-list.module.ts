import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CandidateJobList } from './candidate-job-list';
import {SelectSearchableModule} from "ionic-select-searchable";
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    CandidateJobList,
  ],
  imports: [
    IonicPageModule.forChild(CandidateJobList),
    SelectSearchableModule,
    MomentModule,
  ],
})
export class CandidateJobListModule {}
