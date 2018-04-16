import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { ExercisePage } from '../exercise/exercise';
import { ExerciseProvider } from '../../../providers/exercise/exercise';
import { NotificationProvider } from '../../../providers/notification/notification';

@Component({
  selector: 'page-exercises',
  templateUrl: 'exercises.html',
})
export class ExercisesPage {
  shownCategory = null;
  categories = [];
  exercises = [];
  notifications = [];
  haveExercisesLoaded: boolean;
  haveNotificationSettingsLoaded: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private exerciseProvider: ExerciseProvider,
    private notificationProvider:NotificationProvider,
    private events: Events) {
      this.init();
  }

  public init() {
    this.haveExercisesLoaded = false;
    this.haveNotificationSettingsLoaded = false;

    this.listenForExercisesDidLoad();
    this.listenForNotificationSettingsDidChange();
    if (!this.categories.length || !this.exercises.length) {
      this.getData();
    }
  }

  public deleteStorage() {
    this.exerciseProvider.deleteExercises();
  }

  public isCategoryVisible(category) {
    // if we don't have any notification settings we want to show all by default
    if (!this.notifications.length) return true;

    const result = this.notifications.find( item => item.id === category.id );
    return result !== undefined ? result.isActive : false;
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

  private listenForExercisesDidLoad() {
    this.events.subscribe('exercises:loaded', () => {
      this.haveExercisesLoaded = true;
      this.unlistenForExercisesDidLoad();

      if (this.haveExercisesLoaded && this.haveNotificationSettingsLoaded) {
        this.getData();
      }
    });
  }

  private unlistenForExercisesDidLoad() {
    this.events.unsubscribe('exercises:loaded', null);
  }

  private listenForNotificationSettingsDidChange() {
    this.haveNotificationSettingsLoaded = true;
    this.events.subscribe('notificationSettings:change', () => {
      this.notifications = this.notificationProvider.getSettings();
    });
  }

  private getData() {
    this.categories = this.exerciseProvider.getCategories();
    this.exercises = this.exerciseProvider.getExercises();
    this.prepareData();
  }

  private prepareData() {
    this.categories.forEach(cat => {
      this.exercises.forEach(exercise => {
        if (cat.id == exercise.exercise_category[0]) {
          cat.exercises.push(exercise);
        }
      });
      cat.exercises = cat.exercises.sort(this.compareExercisesByTitel);
    });
  }

  private compareExercisesByTitel(a,b) {
    if(a.title.rendered < b.title.rendered) return -1;
    if(a.title.rendered > b.title.rendered) return 1;
    return 0;
  }
}
