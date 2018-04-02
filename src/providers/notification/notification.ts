import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
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
    }).then(() => {
      this.emitSettingsDidChange();
    });
  }

  public emitSettingsDidChange() {
    this.events.publish('notificationSettings:change', null, null);
  }

  public saveSettings(settings) {
    this.settings = settings;
    return this.getSettingsStorage().then( () => {
      return this.storage.set('notificationSettings', settings );
    }).then(() => {
      this.emitSettingsDidChange();
    });
  }

  private getSettingsStorage() {
    return this.storage.ready().then(() => {
      return this.storage.get('notificationSettings')
    });
  }

}
