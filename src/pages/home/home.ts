import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";
import { MotivationProvider } from "../../providers/motivation/motivation";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dailyMotivation;

  constructor(private navCtrl: NavController,
    private motivationProvider: MotivationProvider,
    private events: Events,
    private storage: Storage) {
    this.listenForMotivationsDidChange();
  }

  ionViewWillEnter() {
    if (this.dailyMotivation) {
      this.motivationProvider.setDailyMotivation();
      this.getDailyMotivation();
    }
  }

  public deleteStorage() {
    this.storage.remove('exercises');
    this.storage.remove('motivations');
    this.storage.remove('notificationSettings');
    this.storage.remove('theories');
    this.storage.remove('wp_pages');
  }

  public setOldDate() {
    this.motivationProvider.changeMotivation();
  }

  public loadSettings() {
    this.navCtrl.push(SettingsPage);
  }

  private getDailyMotivation() {
    this.dailyMotivation = this.motivationProvider.getDailyMotivation();
  }

  private listenForMotivationsDidChange() {
    this.events.subscribe('motivations:change', () => {
      this.getDailyMotivation();
    });
  }
}
