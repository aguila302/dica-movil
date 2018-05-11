import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ViewController
} from 'ionic-angular';
import {
	AutopistasService
} from '../../shared/autopistas-service';

@IonicPage()
@Component({
	selector: 'page-opciones-autopista',
	templateUrl: 'opciones-autopista.html',
})
export class OpcionesAutopistaPage {


	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
		private autopistasService: AutopistasService) {
		this.autopistasService.autopistaActiva = null
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad OpcionesAutopistaPage');
	}

	/* Opcion para registrar un nuevo levantamiento. */
	nuevoLevantamiento = () => {
		let opcion = {
			opcion: 'Nuevo levantamiento'
		};
		this.viewCtrl.dismiss(opcion);
	}

	/* Opcion para consultar levantamientos registrados. */
	consultarLevantamiento = () => {
		let opcion = {
			opcion: 'Consultar levantamientos'
		};
		this.viewCtrl.dismiss(opcion);
	}
}
