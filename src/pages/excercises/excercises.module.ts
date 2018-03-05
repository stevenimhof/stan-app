import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExcercisesPage } from './excercises';

@NgModule({
  declarations: [
    ExcercisesPage,
  ],
  imports: [
    IonicPageModule.forChild(ExcercisesPage),
  ],
})
export class ExcercisesPageModule {}
