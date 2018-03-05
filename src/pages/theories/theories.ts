import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {TheoryPage} from "../theory/theory";

/**
 * Generated class for the TheoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-theories',
  templateUrl: 'theories.html',
})
export class TheoriesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  theorySelected() {
    this.navCtrl.push(TheoryPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TheoriesPage');
  }

}
