import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Config } from './app.config';

import { HomePage } from '../pages/home/home';
import { ExercisesPage } from "../pages/exercises/exercises/exercises";
import { ExercisePage } from "../pages/exercises/exercise/exercise";
import { TheoriesPage } from "../pages/theories/theories/theories";
import { TheoryPage } from "../pages/theories/theory/theory";
import { InfoPage } from "../pages/info/info";
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from "../pages/settings/settings";
import { AboutPage } from '../pages/about/about';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { KeepHtmlPipe } from '../pipes/keep-html/keep-html';
import { AccordionComponent } from '../components/accordion/accordion';
import { Network } from '@ionic-native/network';

import { ExerciseProvider } from '../providers/exercise/exercise';
import { MotivationProvider } from '../providers/motivation/motivation';
import { TheoryProvider } from '../providers/theory/theory';
import { NotificationProvider } from '../providers/notification/notification';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ExercisesPage,
    ExercisePage,
    TheoriesPage,
    TheoryPage,
    InfoPage,
    TabsPage,
    SettingsPage,
    AboutPage,
    KeepHtmlPipe,
    AccordionComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ExercisesPage,
    ExercisePage,
    TheoriesPage,
    TheoryPage,
    InfoPage,
    TabsPage,
    SettingsPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Config,
    Network,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ExerciseProvider,
    MotivationProvider,
    TheoryProvider,
    NotificationProvider
  ]
})
export class AppModule {
}
