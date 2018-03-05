import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TheoriesPage } from './theories';

@NgModule({
  declarations: [
    TheoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(TheoriesPage),
  ],
})
export class TheoriesPageModule {}
