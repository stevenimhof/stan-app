import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ExerciseProvider } from '../../providers/exercise/exercise';
import { NotificationProvider } from '../../providers/notification/notification';

import { AboutPage } from "../about/about";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  categories = [];
  notifications = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private exerciseProvider: ExerciseProvider,
    private notificationProvider: NotificationProvider,
    private events: Events) {

      this.listenForNotificationSettingsDidChange();
      if (!this.categories.length || !this.notifications.length) {
        this.getData();
      }
  }

  public getData() {
    this.setCategories();
    this.setNotifications();
    this.prepareNotifications();
  }

  /**
   * Prepare the notification list based on the data from the exercise categories
   */
  public prepareNotifications() {
    if (!this.categories.length) return;

    // do we have any notifications? if that's not the case we need to
    // create a list from the exercise categories
    if (!this.notifications.length) {
      this.copyAllNotificationsFromCategories();
      this.notificationProvider.saveSettings(this.notifications);
    } else {
      // do we have the same numer of exercise categories and items in notification settings?
      // if that's not the case we need to update our list
      if (this.categories.length !== this.notifications.length) {
        this.updateSettings();
        this.notificationProvider.saveSettings(this.notifications);
      }
    }
    return this.notifications;
  }

  public onChange() {
    this.notificationProvider.saveSettings(this.notifications);
  }

  public loadAbout() {
    this.navCtrl.push(AboutPage);
  }

  private setCategories() {
    this.categories = this.exerciseProvider.getCategories();
  }

  private setNotifications() {
    this.notifications = this.notificationProvider.getSettings();
  }

  private listenForNotificationSettingsDidChange() {
    this.events.subscribe('notificationSettings:change', () => {
      this.getData();
    });
  }

  /**
   * Update the list of notification settings
   * 
   * Take the current notification settings and add any new items
   * from the exercise category list. Don't change the 'isActive' property 
   * of the current notification settings
   */
  private updateSettings() {
    const temp: any = this.notifications;
    this.copyAllNotificationsFromCategories();
    this.notifications.forEach( item => {
      const found = temp.find( el => el.id === item.id );
      if (found) {
        item.isActive = found.isActive;
      }
    });
  }

  private copyAllNotificationsFromCategories() {
    this.notifications = [];
    this.categories.forEach(cat => {
      this.notifications.push({ id: cat.id, name: cat.name, isActive: true });
    });
  }

}
