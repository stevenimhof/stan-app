import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import {ExercisePage} from '../exercise/exercise';
import {ExerciseProvider} from '../../providers/exercise/exercise';

@IonicPage()
@Component({
  selector: 'page-exercises',
  templateUrl: 'exercises.html',
})
export class ExercisesPage {
  shownCategory = null;
  categories = [];
  exercises = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private exerciseProvider: ExerciseProvider,
    private loadingController: LoadingController) {

    if (!this.categories.length || !this.exercises.length) {
      this.getData();
    }

  }

  getData() {
    let loader = this.loadingController.create({
      content: "Please wait"
    });
    loader.present();

    this.exerciseProvider.getCategories()
    .subscribe(result => {
      this.categories = result;

      this.exerciseProvider.getExercises()
      .subscribe(result => {
        this.exercises = result;

        this.prepareData();
        loader.dismiss();
      });

    });
  }

  prepareData() {
    this.categories.forEach(cat => {
      this.exercises.forEach(exercise => {
        if (cat.id == exercise.exercise_category[0]) {
          cat.exercises.push(exercise);
        }
      });
    });
  }

  toggleCategory(category) {
    if (this.isCategoryShown(category)) {
      this.shownCategory = null;
    } else {
      this.shownCategory = category;
    }
  }

  isCategoryShown(category) {
    return this.shownCategory === category;
  }

  loadExercise(exercise) {
    this.navCtrl.push(ExercisePage, {
      exercise: exercise
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExcercisesPage');
  }

}
