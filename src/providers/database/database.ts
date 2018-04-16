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
import * as collect from 'collect.js/dist'

@Injectable()
export class DatabaseProvider {

	private database: SQLiteObject
	private dbReady = new BehaviorSubject < boolean > (false)

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
	        	usuario_id INTEGER,
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
			        	autopista_id INTEGER,
			        	nombre TEXT,
			        	cadenamiento_inicial_km INTEGER,
			        	cadenamiento_inicial_m INTEGER,
			        	cadenamiento_final_km INTEGER,
			        	cadenamiento_final_m INTEGER,
			        	user_id INTEGER,
	  					FOREIGN KEY(user_id) REFERENCES usuarios(id));`, {}
				).then(() => {
					return this.database.executeSql(
						`CREATE TABLE IF NOT EXISTS elementos (
				        	id INTEGER PRIMARY KEY AUTOINCREMENT,
				        	elemento_id INTEGER,
				        	descripcion TEXT);`, {}
					).then(() => {
						return this.database.executeSql(
							`CREATE TABLE IF NOT EXISTS cuerpos (
				        	id INTEGER PRIMARY KEY AUTOINCREMENT,
				        	cuerpo_id INTEGER,
				        	descripcion TEXT);`, {}
						)
					})
				})
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
		let parameters = [response.name, response.email, response.id, usuario.id]

		return this.isReady()
			.then(() => {
				return this.database.executeSql(`update usuarios set name = ?, email = ?, usuario_id = ? where id = ?`, parameters)
			})
	}

	/* Elimina el origen de datos movil. */
	deleteDatabase = () => {
		return this.isReady().then(() => {

			return this.sqlite.deleteDatabase({
				name: 'dica.db',
				location: 'default'
			}).then(() => console.log('Database eleiminada'))
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
	registrarAutopistas(autopistas, usuario) {
		return this.isReady()
			.then(() => {
				autopistas.forEach(item => {
					let sql = `insert into autopistas (autopista_id, nombre, cadenamiento_inicial_km, cadenamiento_inicial_m, cadenamiento_final_km,
							cadenamiento_final_m, user_id) values (?,?,?,?,?,?,?);`
					this.database.executeSql(sql, [item.id, item.nombre, item.cadenamiento_inicial_km, item.cadenamiento_inicial_m,
						item.cadenamiento_final_km, item.cadenamiento_final_m, usuario.id
					])
				}, this)

				return autopistas
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

	/* Registramos los elementos. */
	registrarElementos = (elementos) => {
		return this.isReady()
			.then(() => {
				elementos.forEach(item => {
					let sql = `insert into elementos (elemento_id, descripcion) values (?,?);`
					this.database.executeSql(sql, [item.id, item.descripcion])
				}, this)

				return elementos
			})

	}

	/* Funcion para obtener un listado de elementos. */
	getElementos = () => {
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`select elemento_id, descripcion from elementos`, {})
					.then((result) => {
						let elementos = []
						for (let i = 0; i < result.rows.length; i++) {
							elementos.push({
								elemento_id: result.rows.item(i).elemento_id,
								descripcion: result.rows.item(i).descripcion
							})
						}

						return elementos
					})

			})
	}

	/* Registramos los cuerpos. */
	registrarCuerpos = (cuerpos) => {
		return this.isReady()
			.then(() => {
				cuerpos.forEach(item => {
					let sql = `insert into cuerpos (cuerpo_id, descripcion) values (?,?);`
					this.database.executeSql(sql, [item.id, item.descripcion])
				}, this)

				return cuerpos
			})

	}

	/* Funcion para obtener un listado de cuerpos. */
	getCuerpos = () => {
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`select cuerpo_id, descripcion from cuerpos`, {})
					.then((result) => {
						let cuerpos = []
						for (let i = 0; i < result.rows.length; i++) {
							cuerpos.push({
								cuerpo_id: result.rows.item(i).cuerpo_id,
								descripcion: result.rows.item(i).descripcion
							})
						}
						return Promise.resolve(cuerpos)
					})

			})
	}
}
