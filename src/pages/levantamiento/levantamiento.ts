import {
	Component
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams
} from 'ionic-angular';
import {
	Validators,
	FormBuilder,
	FormGroup,
	FormControl
} from '@angular/forms';
import {
	Camera,
	CameraOptions
} from '@ionic-native/camera';
import {
	CustomValidators
} from 'ng2-validation';
import {
	AutopistasService
} from '../../shared/autopistas-service';


@IonicPage()
@Component({
	selector: 'page-levantamiento',
	templateUrl: 'levantamiento.html',
})
export class LevantamientoPage {

	private dataLevantamiento: FormGroup
	public base64Image: string
	cuerpos = []
	elementos = []
	condiciones = []
	carriles = []
	subelementos = []

	options: CameraOptions = {
		quality: 100,
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE,
		targetWidth: 200,
		targetHeight: 100
	}

	constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
		private camera: Camera, private autopistasService: AutopistasService) {

		this.dataLevantamiento = this.formBuilder.group({
			cuerpo: ['', Validators.required],
			elemento: ['', Validators.required],
			tipoElemento: ['', Validators.required],
			condicionFisica: ['', Validators.required],
			carril: ['', Validators.required],
			longitudElemento: ['', Validators.required],
			cadenamientoInicialKm: ['', Validators.required],
			cadenamientoInicialm: ['', Validators.required],

			cadenamientoFinalKm: ['', Validators.required],
			cadenamientoFinalm: ['', Validators.required],
			reportar: ['', Validators.required],
			statusLevantamiento: ['', Validators.required]
		})
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LevantamientoPage')
		this.getCuerpos()
		this.getElementos()
		this.getCondiciones()
		this.getCarriles()
	}

	/* Obtiene un listado de cuerpos del origen de datos movil. */
	getCuerpos = () => {
		this.autopistasService.getCuerpos().then((response) => {
			this.cuerpos = response
		})

	}

	/* Obtiene un listado de elementos del origen de datos movil. */
	getElementos = () => {
		this.autopistasService.getElementos().then((response) => {
			this.elementos = response
		})

	}

	/* Obtiene un listado de condiciones del origen de datos movil. */
	getCondiciones = () => {
		this.autopistasService.getCondiciones().then((response) => {
			this.condiciones = response
		})

	}

	/* Obtiene un listado de carriles del origen de datos movil. */
	getCarriles = () => {
		this.autopistasService.getCarriles().then((response) => {
			this.carriles = response
		})

	}

	/* Muestra los sub elementos de un elemento seleccionado. */
	muestraSubElementos = (event: any) => {

		this.autopistasService.getSubElemento(event).then((response) => {
			this.subelementos = response
		})
	}

	// mostrarCamara = () => {
	// 	this.camera.getPicture(this.options).then((imageData) => {

	// 		// imageData is either a base64 encoded string or a file URI
	// 		// If it's base64:
	// 		this.base64Image = 'data:image/jpeg;base64,' + imageData;
	// 	}, (err) => {
	// 		// Handle error
	// 	});
	// }

	logForm = () => {
		console.log(this.dataLevantamiento.value)
	}

}
