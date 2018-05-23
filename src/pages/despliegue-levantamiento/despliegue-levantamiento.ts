import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	AlertController,
	PopoverController,
	LoadingController
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
		private popoverCtrl: PopoverController, private despliegue: DespliegueProvider, private loadingCtrl: LoadingController) {

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
		})
	}

	/* Muestra la opcion para sincronizar todos los levantamientos. */
	popover = (event: any) => {
		let popover = this.popoverCtrl.create(PopoverPage, {})
		let loading = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Sincronizando, por favor espera...'
		})

		popover.onDidDismiss(data => {
			data !== null ? (
				/*
				Itera los levantamientos y los va sincronizando al end point del api.
				 */
				loading.present(),

				this.levantamientos.map(item => {
					item['estatusApi'] = ''
					item['data'] = {}

					/* Obtiene las fotografias de un levantamiento. */
					this.despliegue.sincronizar(item).then((response) => {
						item.estatusApi = response['status']
						item.data = response['data']

						/* Obtiene las fotografias de los levantamientos. */
						response['status'] === 200 ? (
							/* Obtiene la url de las fotografias en el origen de datos. */
							this.autopistasService.getFotografias(item.id).then((fotos) => {
								fotos.forEach(foto => {
									/* Inicia la transferencia de las fotografias. */
									this.transfiereFotos(foto.imagen, item.data.id)
								})
							})
						) : ''

					})
					loading.dismiss()

				}),
				console.log(this.levantamientos)

			) : ''
		})

		/* Muestra el popover para sincronizar los levantamientos. */
		popover.present({
			ev: event
		})
	}

	/**
	 * Transfiere las fotografias de un levantamiento.
	 */
	transfiereFotos = (path, levantamiento) => {
		this.despliegue.transfiereFotos(path, levantamiento)
	}
}
