import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Config} from '../../app/app.config';
import {Storage} from '@ionic/storage';

/*
  Generated class for the MotivationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MotivationProvider {
  dayliMotivation;
  lastUpdated;
  localMotivationPromise;
  motivations = [
    'Bleib Stark',
    'Du schaffst das!',
    'Mach weiter so!',
    'Bald geschafft!'
  ];

  constructor(public http: HttpClient,
              private config: Config,
              private storage: Storage) {
    this.lastUpdated = new Date(0).toJSON().slice(0, 10).replace(/-/g, '/');
    this.dayliMotivation = this.getDayliMotivation();
  }

  getDayliMotivation() {
    var currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    if (currentDate != this.lastUpdated) {
      var newMotivation = '';
      do {
        newMotivation = this.motivations[Math.floor(Math.random() * this.motivations.length)];
      } while (this.dayliMotivation == newMotivation);
    }
    this.lastUpdated = currentDate;
    return newMotivation;
  }

  changeMotivation() {
    this.lastUpdated = new Date(0).toJSON().slice(0, 10).replace(/-/g, '/');
    this.dayliMotivation = this.getDayliMotivation();
  }

  //TODO: implement the rest-call for motivations in app.components.ts
  //Frage: macht es nicht mehr Sinn, den localStorage in den Providers anzulegen, statt im app.components.ts??
  setLocalExercisesPromis() {
    if (!this.localMotivationPromise) {
      this.localMotivationPromise = this.storage.get('exercises');
    }
  }

  getMotivations() {
    this.setLocalExercisesPromis();
    return this.localMotivationPromise.then((localMotivations) => {
      console.log("get motivations from localStorage");
      return (localMotivations && localMotivations['motivations']) ? localMotivations['exercises'] : [];
    });
  }

  getMotivationsFromWordpress() {
    return this.http.get(this.config.wordpressApiUrl + '/wp/v2/motivation')
      .map(result => {
        return result;
      })
      .catch(error => Observable.throw("Error while trying to get motivations-data from server"));
  }
}
