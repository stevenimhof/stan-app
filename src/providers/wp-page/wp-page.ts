import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Config } from '../../app/app.config';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class WpPageProvider {
  wpPages;


  constructor(private http: HttpClient,
    private config: Config,
    private storage: Storage,
    private events: Events) {
  }

  public getPages() {
    return this.wpPages;
  }

  public getInfoPage() {
    return this.getPageByID(this.config.WP_INFO_PAGE_ID);
  }

  public getAboutPage() {
    return this.getPageByID(this.config.WP_ABOUT_PAGE_ID);
  }

  /**
 * Checks for updates by comparing data from server and from local storage
 * If there is a new version on the server, it will be saved in the local storage.
 * In addition, it emits an event that the data is now available via the storage.
 */
  public checkForUpdates() {
    this.getPageStorage().then(localPages => {
      this.wpPages = localPages ? localPages : [];
      this.getPagesFromWordpress()
        .timeout(this.config.REST_TIMEOUT_DURATION)
        .subscribe(pagesFromRest => {
          if (!this.comparePages(localPages, pagesFromRest)) {
            this.wpPages = pagesFromRest;
            this.emitPagesDidChange();
            this.savePages(pagesFromRest);
          }
        }, error => { });
    });
  }

  private getPageByID(ID)  {
    const page = this.wpPages.filter(page => {
      return page.id === ID;
    });
    return page.length ? page[0] : null;
  }

  private emitPagesDidChange() {
    this.events.publish('wpPages:change', null, null);
  }

  private getPagesFromWordpress() {
    return this.http.get(this.config.WP_API_URL + '/wp/v2/pages?' + this.config.WP_MAX_POSTS)
      .map(result => {
        return result;
      })
      .catch(error => Observable.throw("Error while trying to get data from server"));
  }

  private savePages(pages) {
    return this.getPageStorage().then(() => {
      return this.storage.set('wp_pages', pages);
    });
  }

  private comparePages(localPages, pagesFromRest) {
    return JSON.stringify(localPages) == JSON.stringify(pagesFromRest)
  }

  private getPageStorage() {
    return this.storage.ready().then(() => {
      return this.storage.get('wp_pages')
    });
  }

}
