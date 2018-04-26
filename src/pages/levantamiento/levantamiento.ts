import {
	Component,
	OnInit,
	Directive
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	AlertController
} from 'ionic-angular';
import {
	Validators,
	FormBuilder,
	FormGroup,
	FormControl,
	AbstractControl,
	NG_VALIDATORS,
	ValidatorFn
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
import * as account from 'accounting-js'


@IonicPage()
@Component({
	selector: 'page-levantamiento',
	templateUrl: 'levantamiento.html',
})

export class LevantamientoPage implements OnInit {
	autopista: number = 0
	cuerpos = []
	elementos = []
	condiciones = []
	carriles = []
	subelementos = []
	form: FormGroup
	formSubmit: boolean = false
	errorCadenamientoInicialKm: boolean = false
	errorCadenamientoFinalKm: boolean = false
	public base64Image: string
	options: CameraOptions = {
		quality: 100,
		destinationType: this.camera.DestinationType.FILE_URI,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE,
		allowEdit: true,
		sourceType: this.camera.PictureSourceType.CAMERA,
		saveToPhotoAlbum: true,
		targetWidth: 200,
		targetHeight: 100
	}

	constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
		private camera: Camera, private autopistasService: AutopistasService, public alert: AlertController) {

		/* Obtiene el id de autopista actual. */
		this.autopista = this.navParams.get('autopista').autopista_id
	}

	ngOnInit(): void {

		/* Inicia los controles del formulario. */
		this.form = new FormGroup({
			cuerpo: new FormControl('', Validators.required),
			elemento: new FormControl('', Validators.required),
			tipoElemento: new FormControl('', Validators.required),
			condicionFisica: new FormControl('', Validators.required),
			carril: new FormControl('', Validators.required),
			longitudElemento: new FormControl('', Validators.required),

			cadenamientoInicialKm: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
			cadenamientoInicialm: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),

			cadenamientoFinalKm: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
			cadenamientoFinalm: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),

			reportar: new FormControl('', Validators.required),
			statusLevantamiento: new FormControl('', Validators.required)
		})

	}

	/* Inizializa los catalogos. */
	ionViewDidLoad() {
		console.log('ionViewDidLoad LevantamientoPage')
		/* Cargamos los catalogos para los controles. */
		this.getCuerpos()
		this.getElementos()
		this.getCondiciones()
		this.getCarriles()

	}

	get cuerpo() {
		return this.form.get('cuerpo')
	}

	get longitudElemento() {
		return this.form.get('longitudElemento')
	}
	get elemento() {
		return this.form.get('elemento')
	}
	get tipoElemento() {
		return this.form.get('tipoElemento')
	}
	get condicionFisica() {
		return this.form.get('condicionFisica')
	}
	get carril() {
		return this.form.get('carril')
	}
	get cadenamientoInicialKm() {
		return this.form.get('cadenamientoInicialKm')
	}
	get cadenamientoInicialm() {
		return this.form.get('cadenamientoInicialm')
	}
	get cadenamientoFinalKm() {
		return this.form.get('cadenamientoFinalKm')
	}
	get cadenamientoFinalm() {
		return this.form.get('cadenamientoFinalm')
	}
	get reportar() {
		return this.form.get('reportar')
	}
	get statusLevantamiento() {
		return this.form.get('statusLevantamiento')
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

	/* Realiza en submit y validamos los datos del formulario. */
	submitEvent = () => {
		this.formSubmit = true

		/* Validar cadenamiento final e inicial (Km). */
		parseInt(this.form.controls.cadenamientoFinalKm.value) < parseInt(this.form.controls.cadenamientoInicialKm.value) ? (
			this.errorCadenamientoFinalKm = true,
			this.errorCadenamientoInicialKm = false
		) : (
			this.errorCadenamientoFinalKm = false,
			this.errorCadenamientoInicialKm = false
		)

		/* Guardamos la informacion en el origen de datos. */
		if (this.form.status === 'VALID' && this.errorCadenamientoFinalKm === false) {
			this.autopistasService.guardaLevantamiento(this.form.controls, this.autopista).then((response) => {
				response.rowsAffected === 1 ? this.confirmarRegistro() : ''
			})
		}
	}

	/* Muestra la camara. */
	mostrarCamara = () => {
		this.camera.getPicture(this.options).then((imageData) => {
			// this.base64Image = 'data:image/jpeg;base64,' + imageData;
			this.base64Image = imageData
			console.log(this.base64Image)

		}, (err) => {});
	}

	/* Confirma el registro del levantamiento. */
	confirmarRegistro = () => {
		let alert = this.alert.create({
			title: 'Registro de levantamiento!',
			subTitle: 'El levantamiento se registro exitosamente!',
		});
		alert.present()
		setTimeout(() => {
			alert.dismiss()
		}, 3000)
	}
}
