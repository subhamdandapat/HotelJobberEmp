import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CandidateJobDetailsPage } from './candidate-job-details';

@NgModule({
  declarations: [
    CandidateJobDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CandidateJobDetailsPage),
  ],
})
export class CandidateJobDetailsPageModule {}
