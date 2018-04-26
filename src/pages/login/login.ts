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
	ListPage
} from '../list/list'
import {
	ApiProvider
} from '../../providers/api/api'

import {
	LoginService
} from '../../shared/login-service'
import {
	AutopistasService
} from '../../shared/autopistas-service'
import {
	NativeStorage
} from '@ionic-native/native-storage';
import {
	Network
} from '@ionic-native/network';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	username: string = ''
	clave_acceso: string = ''

	constructor(public navCtrl: NavController, private alertCtrl: AlertController,
		private apiProvider: ApiProvider, private loginService: LoginService,
		private nativeStorage: NativeStorage, private network: Network, private autopistasService: AutopistasService) {}

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
			/* Si existe una conexion via wifi. */
			if (this.network.type == 'wifi') {
				this.username = 'useradmin'
				this.clave_acceso = 'secret'
				/* Resolvemos el end point para loguear al usuario y obtener token de acceso. */

				/* Llamamos a nuestro servicio para obtener token de acceso. */
				this.apiProvider.getToken(this.username, this.clave_acceso)
					.then(response => {

						response.status === 200 ? this.setToken(response.data) : this.getMensajeError('Iniciar sesión', 'Cliente inválido, la autenticación del cliente falló')
					})
			} else {
				/* Si no hay conexión alguna mandamos un mensaje de error */
				this.getMensajeError('Error', 'Parece que tienes un error de conexión, favor de verificarlo para continuar')

			}
		}
	}

	/*
		Funcion para registrar el token de acceso en el origen de datos movil.
	 */
	setToken = (dataResponse: {}) => {
		this.loginService.registrarToken(dataResponse).then((response) => {
			/* Funcion para obtener el token de acceso. */
			this.loginService.obtenerToken().then((response) => {
				this.signIn(response[0])
			})
		})
	}

	/* Funcion para realizar la peticion al end point para loguear al usuario. */
	signIn = (usuario) => {
		this.apiProvider.getUsuario(usuario).then((dataUser) => {

			/* Funcion para actualizar los datos del usuario. */
			this.loginService.actualizarUser(dataUser.data, usuario)
				.then((response) => {
					/* Funcion para descargar los catalogos de autopistas. */
					this.descargaAutopistas(response, usuario)
				})
		})
	}

	/* Descaraga los autopistas en el API. */
	descargaAutopistas = (response, usuario) => {
		/* Descargamos las autopistas asignadas al usuario.  */
		this.apiProvider.getAutopistas(usuario).then((response) => {
			/* Registramos las autopistas asignadas a este usuario conectado en el origen de datos movil */
			this.autopistasService.registrarAutopistas(response.data.data, usuario).then((response) => {

				/* Descargamos los elementos.  */
				this.descargaElementos(usuario)
			})
		})
	}

	/* Descaraga los elementos en el API. */
	descargaElementos = (usuario) => {
		/* Descargamos los elementos.  */
		this.apiProvider.getElementos(usuario).then((response) => {
			/* Registramos las elementos en el origen de datos movil */
			this.autopistasService.registrarElementos(response.data.data).then((response) => {
				/* Descarga el listado de cuerpos. */
				this.descargaCuerpos(usuario)
			})
		})
	}

	/* Descaraga los elementos en el API. */
	descargaCuerpos = (usuario) => {
		/* Descargamos los elementos.  */
		this.apiProvider.getCuerpos(usuario).then((response) => {

			/* Registramos las elementos en el origen de datos movil */
			this.autopistasService.registrarCuerpos(response.data.data).then((response) => {

				/* Descarga el listado de subelementos. */
				this.descargaSubElementos(usuario)
			})
		})
	}

	/* Descaraga los sub elementos en el API. */
	descargaSubElementos = (usuario) => {
		/* Descargamos los elementos.  */
		this.apiProvider.getSubElementos(usuario).then((response) => {

			/* Registramos los sub elementos en el origen de datos movil */
			this.autopistasService.registrarSubElementos(response.data.data).then((response) => {
				this.descargaCondiciones(usuario)
			})
		})
	}

	/* Descaraga las condiciones en el API. */
	descargaCondiciones = (usuario) => {
		/* Descargamos las condiones. */
		this.apiProvider.getCondiciones(usuario).then((response) => {

			/* Registramos las condiciones en el origen de datos movil */
			this.autopistasService.registrarCondiciones(response.data.data).then((response) => {
				this.descargaCarriles(usuario)

			})

		})
	}

	/* Descaraga los carriles en el API. */
	descargaCarriles = (usuario) => {
		/* Descargamos las condiones. */
		this.apiProvider.getCarriles(usuario).then((response) => {

			/* Registramos los carriles en el origen de datos movil */
			this.autopistasService.registrarCarriles(response.data.data).then((response) => {
				/* Mostramos el listado de las autopistas. */
				this.navCtrl.setRoot(ListPage, {})
			})
		})
	}

	/* Mostramos mensaje de error en la autenticación al api*/
	getMensajeError = (title: string, message: string) => {
		let mensaje = this.alertCtrl.create({
			title: title,
			message: message,
			buttons: ['Aceptar']
		})

		mensaje.present()
	}
}
