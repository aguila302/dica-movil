import {
	Component
} from '@angular/core';
import {
	NavController,
	NavParams
} from 'ionic-angular';
import {
	LoginPage
} from '../login/login';
import {
	NativeStorage
} from '@ionic-native/native-storage';
import {
	DatabaseProvider
} from '../../providers/database/database'

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	constructor(public navCtrl: NavController, private navs: NavParams, private nativeStorage: NativeStorage,
		private databaseProvider: DatabaseProvider) {
		this.databaseProvider.getToken()
			.then(data => {
				if (data.length) {
					this.nativeStorage.setItem('auth', true).then(
						() => console.log('Stored item!'),
						error => console.error('Error storing item', error)
					)
				} else {
					this.navCtrl.setRoot(LoginPage, {})
				}

			})
	}

	ionViewDidLoad() {}

	/* Funcion para cerrar sesion en la aplicación */
	logout = () => {
		/* Eliminamos todos los token del origen de datos */
		this.databaseProvider.deleteToken().then((response) => {
			this.nativeStorage.remove('auth').then((data) => {
				console.log('removed')
				console.log(data)
				this.navCtrl.setRoot(LoginPage, {})

			})
		})
	}
}
