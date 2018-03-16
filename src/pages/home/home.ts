import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {MotivationProvider} from "../../providers/motivation/motivation";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dayliMotivation;

  constructor(public navCtrl: NavController,
              private motivationProvider: MotivationProvider) {
    this.dayliMotivation = this.motivationProvider.dayliMotivation;
  }

  changeMotivation() {
    this.motivationProvider.changeMotivation();
    this.dayliMotivation = this.motivationProvider.dayliMotivation;
  }

  loadSettings() {
    this.navCtrl.push(SettingsPage);
  }
}
