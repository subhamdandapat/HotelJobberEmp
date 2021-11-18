import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VirtualscrollPage } from './virtualscroll';

@NgModule({
  declarations: [
    VirtualscrollPage,
  ],
  imports: [
    IonicPageModule.forChild(VirtualscrollPage),
  ],
})
export class VirtualscrollPageModule {}
