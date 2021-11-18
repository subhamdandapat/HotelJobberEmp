import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportantNotePage } from './important-note';

@NgModule({
  declarations: [
    ImportantNotePage,
  ],
  imports: [
    IonicPageModule.forChild(ImportantNotePage),
  ],
})
export class ImportantNotePageModule {}
