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
	elementoId: number
	elementos = []
	condiciones = []
	carriles = []

	constructor(public databaseProvider: DatabaseProvider) {
		this.getCuerpos(), this.getElementos(), this.getCondiciones(), this.getCarriles()
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
		this.databaseProvider.getElementos().then((response) => {
			this.elementos = response
		})
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

	/* Obtenemos los sub elementos asociados a un elemento. */
	getSubElemento = (event) => {
		return this.databaseProvider.getSubElemento(event)
	}

	/**
	 * Registrar subelementos obtenidas en el API.
	 */
	registrarSubElementos = (subelementos) => {
		return this.databaseProvider.registrarSubElementos(subelementos)
	}

	/**
	 * Registrar condiciones obtenidas en el API.
	 */
	registrarCondiciones = (condiciones) => {
		return this.databaseProvider.registrarCondiciones(condiciones)
	}

	/* Obtenemos un listado de condiciones. */
	getCondiciones = () => {
		this.databaseProvider.getCondiciones().then((response) => {
			this.condiciones = response
		})
	}

	/**
	 * Registra los carriles obtenidas en el API.
	 */
	registrarCarriles = (carriles) => {
		return this.databaseProvider.registrarCarriles(carriles)
	}

	/* Obtenemos un listado de carriles. */
	getCarriles = () => {
		this.databaseProvider.getCarriles().then((response) => {
			this.carriles = response
		})
	}
}
