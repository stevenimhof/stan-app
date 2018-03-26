import {Component, NgZone} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {MotivationProvider} from "../../providers/motivation/motivation";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dailyMotivation;

  constructor(public navCtrl: NavController,
              private ngZone: NgZone,
              private motivationProvider: MotivationProvider,
              private events: Events) {
    this.listenForMotivationsDidLoad();
  }

  setDailyMotivation() {
    this.motivationProvider.getDailyMotivation().then(motivation => {
      this.dailyMotivation = motivation;
    });
  }

  listenForMotivationsDidLoad() {
    this.events.subscribe('motivations:loaded', () => {
      this.setDailyMotivation();
    });
  }

  // only for testing purposes
  changeMotivation() {
    this.motivationProvider.changeMotivation();
  }

  loadSettings() {
    this.navCtrl.push(SettingsPage);
  }
}
