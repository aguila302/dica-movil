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

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	// @ViewChild(ListadoLevantamientosPage) listadoLevantamientosPage: ListadoLevantamientosPage;

	rootPage: any
	autopista = {}

	pages: Array < {
		title: string,
		component: any,
	} > ;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
		private storage: Storage, private autopistasService: AutopistasService) {

		/* Obtiene usuario logueado. */
		this.storage.get('auth').then((response) => {
			if (response) {
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

		}];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
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
}
