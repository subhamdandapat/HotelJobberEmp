import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlansPricingPage } from './plans-pricing';

@NgModule({
  declarations: [
    PlansPricingPage,
  ],
  imports: [
    IonicPageModule.forChild(PlansPricingPage),
  ],
})
export class PlansPricingPageModule {}
