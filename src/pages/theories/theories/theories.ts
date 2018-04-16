import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { TheoryPage } from "../theory/theory";
import { TheoryProvider } from '../../../providers/theory/theory';

@Component({
  selector: 'page-theories',
  templateUrl: 'theories.html',
})
export class TheoriesPage {
  theories = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private theoryProvider: TheoryProvider) {

    this.listenForTheoriessDidLoad();
    if (!this.theories.length) {
      this.getData();
    }
  }

  public loadTheory(theory) {
    this.navCtrl.push(TheoryPage, {
      theory: theory
    });
  }

  private getData() {
    this.theories = this.theoryProvider.getTheories();
  }

  private listenForTheoriessDidLoad() {
    this.events.subscribe('theories:loaded', () => {
      this.getData();
      this.unlistenForTheoriessDidLoad();
    });
  }

  private unlistenForTheoriessDidLoad() {
    this.events.unsubscribe('theories:loaded', null);
  }

}
