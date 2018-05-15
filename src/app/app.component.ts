import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { ExerciseProvider } from '../providers/exercise/exercise';
import { MotivationProvider } from '../providers/motivation/motivation';
import { TheoryProvider } from '../providers/theory/theory';
import { WpPageProvider } from '../providers/wp-page/wp-page';
import { NetworkProvider } from '../providers/network/network';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private theory: TheoryProvider,
    private exerciseProvider: ExerciseProvider,
    private motivationProvider: MotivationProvider,
    private wpPageProvider: WpPageProvider,
    private networkProvider: NetworkProvider
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      this.motivationProvider.checkForUpdates();
      this.exerciseProvider.checkForUpdates();
      this.theory.checkForUpdates();
      this.wpPageProvider.checkForUpdates();
      this.networkProvider.initializeNetworkEvents();
    });
  }
}
