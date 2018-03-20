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
		apiUrl: 'http://11.11.2.30:9999',
		client_secret: 'NPQuC1eO1DQYNhTj7tnpDFo13w5P0XSZXD1ObvVy'
	}

	constructor(public http: HTTP) {}

	/**
	 * Funcion para resolver el end point y obtener token de acceso.
	 */
	getLogin = (email: string, password: string): Promise < HTTPResponse > => {
		let params = {
			username: email,
			password: password,
			grant_type: 'password',
			client_id: 8,
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
