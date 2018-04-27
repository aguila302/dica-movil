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
	NativeStorage
} from '@ionic-native/native-storage';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = ListadoAutopistasPage;

	pages: Array < {
		title: string,
		component: any
	} > ;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
		private nativeStorage: NativeStorage) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [{
			title: 'Inventario',
			component: ListadoAutopistasPage
		}, {
			title: 'Registrar levantamiento',
			component: ListadoAutopistasPage
		}, {
			title: 'Reporte',
			component: ListadoAutopistasPage
		}, {
			title: 'Consultar',
			component: ListadoAutopistasPage
		}, {
			title: 'Cambiar de autopista',
			component: ListadoAutopistasPage
		}, {
			title: 'Sincronizar',
			component: ListadoAutopistasPage
		}];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();

			this.nativeStorage.getItem('auth')
				.then(
					data => console.log(data),
					error => console.error(error)
				);
		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}
}
