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

  constructor(public navCtrl: NavController,
    private motivationProvider: MotivationProvider,
    private events: Events,
    private storage: Storage) {
    this.listenForMotivationsDidLoad();
    
  }

  public loadSettings() {
    this.navCtrl.push(SettingsPage);
  }

  private setDailyMotivation() {
    this.motivationProvider.getDailyMotivation().then(motivation => {
      this.dailyMotivation = motivation;
    });
  }

  private listenForMotivationsDidLoad() {
    this.events.subscribe('motivations:loaded', () => {
      this.setDailyMotivation();
    });
  }
}
