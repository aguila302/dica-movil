import {
	Component
} from '@angular/core';
import {
	NavController,
	NavParams,
	ModalController
} from 'ionic-angular';
import {
	LoginPage
} from '../login/login';
import {
	OpcionesAutopistaPage
} from '../opciones-autopista/opciones-autopista';
import {
	RegistroLevantamientoPage
} from '../registro-levantamiento/registro-levantamiento';
import {
	NativeStorage
} from '@ionic-native/native-storage';

import {
	AutopistasService
} from '../../shared/autopistas-service';
import {
	LoginService
} from '../../shared/login-service'
import {
	DatabaseProvider
} from '../../providers/database/database'

@Component({
	selector: 'page-listado-autopistas',
	templateUrl: 'listado-autopistas.html'
})
export class ListadoAutopistasPage {
	public autopistas = []

	constructor(public navCtrl: NavController, private navs: NavParams, private nativeStorage: NativeStorage,
		private autopistasService: AutopistasService, private loginService: LoginService,
		public databaseProvider: DatabaseProvider, public modal: ModalController) {
		/* Obtenemos el ultimo token registrado en el origen de datos movil. */
		this.loginService.obtenerToken()
			.then(data => {

				/* Hay un token activo. */
				if (data.length) {
					this.nativeStorage.setItem('auth', {
						email: data[0].email,
						nmae: data[0].name
					}).then(
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

	/* Muestra una ventana emergente de las opciones de una autopista. */
	verOpciones = (autopista) => {
		let opciones = this.modal.create(OpcionesAutopistaPage, {
			autopista: autopista
		})
		opciones.onDidDismiss(data => {
			data.opcion === 'Nuevo levantamiento' ? this.nuevoLevantamiento(autopista) : ''
		});
		opciones.present()
	}

	/* Funcion para visualizar la vista principal de una autopista. */
	nuevoLevantamiento = (autopista) => {
		this.navCtrl.setRoot(RegistroLevantamientoPage, {
			autopista: autopista
		})
	}

	/* Funcion para cerrar sesion en la aplicación */
	logout = () => {
		//* Eliminamos todos los token del origen de datos */
		this.databaseProvider.resetDatabase().then((response) => {
			this.nativeStorage.remove('auth').then((data) => {
				this.navCtrl.setRoot(LoginPage, {})
			})
		})
	}
}
