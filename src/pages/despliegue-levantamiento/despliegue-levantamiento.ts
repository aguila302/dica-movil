import {
	Component,
	ViewChild,
	Input,
	AfterViewInit
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	AlertController,
	ViewController,
	PopoverController
} from 'ionic-angular';

import {
	AutopistasService
} from '../../shared/autopistas-service';
import {
	DespliegueProvider
} from '../../providers/despliegue/despliegue'
import {
	PopoverPage
} from '../../pages/popover/popover';

@IonicPage()
@Component({
	selector: 'page-despliegue-levantamiento',
	templateUrl: 'despliegue-levantamiento.html',
})
export class DespliegueLevantamientoPage {

	constructor(public navCtrl: NavController, public navParams: NavParams,
			private autopistasService: AutopistasService, public alert: AlertController,
			private popoverCtrl: PopoverController) {

			/* Obtiene los datos generaes de la autopista. */
			this.datosAutopista.id = this.navParams.get('autopista').autopista_id
			this.datosAutopista.nombre = this.navParams.get('autopista').nombre
		}
		// @ViewChild(PopoverPage) popoverPage: PopoverPage

	levantamientos = []
		// public sincronizados = []

	public datosAutopista = {
		id: 0,
		nombre: '',
	}

	// ngAfterViewInit() {
	// 	console.log('ngAfterViewInit')

	// 	// console.log(this.popoverPage.sincronizados)
	// }

	ionViewDidLoad() {
		console.log('ionViewDidLoad DespliegueLevantamientoPage')
		this.listadoLevantamientos()
	}

	/*
	Obtiene una lista de vantamientos de una autopista.
	 */
	listadoLevantamientos = () => {
		this.autopistasService.listadoLevantamientos(this.datosAutopista.id).then(levantamientos => {
			this.levantamientos = levantamientos

		})
	}

	/* Muestra la opcion para sincronizar todos los levantamientos. */
	popover = (event: any) => {
		let popover = this.popoverCtrl.create(PopoverPage, {
			levantamientos: this.levantamientos
		})
		popover.onDidDismiss(data => {
			data !== null ? console.log('ok') : ''


		})
		popover.present({
			ev: event
		})
	}
}