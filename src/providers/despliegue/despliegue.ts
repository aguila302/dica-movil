/**
 * Clase generada para DespliegueProvider.
 * Autor: Alfonso Hernández Montoya.
 * Fecha de creación: 24 Mayo 2018.
 * Descripción: Clase para la funcionalidad de gestionar y administrar la sincronización de levantamientos.
 * Modifico: Alfonso Hernández Montoya.
 * Fecha modificación: 24 Mayo 2018.
 */

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
import {
	FileTransfer,
	FileUploadOptions,
	FileTransferObject
} from '@ionic-native/file-transfer';

@Injectable()
export class DespliegueProvider {
	access_token: string = ''
	responseResult = {}
	constructor(public http: HTTP, private storage: Storage, private transfer: FileTransfer) {

		/* Obtiene el token de acceso para realizar post al end point. */
		this.storage.get('auth').then((response) => {
			this.access_token = response.access_token
		})
	}
	fileTransfer: FileTransferObject = this.transfer.create();

	/* Obtenemos los datos de los levantamientos a ser sincronizados. */
	async sincronizar(data) {
		await this.resolveApi(data).then((response) => {
			this.responseResult = response
		}).catch(error => {
			console.error.bind(console)
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

	/**
	 * Transfiere las fotografias de un levantamiento.
	 */
	transfiereFotos = (path, levantamiento) => {
		let options: FileUploadOptions = {
			fileKey: 'foto',
			fileName: path.substr(path.lastIndexOf('/') + 1),
			httpMethod: 'POST',
			mimeType: 'image/png',
			chunkedMode: true,
			headers: {
				'Authorization': `Bearer ${this.access_token}`,
				'Accept': 'application/json'
			}

		}
		this.fileTransfer.upload(path, `${URL_BASE}/api/levantamiento/${levantamiento}/fotografias`, options)
			.then((data) => {
				console.log(JSON.parse(data.response))
			})
			.catch((error) => {
				console.log(error)
			});
	}

}
