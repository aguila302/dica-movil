import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	AlertController
} from 'ionic-angular';
import {
	HomePage
} from '../home/home'
import {
	ApiProvider
} from '../../providers/api/api'

import {
	DatabaseProvider
} from '../../providers/database/database'
import {
	NativeStorage
} from '@ionic-native/native-storage';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	username: string = ''
	clave_acceso: string = ''

	constructor(public navCtrl: NavController, private alertCtrl: AlertController,
		private apiProvider: ApiProvider, private databaseProvider: DatabaseProvider,
		private nativeStorage: NativeStorage) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	/**
	 * Funcion para realizar el proceso de logueo.
	 */
	login = () => {
		/* Si el usuario o contraseña son vacios mostramos una alerta de aviso. */
		if (this.username === '' || this.clave_acceso === '') {
			let alert = this.alertCtrl.create({
				title: 'Login',
				subTitle: 'Debes copletar el usuario y la contraseña',
				buttons: ['Aceptar']
			})

			alert.present()
		} else {
			/* Resolvemos el end point para loguear al usuario y obtener token de acceso. */
			this.username = 'admin@calymayor.com.mx'
			this.clave_acceso = 'secret'

			/* Llamamos a nuestro servicio para obtener token de acceso. */
			this.apiProvider.getLogin(this.username, this.clave_acceso)
				.then(response => {
					response.status === 200 ? this.setToken(response.data) : this.getMensajeError(response.data)
				})
		}
	}

	/*
		Funcion para registrar el token de acceso en el origen de datos movil.
	 */
	setToken = (dataResponse: {}) => {
		this.databaseProvider.setToken(dataResponse).then((response) => {

			/* Funcion para obtener el token de acceso. */
			this.databaseProvider.getToken()
				.then((response) => {
					this.setUpdate(response[0])
				})
		})
	}

	/* Funcion para realizar la peticion al end point para loguear al usuario. */
	setUpdate = (usuario) => {
		this.apiProvider.getUsuario(usuario).then((response) => {
			/* Funcion para actualizar los datos del usuario. */
			this.databaseProvider.actualizarUser(response, usuario)
				.then((response) => {
					/* Mostramos el home de la aplicacion. */
					this.navCtrl.setRoot(HomePage, {})
				})
		})
	}

	getMensajeError = (dataResponse: {}) => {
		console.log(dataResponse)
		let mensaje = this.alertCtrl.create({
			title: 'Iniciar sesión',
			message: 'Cliente inválido, la autenticación del cliente falló',
			buttons: ['Aceptar']

		})

		mensaje.present()
	}
}
