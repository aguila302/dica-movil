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
	responseResult = []
	constructor(public http: HTTP, private storage: Storage) {

		/* Obtiene el token de acceso para realizar post al end point. */
		this.storage.get('auth').then((response) => {
			this.access_token = response.access_token
		})
	}

	/* Obtenemos los datos de los levantamientos a ser sincronizados. */
	async sincronizar(data) {
		var miGlobal = this
		for (let item of data) {
			let params = {
				autopista_id: item.autopista_id,
				elemento_id: item.elemento_id,
				subelemento_id: item.subelemento_id,
				cuerpo_id: item.cuerpo_id,
				condicion_id: item.condicion_id,
				carril_id: item.carril_id,
				longitud_elemento: item.longitudElemento,
				cadenamiento_inicial_km: item.cadenamientoInicialKm,
				cadenamiento_inicial_m: item.cadenamientoInicialm,
				cadenamiento_final_km: item.cadenamientoFinalKm,
				cadenamiento_final_m: item.cadenamientoFinalm,
				estatus: item.estatus,
				reportar: item.reportar,
			}
			await this.resolveApi(params).then((response) => {
				miGlobal.responseResult.push(response)
			})

		}
		return miGlobal.responseResult
	}

	/**
	 * Realiza un resolv al end point y sincroniza la informacion de los levantamientos.
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
