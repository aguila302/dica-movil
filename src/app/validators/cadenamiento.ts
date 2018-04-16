import {
	FormControl
} from '@angular/forms';

export class CadenamientoValidator {

	static isValid(control: FormControl): any {
		if (control.value < 188) {
			return {
				"too young": true
			};
		}
		return null
	}

}
