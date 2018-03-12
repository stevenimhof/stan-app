import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  dayliMotivation;
  lastUpdated;

  constructor(public navCtrl: NavController) {
    this.dayliMotivation = this.getDayliMotivation();
    this.lastUpdated = new Date(0).toJSON().slice(0,10).replace(/-/g,'/');
  }

  motivations = [
    'Bleib Stark',
    'Du schaffst das!',
    'Mach weiter so!',
    'Bald geschafft!'
    ];

  changeMotivation() {
    this.lastUpdated = new Date(0).toJSON().slice(0,10).replace(/-/g,'/');
    this.dayliMotivation = this.getDayliMotivation();
  }

  getDayliMotivation () {
    var currentDate = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    if (currentDate != this.lastUpdated) {
      var newMotivation = '';
      do {
        newMotivation = this.motivations[Math.floor(Math.random()*this.motivations.length)];
      } while (this.dayliMotivation == newMotivation);
    }
    this.lastUpdated = currentDate;
    return newMotivation + ' (Datum: ' + this.lastUpdated + '    )';
  }

}
