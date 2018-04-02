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
export class NotificationProvider {
  settings = [];

  constructor(public http: HttpClient,
    private storage: Storage,
    private events: Events) {
  }

  public getSettings() {
    return this.settings;
  }

  public loadSettings() {
    this.getSettingsStorage().then(settings => {
      this.settings = settings ? settings : [];
    });
  }

  public saveSettings(settings) {
    console.log(settings);
    return this.getSettingsStorage().then( () => {
      return this.storage.set('notificationSettings', settings );
    });
  }

  private getSettingsStorage() {
    return this.storage.ready().then(() => {
      return this.storage.get('notificationSettings')
    });
  }

}
