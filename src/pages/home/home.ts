import {
	Component
} from '@angular/core';
import {
	NavController,
	NavParams
} from 'ionic-angular';
import {
	LoginPage
} from '../login/login';
import {
	NativeStorage
} from '@ionic-native/native-storage';
import {
	DatabaseProvider
} from '../../providers/database/database'
import {
	AutopistasService
} from '../../shared/autopistas-service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	public autopistas = []

	constructor(public navCtrl: NavController, private navs: NavParams, private nativeStorage: NativeStorage,
		private databaseProvider: DatabaseProvider, private autopistasService: AutopistasService) {

		/* Obtenemos el ultimo token registrado en el origen de datos movil. */
		this.databaseProvider.getToken()
			.then(data => {
				/* Hay un token activo. */
				if (data.length) {
					this.nativeStorage.setItem('auth', true).then(
						() => console.log('Stored item!'),
						error => console.error('Error storing item', error)
					)
					/* Obtenemos las autopistas del origen de datos asignadas a dicho usuario conectado*/
					this.autopistasService.userId = data[0].id
					this.autopistasService.getAutopistas().then(autopistas => this.autopistas = autopistas)

				} else {
					/* No hay token activo. */
					this.navCtrl.setRoot(LoginPage, {})
				}

			})
	}

	ionViewDidLoad() {}

	/* Funcion para cerrar sesion en la aplicación */
	logout = () => {
		/* Eliminamos todos los token del origen de datos */
		this.databaseProvider.deleteToken().then((response) => {
			/* Eliminamos las autopistas */
			this.databaseProvider.deleteAutopistas().then((response) => {
				this.nativeStorage.remove('auth').then((data) => {
					this.navCtrl.setRoot(LoginPage, {})
				})
			})
		})
	}
}
