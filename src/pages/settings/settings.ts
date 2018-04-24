import { Component } from '@angular/core';
import { NavController, NavParams, Events, LoadingController } from 'ionic-angular';
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
  editingDisabledStatus = true;
  spinner = null;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private exerciseProvider: ExerciseProvider,
    private notificationProvider: NotificationProvider,
    private loadingCtrl: LoadingController,
    private events: Events) {
      this.init();
  }

  public init() {
    this.spinner = this.loadingCtrl.create({
      content: 'Bitte warten...'
    });
    this.listenForNotificationSettingsDidLoad();
    //this.listenForNotificationSettingsDidChange();
    this.setData();
  }

  public setData() {
    this.categories = this.exerciseProvider.getCategories();
    this.notifications = this.exerciseProvider.getSettings();
  }

  public onChange() {
    this.exerciseProvider.saveExerciseData();
  }

  public loadAbout() {
    this.navCtrl.push(AboutPage);
  }

  private setNotifications() {
    this.exerciseProvider.prepareNotifications();
    this.notifications = this.exerciseProvider.getSettings();
  }

  private listenForNotificationSettingsDidChange() {
    this.events.subscribe('notificationSettings:change', () => {
      this.setData();
      this.unlistenForNotificationSettingsDidChange();
    });
  }

  private unlistenForNotificationSettingsDidChange() {
    this.events.unsubscribe('notificationSettings:change', null);
  }

  private listenForNotificationSettingsDidLoad() {
    if (this.exerciseProvider.receivedDataFromRest) {
      this.setData();
      this.receivedNotificationSettings();
    } else {
      this.spinner.present();
      this.events.subscribe('notificationSettings:load', () => {
        this.setData();
        this.receivedNotificationSettings();
        this.unlistenForNotificationSettingsDidLoad();
      });
    }
  }

  private unlistenForNotificationSettingsDidLoad() {
    this.events.unsubscribe('notificationSettings:load', null);
  }

  private receivedNotificationSettings() {
    if (this.spinner) {
      this.spinner.dismiss();
    }
    this.setEditingDisabledStatus(false);
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
    this.notifications.forEach(item => {
      const found = temp.find(el => el.id === item.id);
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

  private setEditingDisabledStatus(flag) {
    this.editingDisabledStatus = flag;
  }

  private getEditingDisabledStatus() {
    return this.editingDisabledStatus;
  }

}
