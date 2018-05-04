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
	RegistroLevantamientoPage
} from '../pages/registro-levantamiento/registro-levantamiento';

import {
	ListadoLevantamientosPage
} from '../pages/listado-levantamientos/listado-levantamientos';

import {
	NativeStorage
} from '@ionic-native/native-storage';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = ListadoAutopistasPage;
	autopista = {}

	pages: Array < {
		title: string,
		component: any,
	} > ;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
		private nativeStorage: NativeStorage) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [{
			title: 'Consultar levantamiento',
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

			/* Obtiene usuario logueado. */
			this.nativeStorage.getItem('auth')
				.then(
					data => console.log(data),
					error => console.error(error)
				);

			/* Obtiene autopista seleccionada. */
			this.nativeStorage.getItem('autopistas')
				.then(
					data => {
						console.log(data)
						this.autopista = data
						console.log(this.autopista);

					},
					error => console.error(error)
				);

		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component, {
			autopista: this.autopista
		});
	}
}
