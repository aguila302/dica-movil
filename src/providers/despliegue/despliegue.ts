import {
	Injectable
} from '@angular/core';
import {
	HTTP,
} from '@ionic-native/http';
import {
	Storage
} from '@ionic/storage'
import {
	URL_BASE
} from '../constants'

@Injectable()
export class DespliegueProvider {
	access_token: string = ''
	responseResult = {}
	constructor(public http: HTTP, private storage: Storage) {

		/* Obtiene el token de acceso para realizar post al end point. */
		this.storage.get('auth').then((response) => {
			this.access_token = response.access_token
		})
	}

	/* Obtenemos los datos de los levantamientos a ser sincronizados. */
	async sincronizar(data) {
		await this.resolveApi(data).then((response) => {
			this.responseResult = response
		})
		return this.responseResult
	}

	/**
	 * Realiza un resolve al end point y sincroniza la informacion de los levantamientos.
	 */
	async resolveApi(data) {
		let headers = {
			'Authorization': `Bearer ${this.access_token}`,
			'Accept': 'application/json'
		}

		return this.http.post(`${URL_BASE}/api/levantamiento`, data, headers)
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
