import {
	Component
} from '@angular/core';
import {
	IonicPage,
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
	AutopistasService
} from '../../shared/autopistas-service';
import {
	LoginService
} from '../../shared/login-service'

@IonicPage()
@Component({
	selector: 'page-listado-levantamientos',
	templateUrl: 'listado-levantamientos.html',
})
export class ListadoLevantamientosPage {
	datosAutopista = {
		id: 0,
		nombre: '',
		cadenamientoInicialKm: 0,
		cadenamientoInicialm: 0,
		cadenamientoFinalKm: 0,
		cadenamientoFinalm: 0,
	}

	constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage,
		private autopistasService: AutopistasService, private loginService: LoginService) {
		/* Obtiene los datos generaes de la autopista. */
		console.log(this.navParams.get('autopista'))

		this.datosAutopista.id = this.navParams.get('autopista').autopista_id
		this.datosAutopista.nombre = this.navParams.get('autopista').nombre
		this.datosAutopista.cadenamientoInicialKm = this.navParams.get('autopista').cadenamiento_inicial_km
		this.datosAutopista.cadenamientoInicialm = this.navParams.get('autopista').cadenamiento_inicial_m
		this.datosAutopista.cadenamientoFinalKm = this.navParams.get('autopista').cadenamiento_final_km
		this.datosAutopista.cadenamientoFinalm = this.navParams.get('autopista').cadenamiento_final_m
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListadoLevantamientosPage');
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
					// this.autopistasService.userId = data[0].id
					// this.autopistasService.getAutopistas().then(autopistas => this.autopistas = autopistas)

				} else {
					/* No hay token activo. */
					this.navCtrl.setRoot(LoginPage, {})
				}

			})
	}

	/* Funcion para cerrar sesion en la aplicación */
	logout = () => {
		//* Eliminamos todos los token del origen de datos */
		// this.databaseProvider.resetDatabase().then((response) => {
		// 	this.nativeStorage.remove('auth').then((data) => {
		// 		this.navCtrl.setRoot(LoginPage, {})
		// 	})
		// })
	}
}
