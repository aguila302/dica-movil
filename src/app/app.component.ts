import {
	Component,
	ViewChild
} from '@angular/core';
import {
	Nav,
	Platform
} from 'ionic-angular';
import {
	StatusBar
} from '@ionic-native/status-bar';
import {
	SplashScreen
} from '@ionic-native/splash-screen';

import {
	ListadoAutopistasPage
} from '../pages/listado-autopistas/listado-autopistas';

import {
	LoginPage
} from '../pages/login/login';
import {
	RegistroLevantamientoPage
} from '../pages/registro-levantamiento/registro-levantamiento';

import {
	ListadoLevantamientosPage
} from '../pages/listado-levantamientos/listado-levantamientos';
import {
	Storage
} from '@ionic/storage';
import {
	AutopistasService
} from '../shared/autopistas-service';
import {
	AppVersion
} from '@ionic-native/app-version';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	email: string = ''
	name: string = ''
	rootPage: any
	autopista = {}
	versionApp: any

	pages: Array < {
		title: string,
		component: any,
	} > ;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
		private storage: Storage, private autopistasService: AutopistasService, private appVersion: AppVersion) {

		/* Obtiene usuario logueado. */
		this.storage.get('auth').then((response) => {
			if (response) {
				this.email = response.email
				this.name = response.nmae
				console.log(response)

				this.rootPage = ListadoAutopistasPage

			} else {
				this.rootPage = LoginPage
			}
		})

		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [{
			title: 'Consulta de levantamientos',
			component: ListadoLevantamientosPage,
		}, {
			title: 'Registrar levantamiento',
			component: RegistroLevantamientoPage,

		}, {
			title: 'Cambiar de autopista',
			component: ListadoAutopistasPage,

		}, {
			title: 'Sincronizar información',
			component: ListadoAutopistasPage,

		}];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.appVersion.getVersionNumber().then((version) => {
				this.versionApp = version
				console.log(version)

			})
		});
	}

	openPage(page) {

		let autopista = this.autopistasService.autopistaActiva
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component, {
			autopista: autopista
		});
	}

	logout = () => {
		this.storage.remove('auth').then(auth => {
			this.nav.setRoot(LoginPage, {})
		})

		this.autopistasService.autopistaActiva = null
		this.autopistasService.resetDatabase().then(() => console.log('database reset'))
	}
}
