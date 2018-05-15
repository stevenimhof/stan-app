import { Component } from '@angular/core';
import { NavController, Events, LoadingController } from 'ionic-angular';
import { ExerciseProvider } from '../../providers/exercise/exercise';

import { AboutPage } from "../about/about";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  categories = [];
  notifications = [];
  spinner = null;

  constructor(private navCtrl: NavController,
    private exerciseProvider: ExerciseProvider,
    private loadingCtrl: LoadingController,
    private events: Events) {
    this.init();
  }

  public init() {
    if (this.exerciseProvider.canDisplaySpinner) {
      this.spinner = this.loadingCtrl.create({
        content: 'Bitte warten...',
      });
      this.listenForSpinnerDismissEvent();
    }
    this.listenForNotificationSettingsDidLoad();
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

  private dismissSpinner() {
    if (this.spinner) this.spinner.dismiss();
  }

  private listenForSpinnerDismissEvent() {
    this.events.subscribe('exercises:spinner-dismiss', () => {
      this.dismissSpinner();
    });
  }

  private listenForNotificationSettingsDidLoad() {
    if (this.exerciseProvider.receivedDataFromRest) {
      this.setData();
      this.receivedNotificationSettings();
    } else {
      if (this.spinner) this.spinner.present();
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
    if (this.spinner) this.spinner.dismiss();
  }
}
