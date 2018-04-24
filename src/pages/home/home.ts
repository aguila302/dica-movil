import {
	Component
} from '@angular/core';
import {
	NavController,
	NavParams,
	ActionSheetController
} from 'ionic-angular';
import {
	LoginPage
} from '../login/login';
import {
	LevantamientoPage
} from '../levantamiento/levantamiento';
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
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	public autopistas = []

	constructor(public navCtrl: NavController, private navs: NavParams, private nativeStorage: NativeStorage,
		private autopistasService: AutopistasService, private loginService: LoginService,
		public databaseProvider: DatabaseProvider, public actionSheetCtrl: ActionSheetController) {

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
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Seleccion una opcion.',
			buttons: [{
				text: 'Consultar inventario.',
				role: 'destructive',
				handler: () => {
				}
			}, {
				text: 'Registrar levantamientp carretero.',
				role: 'destructive',
				handler: () => {
					this.nuevoLevantamiento(autopista)
				}
			}, {
				text: 'Consulatr reporte.',
				role: 'destructive',
				handler: () => {

				}
			}, {
				text: 'Cancelar.',
				role: 'cancel',
				handler: () => {
					console.log('Cancel clicked');
				}
			}]
		});
		actionSheet.present();

	}

	/* Funcion para visualizar la vista principal de una autopista. */
	nuevoLevantamiento = (autopista) => {
		this.navCtrl.push(LevantamientoPage, {
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
