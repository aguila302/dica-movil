import {
	Injectable
} from '@angular/core';
import {
	HTTP,
	HTTPResponse
} from '@ionic-native/http';

@Injectable()
export class ApiProvider {

	link = {
		apiUrl: 'http://d2f1a188.ngrok.io',
		client_secret: 'unKvzknkJBX908RHuE1KBpI1oRsj011jlrnlXxRt'
	}

	constructor(public http: HTTP) {}

	/**
	 * Funcion para resolver el end point y obtener token de acceso.
	 */
	getToken = (username: string, password: string): Promise < HTTPResponse > => {
		let params = {
			username: username,
			password: password,
			grant_type: 'password',
			client_id: 2,
			client_secret: this.link.client_secret
		}
		let headers = {
			'Content-Type': 'application/json'
		}

		/* Realizamos la peticion al end point. */
		this.http.setRequestTimeout(15000)

		return this.http.post(`${this.link.apiUrl}/oauth/token`, params, headers)
			.then(data => {
				return {
					'status': data.status,
					'data': JSON.parse(data.data),
					'headers': data.headers
				}
			}).catch(error => {
				return {
					'status': error.status,
					'data': JSON.parse(error.error),
					'headers': error.headers,
				}
			})
	}

	/* Funcion para loguar al usuario en la aplicacion y obteer loa datos del usuario. */
	getUsuario = (user): Promise < HTTPResponse > => {
		let params = {
			'Authorization': 'Bearer ' + user.access_token
		}

		return this.http.get(`${this.link.apiUrl}/api/user`, {}, params)
			.then(data => {
				return {
					'status': data.status,
					'data': JSON.parse(data.data),
					'headers': data.headers
				}
			}).catch(error => {
				return {
					'status': error.status,
					'data': JSON.parse(error.error),
					'headers': error.headers,
				}
			})
	}

	/* Obtiene las autopistas asignadas de un usuario */
	getAutopistas = (accessToken): Promise < HTTPResponse > => {
		let params = {
			'Authorization': 'Bearer ' + accessToken.access_token
		}

		return this.http.get(`${this.link.apiUrl}/api/autopistas`, {}, params)
			.then(data => {
				return {
					'status': data.status,
					'data': JSON.parse(data.data),
					'headers': data.headers
				}
			}).catch(error => {
				return {
					'status': error.status,
					'data': JSON.parse(error.error),
					'headers': error.headers,
				}
			})
	}
}
