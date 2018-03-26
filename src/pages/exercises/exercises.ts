import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

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
    private events: Events) {
    this.listenForExercisesDidLoad();
  }

  public listenForExercisesDidLoad() {
    this.events.subscribe('exercises:loaded', () => {
      this.getData();
    });
  }

  public deleteStorage() {
    this.exerciseProvider.deleteExercises();
  }

  private getData() {
    this.exerciseProvider.getCategories().then(result => {
      this.categories = result;
      this.exerciseProvider.getExercises().then(result => {
        this.exercises = result;

        this.prepareData();
      });

    });
  }

  public toggleCategory(category) {
    if (this.isCategoryShown(category)) {
      this.shownCategory = null;
    } else {
      this.shownCategory = category;
    }
  }

  public isCategoryShown(category) {
    return this.shownCategory === category;
  }

  public loadExercise(exercise) {
    this.navCtrl.push(ExercisePage, {
      exercise: exercise
    });
  }

  private prepareData() {
    this.categories.forEach(cat => {
      this.exercises.forEach(exercise => {
        if (cat.id == exercise.exercise_category[0]) {
          cat.exercises.push(exercise);
        }
      });
    });
  }
}
