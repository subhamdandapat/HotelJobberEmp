import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageModalPage } from './message-modal';

@NgModule({
  declarations: [
    MessageModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageModalPage),
  ],
})
export class MessageModalPageModule {}
