import {
	Injectable
} from '@angular/core';
import {
	HTTP,
} from '@ionic-native/http';
import {
	URL_BASE,
	TOKEN
} from '../constants'

@Injectable()
export class ApiProvider {

	// link = {
	// 	apiUrl: 'http://f88e50cb.ngrok.io',
	// 	client_secret: 'mcElle5WbgH1INMpaCpJMw5cuY7il951psCl55Cn'
	// }

	constructor(public http: HTTP) {}

	/**
	 * Funcion para resolver el end point y obtener token de acceso.
	 */
	getToken = (username: string, password: string) => {
		let params = {
			username: username,
			password: password,
			grant_type: 'password',
			client_id: 2,
			client_secret: TOKEN
		}
		let headers = {
			'Content-Type': 'application/json'
		}

		/* Realizamos la peticion al end point. */
		this.http.setRequestTimeout(15000)

		return this.http.post(`${URL_BASE}/oauth/token`, params, headers)
			.then(data => {
				return {
					'status': data.status,
					'data': JSON.parse(data.data),
					'headers': data.headers
				}
			}).catch(error => {
				console.log(error)

				return {
					'status': error.status,
					'data': JSON.parse(error.error),
					'headers': error.headers,
				}
			})
	}

	/* Funcion para loguar al usuario en la aplicacion y obteer loa datos del usuario. */
	getUsuario = (user) => {
		let params = {
			'Authorization': 'Bearer ' + user.access_token
		}

		return this.http.get(`${URL_BASE}/api/user`, {}, params)
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
	getAutopistas = (accessToken) => {
		let params = {
			'Authorization': 'Bearer ' + accessToken.access_token
		}

		return this.http.get(`${URL_BASE}/api/autopistas`, {}, params)
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
	getElementos = (accessToken) => {
		let params = {
			'Authorization': 'Bearer ' + accessToken.access_token
		}

		return this.http.get(`${URL_BASE}/api/elementos`, {}, params)
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
	getCuerpos = (accessToken) => {
		let params = {
			'Authorization': 'Bearer ' + accessToken.access_token
		}

		return this.http.get(`${URL_BASE}/api/cuerpos`, {}, params)
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

	/* Obtiene los subelementos. */
	getSubElementos = (accessToken) => {
		let params = {
			'Authorization': 'Bearer ' + accessToken.access_token
		}

		return this.http.get(`${URL_BASE}/api/subelementos`, {}, params)
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


	/* Obtiene las condiones. */
	getCondiciones = (accessToken) => {
		let params = {
			'Authorization': 'Bearer ' + accessToken.access_token
		}

		return this.http.get(`${URL_BASE}/api/condiciones`, {}, params)
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

	/* Obtiene las carriles. */
	getCarriles = (accessToken) => {
		let params = {
			'Authorization': 'Bearer ' + accessToken.access_token
		}

		return this.http.get(`${URL_BASE}/api/carriles`, {}, params)
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
