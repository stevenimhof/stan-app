import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {ExcercisesPage} from "../excercises/excercises";
import {TheoriesPage} from "../theories/theories";
import {SettingsPage} from "../settings/settings";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ExcercisesPage;
  tab3Root = TheoriesPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
