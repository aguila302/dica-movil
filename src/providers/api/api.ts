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
		apiUrl: 'http://180027c4.ngrok.io',
		client_secret: 'ZU6DC8oPgAXWzKswg9TFm67Fa5wFt9viZowNOVBJ'
	}

	constructor(public http: HTTP) {}

	/**
	 * Funcion para resolver el end point y obtener token de acceso.
	 */
	getLogin = (username: string, password: string): Promise < HTTPResponse > => {
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
}
