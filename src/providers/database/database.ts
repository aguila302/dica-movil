import {
	Injectable
} from '@angular/core';
import {
	Platform
} from 'ionic-angular';
import {
	SQLite,
	SQLiteObject
} from '@ionic-native/sqlite';
import {
	BehaviorSubject
} from 'rxjs/BehaviorSubject';

@Injectable()
export class DatabaseProvider {

	private database: SQLiteObject
	private dbReady = new BehaviorSubject < boolean > (false)
	public autopistasList = []

	constructor(private platform: Platform, private sqlite: SQLite) {
		this.platform.ready().then(() => {
			this.sqlite.create({
				name: 'dica.db',
				location: 'default'
			}).then((db: SQLiteObject) => {
				this.database = db

				this.createTables().then(() => {
					this.dbReady.next(true)
				})
			})
		})
	}

	private createTables() {
		return this.database.executeSql(
				`CREATE TABLE IF NOT EXISTS usuarios (
	        	id INTEGER PRIMARY KEY AUTOINCREMENT,
	        	name TEXT,
	        	email TEXT,
	        	access_token TEXT,
	        	expires_in TEXT,
	        	refresh_token TEXT,
	        	datetime DATETIME default current_timestamp);`, {}
			)
			.then(() => {
				return this.database.executeSql(
					`CREATE TABLE IF NOT EXISTS autopistas (
		        	id INTEGER PRIMARY KEY AUTOINCREMENT,
		        	nombre TEXT,
		        	cadenamiento_inicial_km INTEGER,
		        	cadenamiento_inicial_m INTEGER,
		        	cadenamiento_final_km INTEGER,
		        	cadenamiento_final_m INTEGER,
		        	user_id INTEGER,
  					FOREIGN KEY(user_id) REFERENCES usuarios(id));`, {}
				)
			})
	}

	private isReady() {
		return new Promise((resolve, reject) => {
			if (this.dbReady.getValue()) {
				resolve()
			} else {
				this.dbReady.subscribe((ready) => {
					if (ready) {
						resolve()
					}
				})
			}
		})
	}

	/* Registramos el token de acceso en el origen de datos movil. */
	setToken = (data) => {
		let parameters = [data.access_token, data.expires_in, data.refresh_token]
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`insert into usuarios (access_token, expires_in, refresh_token)
					values(?,?,?)`, parameters)
			})
	}

	/* Obtenemos el token de acceso. */
	getToken = () => {
		let userData = []
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`select * from usuarios order by 1 desc`, {})
					.then((result) => {
						for (let i = 0; i < result.rows.length; i++) {
							userData.push({
								access_token: result.rows.item(i).access_token,
								id: result.rows.item(i).id,
								name: result.rows.item(i).name,
								email: result.rows.item(i).email,
							})
						}
						return userData
					})
			})
	}

	/* Actualizamos los datos del usuario. */
	actualizarUser = (response, usuario) => {
		let parameters = [response.data.name, response.data.email, usuario.id]

		return this.isReady()
			.then(() => {
				return this.database.executeSql(`update usuarios set name = ?, email = ? where id = ?`, parameters)
			})
	}

	/* Eliminamos los token del origen de datos. */
	deleteToken = () => {
		return this.isReady().then(() => {
			return this.database.executeSql(`DELETE FROM usuarios`, {})
		})
	}

	/* Eliminamos los autopistas del origen de datos. */
	deleteAutopistas = () => {
		return this.isReady().then(() => {
			return this.database.executeSql(`DELETE FROM autopistas`, {})
		})
	}

	/* Registramos las autopistas de dicho usuario conectado. */
	registrarAutopistas = (autopistas, usuario) => {
		var miglobal = this
		return this.isReady()
			.then(() => {
				this.database.transaction(function(tx) {
					for (let item of autopistas) {
						let sql = `insert into autopistas (nombre, cadenamiento_inicial_km, cadenamiento_inicial_m, cadenamiento_final_km,
							cadenamiento_final_m, user_id) values (?,?,?,?,?,?);`
						tx.executeSql(sql, [item.nombre, item.cadenamiento_inicial_km, item.cadenamiento_inicial_m,
							item.cadenamiento_final_km, item.cadenamiento_final_m, usuario.id
						], function(tx, res) {
							this.autopistasList.push({
								'nombre': item.nombre
							})
						})
					}
				}).then(() => {
					console.log("Transaction Ok!")

				});

			})
	}

	/* Funcion para obtener un listado de las autopistas. */
	getAutopistas = (id) => {
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`select * from autopistas where user_id = ${id}`, {})
					.then((result) => {
						let autopistas = []
						for (let i = 0; i < result.rows.length; i++) {
							autopistas.push(result.rows.item(i))
						}
						return autopistas
					})

			})
	}
}
