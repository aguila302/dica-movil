import {
	Injectable
} from '@angular/core';
import {
	DatabaseProvider
} from '../providers/database/database'

@Injectable()
export class AutopistasService {

	public userId: number
	elementoId: number
	constructor(public databaseProvider: DatabaseProvider) {}
	autopistaActiva = {}

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
		return this.databaseProvider.getCuerpos()
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
		return this.databaseProvider.getCondiciones()
	}

	/**
	 * Registra los carriles obtenidas en el API.
	 */
	registrarCarriles = (carriles) => {
		return this.databaseProvider.registrarCarriles(carriles)
	}

	/* Obtenemos un listado de carriles. */
	getCarriles = () => {
		return this.databaseProvider.getCarriles()
	}

	/* Registramos levantamientos en el origen de datos movil. */
	guardaLevantamiento = (controles, autopista: number) => {
		let dataInsert = {
			autopista,
			cuerpo: controles.cuerpo.value,
			elemento: controles.elemento.value,
			tipoElemento: controles.tipoElemento.value,
			condicion: controles.condicionFisica.value,
			carril: controles.carril.value,
			longitudElemento: controles.longitudElemento.value,
			cadenamientoInicialKm: controles.cadenamientoInicialKm.value,
			cadenamientoInicialm: controles.cadenamientoInicialm.value,
			cadenamientoFinalKm: controles.cadenamientoFinalKm.value,
			cadenamientoFinalm: controles.cadenamientoFinalm.value,
			reportar: controles.reportar.value,
			statusLevantamiento: controles.statusLevantamiento.value,
		}
		return this.databaseProvider.registrarInventarios(dataInsert)
	}

	/* Registra un levantamiento con su imagen. */
	guardaImagen = (urlImgen: string, id: number) => {
		return this.databaseProvider.registrarImagenes(urlImgen, id)
	}

	/*
	Obtiene un listado de levantamientos de una autopista.
	*/
	listadoLevantamientos = (id: number) => {
		return this.databaseProvider.listadoLevantamientos(id)
	}

	/*
	Obtener las url de las fotos de un levantamiento.
	*/
	getFotos = (levantamiento) => {
		return this.databaseProvider.getFotos(levantamiento.id)
	}

	/*
	Resetea el origen de datos movil.
	 */
	resetDatabase = () => {
		return this.databaseProvider.resetDatabase()
	}
}
