import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
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
    this.dayliMotivation = newMotivation;
    return this.dayliMotivation;
  }
  changeMotivation() {
    this.lastUpdated = new Date(0).toJSON().slice(0, 10).replace(/-/g, '/');
    this.dayliMotivation = this.getDayliMotivation();
    return this.dayliMotivation;
  }
}
