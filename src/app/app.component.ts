import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { ExerciseProvider } from '../providers/exercise/exercise';
import { MotivationProvider } from '../providers/motivation/motivation';
import { TheoryProvider } from '../providers/theory/theory';
import { NotificationProvider } from '../providers/notification/notification';
import { WpPageProvider } from '../providers/wp-page/wp-page';

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
    private notificationProvider: NotificationProvider,
    private wpPageProvider: WpPageProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.motivationProvider.checkForUpdates();
      this.exerciseProvider.checkForUpdates();
      this.theory.checkForUpdates();
      //this.notificationProvider.loadSettings();
      this.wpPageProvider.checkForUpdates();
    });
  }
}
