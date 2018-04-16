import {
	Injectable
} from '@angular/core';
import {
	DatabaseProvider
} from '../providers/database/database'

@Injectable()
export class LoginService {

	constructor(private databaseProvider: DatabaseProvider) {}

	/**
	 * Registra token de acceso en el origen de datos movil
	 */
	registrarToken = (dataResponse) => {
		return this.databaseProvider.setToken(dataResponse)
	}

	/**
	 * Obtiene token de acceso.
	 */
	obtenerToken = () => {
		return this.databaseProvider.getToken()
	}

	/**
	 * Actualizar datos de un usuario conectado.
	 */
	actualizarUser = (data, user) => {
		return this.databaseProvider.actualizarUser(data.data, user)
	}
}
