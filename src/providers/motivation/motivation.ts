import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app/app.config';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class MotivationProvider {
  motivationStorageModel = {
    'motivations': null,
    'settings': {
      'date': null,
      'lastMotivationID': null
    }
  }

  constructor(public http: HttpClient,
    private config: Config,
    private storage: Storage,
    private events: Events) {
  }

  // only for testing purposes
  public changeMotivation() {
    this.getMotivationStorage().then(result => {
      result.settings.date = new Date(0).toJSON().slice(0, 10).replace(/-/g, '/');
      this.storage.set('motivations', result);
    });
  }

  public getMotivationsFromWordpress() {
    return this.http.get(this.config.WP_API_URL + '/wp/v2/motivation?' + this.config.WP_MAX_POSTS)
      .map(result => {
        return result;
      })
      .catch(error => Observable.throw("Error while trying to get motivations-data from server"));
  }

  public getDailyMotivation() {    
    return this.getMotivationStorage().then(localMotivations => {
      
      const possibleDailyMotivations = this.getPossibleDailyMotivations(localMotivations);
      const dailyMotivation = this.getRandomMotivation(possibleDailyMotivations);

      this.saveMotivations({
        ...localMotivations,
        "settings": {
          "date": this.getCurrentDate(),
          "lastMotivationID": dailyMotivation.id
        }
      });
      return dailyMotivation;
    });
  }

  /**
   * Checks for updates by comparing data from server and from local storage
   * If there is a new version on the server, it will be saved in the local storage.
   * In addition, it emits an event that the data is now available via the storage.
   */
  public checkForUpdates() {
    this.getMotivationStorage().then((localMotivations) => {
      this.getMotivationsFromWordpress().subscribe(motivations => {
        if (!this.compareMotivations(localMotivations, motivations)) {
          const tempMotivations = {
            ...localMotivations,
            "motivations": motivations
          };
          this.saveMotivations(tempMotivations).then(() => {
            this.emitMotivationsDidLoad();
          });
        } else {
          this.emitMotivationsDidLoad();
        }
      });
    });
  }

  /**
   * Returns a possible daily motivations
   * 
   * Takes into account the last daiy motivation, if exists, and returns a random
   * motivation which cannot be the same in a row.
   */
  private getPossibleDailyMotivations(localMotivations) {
    let possibleDailyMotivations = localMotivations.motivations;
    const lastDailyMotivationID = this.getLastDailyMotivationID(localMotivations);

    if (this.hasLastDailyMotivation(localMotivations)) {
      if (this.getLastDailyMotivationDate(localMotivations) === this.getCurrentDate()) {
        possibleDailyMotivations = this.getMotivationByID(localMotivations, lastDailyMotivationID);
      } else {
        possibleDailyMotivations = this.getMotivationsFilteredByID(localMotivations, lastDailyMotivationID);
      }
    }
    return possibleDailyMotivations;
  }

  private getMotivationByID(localMotivations, lastDailyMotivationID) {
    return localMotivations.motivations.filter((motivation) => {
      return motivation.id === lastDailyMotivationID;
    });
  }

  private getMotivationsFilteredByID(localMotivations, lastDailyMotivationID) {
    return localMotivations.motivations.filter((motivation) => {
      return motivation.id !== lastDailyMotivationID;
    });
  };

  private emitMotivationsDidLoad() {
    this.events.publish('motivations:loaded', null, null);
  }

  private getRandomMotivation(motivations) {
    const index = Math.floor(Math.random() * motivations.length);
    return motivations[index];
  }

  private getCurrentDate() {
    return new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  }

  private hasLastDailyMotivation(motivations) {
    return motivations.settings.lastMotivationID ? true : false;
  }

  private getLastDailyMotivationID(motivations) {
    return motivations.settings.lastMotivationID;
  }

  private getLastDailyMotivationDate(motivations) {
    return motivations.settings.date;
  }

  private compareMotivations(localMotivations, motivationsFromRest) {
    return localMotivations && JSON.stringify(localMotivations['motivations']) == JSON.stringify(motivationsFromRest);
  }

  private saveMotivations(motivations) {
    const tempMotivations = {
      ...this.motivationStorageModel,
      ...motivations
    };
    return this.getMotivationStorage().then(() => {
      return this.storage.set('motivations', tempMotivations);
    });
  }

  private getMotivationStorage() {
    return this.storage.ready().then(() => {
      return this.storage.get('motivations')
    });
  }
}
