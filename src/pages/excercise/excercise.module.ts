import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExcercisePage } from './excercise';

@NgModule({
  declarations: [
    ExcercisePage,
  ],
  imports: [
    IonicPageModule.forChild(ExcercisePage),
  ],
})
export class ExcercisePageModule {}
