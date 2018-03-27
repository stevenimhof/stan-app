import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../app/app.config';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class TheoryProvider {

  constructor(public http: HttpClient,
    private config: Config,
    private storage: Storage,
    private events: Events) {
  }

  /**
   * Checks for updates by comparing data from server and from local storage
   * If there is a new version on the server, it will be saved in the local storage.
   * In addition, it emits an event that the data is now available via the storage.
   */
  public checkForUpdates() {
    this.getTheoriesStorage().then(localThoeries => {
      this.getTheoriesFromWordpress().subscribe(theories => {
        if (!this.compareExercises(localThoeries, theories)) {
          this.storage.set('theories', {
            "theories": theories
          }).then(() => {
            this.emitTheoriesDidLoad();
          });
        } else {
          this.emitTheoriesDidLoad();
        }
      });
    });
  }

  public getTheories() {
    return this.getTheoriesStorage().then(theory => {
      return (theory && theory['theories']) ? theory['theories'] : [];
    });
  }

  public getTheoriesFromWordpress() {
    return this.http.get(this.config.wordpressApiUrl + '/wp/v2/theory')
      .map(result => {
        return result;
      })
      .catch(error => Observable.throw("Error while trying to get theory-data from server"));
  }

  private compareExercises(localTheories, theoriesFromRest) {
    return localTheories && JSON.stringify(localTheories['theories']) == JSON.stringify(theoriesFromRest);
  }

  private getTheoriesStorage() {
    return this.storage.ready().then(() => {
      return this.storage.get('theories')
    });
  }

  private emitTheoriesDidLoad() {
    this.events.publish('theories:loaded', null, null);
  }

}
