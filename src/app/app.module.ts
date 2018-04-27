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
	RegistroLevantamientoPage
} from '../pages/registro-levantamiento/registro-levantamiento';
import {
	ListadoAutopistasPage
} from '../pages/listado-autopistas/listado-autopistas';
import {
	LoginPage
} from '../pages/login/login';

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
import {
	CustomFormsModule
} from 'ng2-validation'
import {
	OpcionesAutopistaPage
} from '../pages/opciones-autopista/opciones-autopista';
import {
	Base64ToGallery
} from '@ionic-native/base64-to-gallery';
import {
	PhotoLibrary
} from '@ionic-native/photo-library';

@NgModule({
	declarations: [
		MyApp,
		RegistroLevantamientoPage,
		ListadoAutopistasPage,
		LoginPage,
		OpcionesAutopistaPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		BrMaskerModule,
		FormsModule,
		CustomFormsModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		RegistroLevantamientoPage,
		ListadoAutopistasPage,
		LoginPage,
		OpcionesAutopistaPage
	],
	providers: [
		PhotoLibrary,
		Base64ToGallery,
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
