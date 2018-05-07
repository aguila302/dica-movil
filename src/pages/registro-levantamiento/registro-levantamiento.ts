import {
	Component,
	OnInit,
	Directive
} from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	AlertController,
	LoadingController
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


@Component({
	selector: 'page-registro-levantamiento',
	templateUrl: 'registro-levantamiento.html'
})

export class RegistroLevantamientoPage {
	datosAutopista = {
		id: 0,
		nombre: '',
		cadenamientoInicialKm: 0,
		cadenamientoInicialm: 0,
		cadenamientoFinalKm: 0,
		cadenamientoFinalm: 0,
	}

	cuerpos = []
	elementos = []
	condiciones = []
	carriles = []
	subelementos = []
	form: FormGroup

	url: string = ''
	imagenA: string
	imagenB: string
	base64imageA: string
	base64imageB: string
	fotos = []
	loader: any

	options: CameraOptions = {
		quality: 100,
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.JPEG,
		mediaType: this.camera.MediaType.PICTURE,
	}


	constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
		private camera: Camera, private autopistasService: AutopistasService, public alert: AlertController,
		private base64ToGallery: Base64ToGallery, public loadingCtrl: LoadingController) {

		/* Obtiene los datos generaes de la autopista. */
		console.log(this.navParams.get('autopista'))

		this.datosAutopista.id = this.navParams.get('autopista').autopista_id
		this.datosAutopista.nombre = this.navParams.get('autopista').nombre
		this.datosAutopista.cadenamientoInicialKm = this.navParams.get('autopista').cadenamiento_inicial_km
		this.datosAutopista.cadenamientoInicialm = this.navParams.get('autopista').cadenamiento_inicial_m
		this.datosAutopista.cadenamientoFinalKm = this.navParams.get('autopista').cadenamiento_final_km
		this.datosAutopista.cadenamientoFinalm = this.navParams.get('autopista').cadenamiento_final_m
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

			cadenamientoInicialKm: new FormControl('', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.min(this.datosAutopista.cadenamientoInicialKm),
				Validators.max(this.datosAutopista.cadenamientoFinalKm),
			])),
			cadenamientoInicialm: new FormControl('', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.min(this.datosAutopista.cadenamientoInicialm),

			])),

			cadenamientoFinalKm: new FormControl('', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.min(this.datosAutopista.cadenamientoInicialKm),
				Validators.max(this.datosAutopista.cadenamientoFinalKm),
			])),
			cadenamientoFinalm: new FormControl('', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.max(this.datosAutopista.cadenamientoFinalm),
			])),

			reportar: new FormControl(false, Validators.required),
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
		this.loader = this.loadingCtrl.create({
			content: 'Guardando información por favor espera',
		});
		this.loader.present();
		// Guardamos la informacion del levantamiento en el origen de datos.
		this.autopistasService.guardaLevantamiento(this.form.controls, this.datosAutopista.id).then((response) => {
			/* Almacenamos la imagen en el dispositivo movil. */
			response.rowsAffected === 1 ? this.guardaImagen(this.base64imageA, this.base64imageB, response.insertId) : ''
		})
	}

	/* Muestra la camara para la toma de fotos. */
	tomaFotoA = () => {
		this.camera.getPicture(this.options).then((imageData) => {
			/* Obtenemos la imagen y la mostramos en la vista. */
			this.imagenA = 'data:image/jpeg;base64,' + imageData
			this.base64imageA = imageData

		}).catch(err => console.error.bind(console))
	}
	tomaFotoB = () => {
		this.camera.getPicture(this.options).then((imageData) => {
			/* Obtenemos la imagen y la mostramos en la vista. */
			this.imagenB = 'data:image/jpeg;base64,' + imageData
			this.base64imageB = imageData

		}).catch(err => console.error.bind(console))
	}

	/* Guardamos la imagen en dispositivo movil. */
	guardaImagen(fotoA, fotoB, levantamientoId) {
		this.base64ToGallery.base64ToGallery(fotoA).then((res) => {
			console.log(res)
			/* Guardamos la url de la imagen y el id de levantamiento en el origen de datos. */
			this.autopistasService.guardaImagen(res, levantamientoId)
				.then((response) => {
					console.log(response)
				})
			setTimeout(() => {
				this.base64ToGallery.base64ToGallery(fotoB).then((res1) => {
					console.log(res1)
					this.autopistasService.guardaImagen(res1, levantamientoId)
						.then((response) => {
							console.log(response)
							this.loader.dismiss()
							this.confirmarRegistro()
						})
				})
			}, 2000)

		})
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
