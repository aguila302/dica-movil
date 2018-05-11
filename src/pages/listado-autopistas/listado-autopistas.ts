import {
	Component
} from '@angular/core';
import {
	NavController,
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
	ListadoLevantamientosPage
} from '../listado-levantamientos/listado-levantamientos';
import {
	Storage
} from '@ionic/storage';

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

	constructor(public navCtrl: NavController, private storage: Storage,
		private autopistasService: AutopistasService, private loginService: LoginService,
		public databaseProvider: DatabaseProvider, public modal: ModalController) {


	}
	ionViewDidLoad() {
		/* Obtenemos el ultimo token registrado en el origen de datos movil. */
		this.loginService.obtenerToken()
			.then(data => {
				/* Hay un token activo. */
				if (data.length) {
					this.storage.set('auth', {
						email: data[0].email,
						nmae: data[0].name
					}).then((response) => {
						/* Obtenemos las autopistas del origen de datos asignadas a dicho usuario conectado*/
						this.autopistasService.userId = data[0].id
						this.autopistasService.getAutopistas().then(autopistas => this.autopistas = autopistas)
					})

				}
			})
	}

	/* Muestra una ventana emergente de las opciones de una autopista. */
	verOpciones = (autopista) => {
		let opciones = this.modal.create(OpcionesAutopistaPage, {})

		opciones.onDidDismiss(data => {
			data.opcion === 'Nuevo levantamiento' ? this.nuevoLevantamiento(autopista) :
				data.opcion === 'Consultar levantamientos' ? this.consultarLevantamiento(autopista) : ''

			this.autopistasService.autopistaActiva = autopista
		});
		opciones.present()
	}

	/* Funcion para visualizar la vista nuevo levantamiento. */
	nuevoLevantamiento = (autopista) => {
		this.navCtrl.setRoot(RegistroLevantamientoPage, {
			autopista
		})
	}

	/* Muestra un listado de levantamietos de una autopista. */
	consultarLevantamiento = (autopista) => {
		this.navCtrl.setRoot(ListadoLevantamientosPage, {
			autopista
		})
	}

	/* Funcion para cerrar sesion en la aplicación. */
	logout = () => {
		this.storage.remove('auth').then(auth => {
			this.navCtrl.setRoot(LoginPage, {})
		})

		this.databaseProvider.resetDatabase().then(() => console.log('database reset'))
	}
}
