import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeout';
import { Config } from '../../app/app.config';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class TheoryProvider {
  theories;

  constructor(private http: HttpClient,
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
    this.getTheoriesStorage().then(localTheories => {
      this.theories = localTheories ? localTheories['theories'] : [];
      this.getTheoriesFromWordpress()
        .timeout(this.config.REST_TIMEOUT_DURATION)
        .subscribe(unsortedTheories => {
          const theories = unsortedTheories.sort(this.compareTheoriesByOrder);
          if (!this.compareTheories(localTheories, theories)) {
            this.saveTheories(theories);
          }
        }, error => { });
    });
  }

  public getTheories() {
    return this.theories;
  }

  public getTheoriesFromWordpress() {
    return this.http.get(this.config.WP_API_URL + '/wp/v2/theory?' + this.config.WP_MAX_POSTS)
      .map(result => {
        return result;
      })
      .catch(error => Observable.throw("Error while trying to get theory-data from server"));
  }

  private saveTheories(theories) {
    this.storage.set('theories', {
      "theories": theories
    }).then(() => {
      this.theories = theories;
      this.emitTheoriesDidLoad();
    });
  }

  private compareTheories(localTheories, theoriesFromRest) {
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

  private compareTheoriesByOrder(a, b) {
    if (parseInt(a.menu_order) < parseInt(b.menu_order)) return -1;
    if (parseInt(a.menu_order) > parseInt(b.menu_order)) return 1;
    return 0;
  }

}
