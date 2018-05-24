/**
 * Clase generada para PopoverPage.
 * Autor: Alfonso Hernández Montoya.
 * Fecha de creación: 24 Mayo 2018.
 * Descripción: Componente para la funcionalidad de sincronización de todos los levantamientos de una autopista.
 * Modifico: Alfonso Hernández Montoya.
 * Fecha modificación: 24 Mayo 2018.
 */

import {
	Component
} from '@angular/core';
import {
	IonicPage,
	ViewController
} from 'ionic-angular'

@IonicPage()
@Component({
	selector: 'page-popover',
	templateUrl: 'popover.html',
})
export class PopoverPage {

	constructor(public viewCtrl: ViewController) {

	}

	/**
	 * Funcion para sincronizar los levantamientos de una autopista.
	 */
	async sincronizar() {
		this.viewCtrl.dismiss({
			sincronzar: true
		});
	}
}
