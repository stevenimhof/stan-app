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

      this.setCategories();
      this.setNotifications();
      this.prepareNotifications();
  }

  public onChange() {
    this.notificationProvider.saveSettings(this.notifications);
  }

  private setCategories() {
    this.categories = this.exerciseProvider.getCategories();
  }

  private setNotifications() {
    this.notifications = this.notificationProvider.getSettings();
  }

  private getNotificationSettings() {
    this.notifications = this.notificationProvider.getSettings();
  }

  public prepareNotifications() {
    if (!this.categories.length) return;

    if (!this.notifications.length) {
      this.copyAllNotificationsFromCategories();
      return this.notifications;
    } else {
      // check for update
      if (this.categories.length === this.notifications.length) {
        // no updates
        return this.notifications;
      } else {
        //updatecategories
      }
    }
  }

  private copyAllNotificationsFromCategories() {
    this.categories.forEach(cat => {
      this.notifications.push({ id: cat.id, name: cat.name, isActive: true });
    });
  }

  loadAbout() {
    this.navCtrl.push(AboutPage);
  }

}
