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
import {
	Base64ToGallery
} from '@ionic-native/base64-to-gallery';
import {
	PhotoLibrary
} from '@ionic-native/photo-library';


@Component({
	selector: 'page-registro-levantamiento',
	templateUrl: 'registro-levantamiento.html'
})
export class RegistroLevantamientoPage {

	idAutopista: number = 0
	nombreAutopista: string = ''
	cuerpos = []
	elementos = []
	condiciones = []
	carriles = []
	subelementos = []
	form: FormGroup
	formSubmit: boolean = false
	errorCadenamientoInicialKm: boolean = false
	errorCadenamientoFinalKm: boolean = false
	url: string = ''
	imagen: string
	base64image: string
	options: CameraOptions = {
		quality: 100,
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE,
		targetWidth: 200,
		targetHeight: 100
	}


	constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
		private camera: Camera, private autopistasService: AutopistasService, public alert: AlertController,
		private base64ToGallery: Base64ToGallery, private photoLibrary: PhotoLibrary) {

		/* Obtiene el id de autopista actual. */
		console.log(this.navParams.get('autopista'))

		this.idAutopista = this.navParams.get('autopista').autopista_id
		this.nombreAutopista = this.navParams.get('autopista').nombre
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
			this.autopistasService.guardaLevantamiento(this.form.controls, this.idAutopista).then((response) => {
				/* Almacenamos la imagen en el dispositivo movil. */
				this.guardaImagen(this.base64image, response.insertId)

				response.rowsAffected === 1 ? this.confirmarRegistro() : ''

			})
		}
	}

	/* Muestra la camara para la toma de fotos. */
	mostrarCamara = () => {
		this.camera.getPicture(this.options).then((imageData) => {
			/* Obtenemos la imagen y la mostramos en la vista. */
			this.imagen = 'data:image/jpeg;base64,' + imageData;
			this.base64image = imageData

		}).catch(err => console.error.bind(console))
	}

	/* Guardamos la imagen en dispositivo movil. */
	guardaImagen = (base64, levantamientoId) => {
		this.base64ToGallery.base64ToGallery(base64, {
			prefix: 'img_',
			mediaScanner: true
		}).then(
			res => {
				/* Guardamos la url de la imagen y el id de levantamiento en el origen de datos. */
				this.autopistasService.guardaImagen(res, levantamientoId).then((response) => {
					console.log(response)
				})
			},
			err => console.log(err)
		).catch(err => console.error.bind(console))
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
