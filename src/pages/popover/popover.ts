import {
	Component
} from '@angular/core';
import {
	IonicPage,
	ViewController
} from 'ionic-angular'

@IonicPage()
@Component({
	selector: 'page-popover',
	templateUrl: 'popover.html',
})
export class PopoverPage {

	constructor(public viewCtrl: ViewController) {

	}

	/**
	 * Funcion para sincronizar los levantamientos de una autopista.
	 */
	async sincronizar() {
		this.viewCtrl.dismiss({
			sincronzar: true
		});
	}
}
