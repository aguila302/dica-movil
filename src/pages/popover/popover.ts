import {
	Component,
	ViewChild
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ViewController
} from 'ionic-angular';
import {
	DespliegueProvider
} from '../../providers/despliegue/despliegue'
import {
	DespliegueLevantamientoPage
} from '../../pages/despliegue-levantamiento/despliegue-levantamiento';


@IonicPage()
@Component({
	selector: 'page-popover',
	templateUrl: 'popover.html',
})
export class PopoverPage {


	levantamientos = []
	sincronizados = []

	constructor(public viewCtrl: ViewController, private nav: NavParams, private despliegue: DespliegueProvider) {
		/* Obtiene los levantamientos a sincronizar. */
		this.levantamientos = this.nav.get('levantamientos')
	}

	/**
	 * Funcion para sincronizar los levantamientos de una autopista.
	 */
	async sincronizar() {
		var miGlobal = this
		this.viewCtrl.dismiss({
			sincronzar: true
		});
		// this.despliegue.sincronizar(this.levantamientos).then((response) => {
		// 	console.log(' mi response')
		// 	console.log(response)
		// 	this.sincronizados = response
		// })
	}
}