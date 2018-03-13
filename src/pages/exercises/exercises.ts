import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
  exercises;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private exerciseProvider: ExerciseProvider,
    private alertCtrl: AlertController) {

    if (!this.categories.length || !this.exercises.length) {
      this.getData();
    }
  }

  deleteStorage() {
    this.exerciseProvider.deleteExercises();
  }

  getData() {
    this.exerciseProvider.getCategories()
    .then(result => {
      this.categories = result;

      this.exerciseProvider.getExercises()
      .then(result => {
        this.exercises = result;
        this.prepareData();

        if (!this.categories.length || !this.exercises.length) {
          this.showErrorAlert();
        }
      });

    });
  }

  showErrorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Keine Daten vorhanden',
      subTitle: 'Bitte überprüfe deine Internet-Verbidung',
      buttons: ['Dismiss']
    });
    alert.present();
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
