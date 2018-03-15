import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { ExerciseProvider } from '../providers/exercise/exercise';
import { MotivationProvider } from '../providers/motivation/motivation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storage: Storage,
    private exerciseProvider: ExerciseProvider,
    private motivationProvider: MotivationProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.checkForExerciseUpdates();
      this.checkForMotivationUpdates();
    });
  }

  checkForExerciseUpdates() {
    this.storage.get('exercises').then((localExercises) => {
      this.exerciseProvider.getCategoriesFromWordpress()
      .subscribe(result => {
        console.log(result);
        const categories = result;

        this.exerciseProvider.getExercisesFromWordpress()
        .subscribe(result => {
          const exercises = result;

          if (localExercises === null || JSON.stringify(localExercises['exercises']) != JSON.stringify(exercises) || JSON.stringify(localExercises['categories']) != JSON.stringify(categories)) {
            console.log('updated exercise data in storage');
            this.storage.set('exercises', {
              "exercises" : exercises,
              "categories" : categories,
              "evaluations" : []
            });
          } else {
            console.log('no new data from rest');
          }
        },
        err => {
          console.log(err);
        });
      },
      err => {
        console.log(err);
      });
    });
  }

  checkForMotivationUpdates() {
    this.storage.get('motivations').then((localMotivations) => {
      this.motivationProvider.getMotivationsFromWordpress()
      .subscribe(result => {
        console.log('motivations: ' + result);
        const motivations = result;

        if (localMotivations === null || JSON.stringify(localMotivations['motivations']) != JSON.stringify(motivations)) {
          console.log('updated motivations in local storage');
          this.storage.set('motivations', {
            'motivations': motivations
          });
        } else {
          console.log('motivations up do date')
        }
        },
        error => {
          console.log(error);
        });
    },
  error => {
    console.log(error);
  });
  }
}
