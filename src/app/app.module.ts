import {
	BrowserModule
} from '@angular/platform-browser';
import {
	ErrorHandler,
	NgModule
} from '@angular/core';
import {
	IonicApp,
	IonicErrorHandler,
	IonicModule
} from 'ionic-angular';
import {
	HTTP
} from '@ionic-native/http';

import {
	MyApp
} from './app.component';
import {
	HomePage
} from '../pages/home/home';
import {
	ListPage
} from '../pages/list/list';
import {
	LoginPage
} from '../pages/login/login';

import {
	LevantamientoPage
} from '../pages/levantamiento/levantamiento';

import {
	StatusBar
} from '@ionic-native/status-bar';
import {
	SplashScreen
} from '@ionic-native/splash-screen';
import {
	DatabaseProvider
} from '../providers/database/database';
import {
	AutopistasService
} from '../shared/autopistas-service';
import {
	LoginService
} from '../shared/login-service';

import {
	SQLite
} from '@ionic-native/sqlite';
import {
	ApiProvider
} from '../providers/api/api';
import {
	NativeStorage
} from '@ionic-native/native-storage';
import {
	Network
} from '@ionic-native/network';
import {
	Camera
} from '@ionic-native/camera';
import {
	BrMaskerModule
} from 'brmasker-ionic-3';
import {
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import {
	SQLitePorter
} from '@ionic-native/sqlite-porter';

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		ListPage,
		LoginPage,
		LevantamientoPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		BrMaskerModule,
		FormsModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		ListPage,
		LoginPage,
		LevantamientoPage
	],
	providers: [
		StatusBar,
		SplashScreen, {
			provide: ErrorHandler,
			useClass: IonicErrorHandler
		},
		DatabaseProvider,
		SQLite,
		NativeStorage,
		ApiProvider,
		HTTP,
		AutopistasService,
		LoginService,
		Network,
		Camera,
		SQLitePorter
	]
})
export class AppModule {}
