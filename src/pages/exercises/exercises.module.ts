import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExercisesPage } from './exercises';

@NgModule({
  declarations: [
    ExercisesPage,
  ],
  imports: [
    IonicPageModule.forChild(ExercisesPage),
  ],
})
export class ExercisesPageModule {}
