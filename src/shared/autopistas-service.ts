import {
	Injectable
} from '@angular/core';
import {
	DatabaseProvider
} from '../providers/database/database'

@Injectable()
export class AutopistasService {

	public userId: number

	constructor(public database: DatabaseProvider) {}

	/* Obtenemos el listado de las autopistas de dicho usuario. */
	public getAutopistas() {
		return this.database.getAutopistas(this.userId)
	}

}
