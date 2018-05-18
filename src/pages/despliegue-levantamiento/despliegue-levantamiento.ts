import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	AlertController,
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
} from '../../pages/popover/popover'

@IonicPage()
@Component({
	selector: 'page-despliegue-levantamiento',
	templateUrl: 'despliegue-levantamiento.html',
})
export class DespliegueLevantamientoPage {

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private autopistasService: AutopistasService, public alert: AlertController,
		private popoverCtrl: PopoverController, private despliegue: DespliegueProvider) {

		/* Obtiene los datos generaes de la autopista. */
		this.datosAutopista.id = this.navParams.get('autopista').autopista_id
		this.datosAutopista.nombre = this.navParams.get('autopista').nombre
	}

	levantamientos = []
	sincronizados = {}

	public datosAutopista = {
		id: 0,
		nombre: '',
	}

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
			console.log(this.levantamientos);

		})
	}

	/* Muestra la opcion para sincronizar todos los levantamientos. */
	popover = (event: any) => {
		let popover = this.popoverCtrl.create(PopoverPage, {})
		popover.onDidDismiss(data => {
			data !== null ? (
				this.levantamientos.map(item => {
					item['estatusApi'] = ''
					item['data'] = {}
					this.despliegue.sincronizar(item).then((response) => {
						this.sincronizados = response
						item.estatusApi = response['status']
						item.data = response['data']
					})
				}),
				console.log(this.levantamientos)
			) : ''
		})
		popover.present({
			ev: event
		})
	}

	personTrackByFn(index: number, person) {
		return person.data.id;
	}

}
