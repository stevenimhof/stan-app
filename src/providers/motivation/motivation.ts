import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app/app.config';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class MotivationProvider {
  dailyMotivation;
  motivations;
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
    private events: Events) { }

  // only for testing purposes
  public changeMotivation() {
    this.getMotivationStorage().then(result => {
      result.settings.date = new Date(0).toJSON().slice(0, 10).replace(/-/g, '/');
      this.storage.set('motivations', result);
    });
  }

  public getDailyMotivation() {
    return this.dailyMotivation;
  }

  /**
   * Checks for updates by comparing data from server and from local storage
   * If there is a new version on the server, it will be saved in the local storage.
   * In addition, it emits an event that the data is now available via the storage.
   */
  public checkForUpdates() {
    this.getMotivationStorage().then(localMotivations => {
      this.motivations = localMotivations;
      if (localMotivations) {
        this.setDailyMotivation(localMotivations['motivations']);
      }
      this.getMotivationsFromWordpress()
        .timeout(this.config.REST_TIMEOUT_DURATION)
        .subscribe(motivations => {
          if (!this.compareMotivations(localMotivations, motivations)) {
            const tempMotivations = {
              ...localMotivations,
              "motivations": motivations
            };
            this.motivations = tempMotivations;
            this.saveMotivations(tempMotivations);

            // if there were no local motivations, we want to set a new daily motivation
            // from the rest data
            if (!localMotivations) {
              this.setDailyMotivation(motivations);
            }
          }
        });
    });
  }

  private getMotivationsFromWordpress() {
    return this.http.get(this.config.WP_API_URL + '/wp/v2/motivation?' + this.config.WP_MAX_POSTS)
      .map(result => {
        return result;
      })
      .catch(error => Observable.throw("Error while trying to get motivations-data from server"));
  }

  private setDailyMotivation(motivations) {
    const possibleDailyMotivations = this.getPossibleDailyMotivations(motivations);
    const dailyMotivation = this.getRandomMotivation(possibleDailyMotivations);

    this.dailyMotivation = dailyMotivation;
    this.emitMotivationsDidChange();
    this.saveMotivations({
      "motivations": motivations,
      "settings": {
        "date": this.getCurrentDate(),
        "lastMotivationID": dailyMotivation.id
      }
    });
  }

  /**
   * Returns a possible daily motivations
   * 
   * Takes into account the last daiy motivation, if exists, and returns a random
   * motivation which cannot be the same in a row.
   */
  private getPossibleDailyMotivations(motivations) {
    let possibleDailyMotivations = motivations;

    if (this.isLastDailyMotivationAvailable()) {
      const lastDailyMotivationID = this.getLastDailyMotivationID();
      if (this.getLastDailyMotivationDate() === this.getCurrentDate()) {
        possibleDailyMotivations = this.getMotivationByID(motivations, lastDailyMotivationID);
      } else {
        possibleDailyMotivations = this.getMotivationsFilteredByID(motivations, lastDailyMotivationID);
      }
    }
    return possibleDailyMotivations;
  }

  private getMotivationByID(motivations, lastDailyMotivationID) {
    return motivations.filter(motivation => {
      return motivation.id === lastDailyMotivationID;
    });
  }

  private getMotivationsFilteredByID(motivations, lastDailyMotivationID) {
    return motivations.filter(motivation => {
      return motivation.id !== lastDailyMotivationID;
    });
  };

  private emitMotivationsDidChange() {
    this.events.publish('motivations:change', null, null);
  }

  private getRandomMotivation(motivations) {
    const index = Math.floor(Math.random() * motivations.length);
    return motivations[index];
  }

  private getCurrentDate() {
    return new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  }

  private isLastDailyMotivationAvailable() {
    const isAvailable = this.motivations.motivations.filter(motivation => {
      return motivation.id === this.getLastDailyMotivationID();
    });

    if (isAvailable) {
      return true;
    }
    return false;
  }

  private hasLastDailyMotivation() {
    if (this.motivations && this.motivations.hasOwnProperty('settings')
      && this.motivations.settings.hasOwnProperty('lastMotivationID')) {
      return true;
    }
    return false;
  }

  private getLastDailyMotivationID() {
    if (this.hasLastDailyMotivation()) {
      return this.motivations.settings.lastMotivationID;
    }
    return null;
  }

  private getLastDailyMotivationDate() {
    if (this.hasLastDailyMotivation()) {
      return this.motivations.settings.date;
    }
    return null;
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
