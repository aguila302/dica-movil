/**
 * Clase generada para ListadoLevantamientosPage.
 * Autor: Alfonso Hernández Montoya.
 * Fecha de creación: 24 Mayo 2018.
 * Descripción: Componente para la funcionalidad de listado de levantamientos registrados en una autopista.
 * Modifico: Alfonso Hernández Montoya.
 * Fecha modificación: 24 Mayo 2018.
 */

import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	AlertController
} from 'ionic-angular';
import {
	AutopistasService
} from '../../shared/autopistas-service';
import {
	DetalleLevantamientoPage
} from '../../pages/detalle-levantamiento/detalle-levantamiento';

@IonicPage()
@Component({
	selector: 'page-listado-levantamientos',
	templateUrl: 'listado-levantamientos.html',
})
export class ListadoLevantamientosPage {
	levantamientos = []
	public datosAutopista = {
		id: 0,
		nombre: '',
	}

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private autopistasService: AutopistasService, public alert: AlertController) {

		/* Obtiene los datos generaes de la autopista. */
		this.datosAutopista.id = this.navParams.get('autopista').autopista_id
		this.datosAutopista.nombre = this.navParams.get('autopista').nombre
	}

	ionViewDidLoad() {
		this.listadoLevantamientos()
	}

	/*
	Obtiene una lista de vantamientos de una autopista.
	 */
	listadoLevantamientos = () => {
		this.autopistasService.listadoLevantamientos(this.datosAutopista.id).then(levantamientos => {
			this.levantamientos = levantamientos
		}).catch(error => {
			console.error.bind(console)
		})
	}

	/*
	Muestra el detalle de un levantamiento.
	 */
	detalleLevantamiento = (levantamiento) => {
		this.navCtrl.push(DetalleLevantamientoPage, {
			levantamiento,
			autopista: this.datosAutopista.nombre
		})
	}

	/**
	 * Elimina un levantamiento del origen de datos
	 */
	deleteLevantamiento = (levantamiento) => {
		let mensaje = this.alert.create({
			title: 'Desarrollo',
			subTitle: 'Actualmente en desarrollo',
			buttons: ['Aceptar']
		})
		mensaje.present()
	}
}
