import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BroadcastPaymentPage } from './broadcast-payment';

@NgModule({
  declarations: [
    BroadcastPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(BroadcastPaymentPage),
  ],
})
export class BroadcastPaymentPageModule {}
