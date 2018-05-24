/**
 * Clase generada para DetalleLevantamientoPage.
 * Autor: Alfonso Hernández Montoya.
 * Fecha de creación: 24 Mayo 2018.
 * Descripción: Componente para la funcionalidad de poder ver el detalle de un levantamiento.
 * Modifico: Alfonso Hernández Montoya.
 * Fecha modificación: 24 Mayo 2018.
 */

import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams
} from 'ionic-angular';
import {
	AutopistasService
} from '../../shared/autopistas-service'

@IonicPage()
@Component({
	selector: 'page-detalle-levantamiento',
	templateUrl: 'detalle-levantamiento.html',
})

export class DetalleLevantamientoPage {
	levantamiento = []
	autopista: string = ''
	imagenA: string = ''
	imagenB: string = ''

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private autopistasService: AutopistasService) {
		this.levantamiento = navParams.get('levantamiento')
		this.autopista = navParams.get('autopista')
	}

	ionViewDidLoad() {
		this.getFotos()
	}

	/*
	Obtener las fotos del levantamiento.
	*/
	getFotos = () => {
		this.autopistasService.getFotos(this.levantamiento).then((response) => {
			this.imagenA = response[0].imagen
			this.imagenB = response[1].imagen
		}).catch(error => {
			console.error.bind(console)
		})
	}

}
