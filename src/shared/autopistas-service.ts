import {
	Injectable
} from '@angular/core';
import {
	DatabaseProvider
} from '../providers/database/database'

@Injectable()
export class AutopistasService {

	public userId: number
	cuerpos = []

	constructor(public databaseProvider: DatabaseProvider) {
		this.getCuerpos()
	}

	/**
	 * Registrar autopistas obtenidas en el API.
	 */
	registrarAutopistas = (autopistas, user) => {
		return this.databaseProvider.registrarAutopistas(autopistas, user)

	}

	/* Obtenemos el listado de las autopistas de dicho usuario. */
	getAutopistas = () => {
		return this.databaseProvider.getAutopistas(this.userId)
	}

	/**
	 * Registrar elementos obtenidas en el API.
	 */
	registrarElementos = (elementos) => {
		return this.databaseProvider.registrarElementos(elementos)
	}

	/* Obtenemos un listado de elementos. */
	getElementos = () => {
		return this.databaseProvider.getElementos()
	}

	/**
	 * Registrar cuerpos obtenidas en el API.
	 */
	registrarCuerpos = (cuerpos) => {
		return this.databaseProvider.registrarCuerpos(cuerpos)
	}

	/* Obtenemos un listado de elementos. */
	getCuerpos = () => {
		this.databaseProvider.getCuerpos().then((response) => {
			this.cuerpos = response
		})
	}
}
