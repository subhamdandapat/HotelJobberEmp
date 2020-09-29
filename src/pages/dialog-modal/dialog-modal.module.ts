import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DialogModalPage } from './dialog-modal';

@NgModule({
  declarations: [
    DialogModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DialogModalPage),
  ],
})
export class DialogModalPageModule {}
