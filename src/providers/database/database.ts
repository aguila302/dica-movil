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

	constructor(private platform: Platform, private sqlite: SQLite) {
		this.platform.ready().then(() => {
			this.sqlite.create({
				name: 'dica.db',
				location: 'default'
			}).then((db: SQLiteObject) => {
				this.database = db
				// this.sqlitePorter.exportDbToSql(this.database)
				// 	.then((res) => console.log(res))
				// 	.catch(e => console.error(e))

				this.createTables().then((res) => {
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
						).then(() => {
							return this.database.executeSql(
								`CREATE TABLE IF NOT EXISTS subelementos (
				        	id INTEGER PRIMARY KEY AUTOINCREMENT,
				        	subelemento_id INTEGER,
				        	descripcion_subelemento TEXT,
				        	elemento_id INTEGER);`, {}
							).then(() => {
								return this.database.executeSql(
									`CREATE TABLE IF NOT EXISTS condiciones (
				        	id INTEGER PRIMARY KEY AUTOINCREMENT,
				        	condicion_id INTEGER,
				        	descripcion TEXT);`, {}
								).then(() => {
									return this.database.executeSql(
										`CREATE TABLE IF NOT EXISTS carriles (
				        	id INTEGER PRIMARY KEY AUTOINCREMENT,
				        	carril_id INTEGER,
				        	descripcion TEXT);`, {}
									).then(() => {
										return this.database.executeSql(
											`CREATE TABLE IF NOT EXISTS levantamientos (
				        	id INTEGER PRIMARY KEY AUTOINCREMENT,
				        	autopista_id INTEGER,
				        	cuerpo_id INTEGER,
				        	elemento_id INTEGER,
				        	tipo_elemento_id INTEGER,
				        	coondicion_id INTEGER,
				        	carril_id INTEGER,
				        	longitud_elemento NUMERIC,
				        	cadenamiento_inicial_km NUMERIC,
				        	cadenamiento_inicial_m NUMERIC,
				        	cadenamiento_final_km NUMERIC,
				        	cadenamiento_final_m NUMERIC,
				        	reportar NUMERIC,
				        	estatus NUMERIC);`, {}
										).then(() => {
											return this.database.executeSql(
												`CREATE TABLE IF NOT EXISTS levantamiento_imagen (
				        	id INTEGER PRIMARY KEY AUTOINCREMENT,
				        	levantamiento_id INTEGER,
				        	imagen TEXT,
				        	FOREIGN KEY(levantamiento_id) REFERENCES levantamientos(id));`, {}
											)

										})
									})
								})
							})
						})
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

	/* Limpiamos los datos . */
	resetDatabase = () => {
		return this.isReady().then(() => {
			return this.database.executeSql(`DELETE FROM usuarios;`, {})
				.then(() => {
					return this.database.executeSql(`DELETE FROM autopistas;`, {})
						.then(() => {
							return this.database.executeSql(`DELETE FROM cuerpos;`, {})
								.then(() => {
									return this.database.executeSql(`DELETE FROM subelementos;`, {})
										.then(() => {
											return this.database.executeSql(`DELETE FROM elementos;`, {})
												.then(() => {
													return this.database.executeSql(`DELETE FROM condiciones;`, {})
														.then(() => {
															return this.database.executeSql(`DELETE FROM carriles;`, {})
														})
												})
										})
								})
						})
				})
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
						elementos.splice(0, elementos.length)
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
						return cuerpos
					})

			})
	}

	/* Registramos los subelementos. */
	registrarSubElementos = (subelementos) => {
		return this.isReady()
			.then(() => {
				subelementos.forEach(item => {
					let sql = `insert into subelementos (subelemento_id, descripcion_subelemento, elemento_id) values (?,?,?);`
					this.database.executeSql(sql, [item.id, item.descripcion, item.elemento.data.id])
				}, this)

				return subelementos
			})

	}

	/* Funcion para obtener un listado de subelementos. */
	getSubElemento = (event) => {
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`select subelemento_id, descripcion_subelemento from subelementos where elemento_id = ?`, [event])
					.then((result) => {
						let subelementos = []
						for (let i = 0; i < result.rows.length; i++) {
							subelementos.push({
								subelemento_id: result.rows.item(i).subelemento_id,
								descripcion_subelemento: result.rows.item(i).descripcion_subelemento
							})
						}
						return Promise.resolve(subelementos)
					})

			})
	}

	/* Registramos las condiciones. */
	registrarCondiciones = (condiciones) => {
		return this.isReady()
			.then(() => {
				condiciones.forEach(item => {
					let sql = `insert into condiciones (condicion_id, descripcion) values (?,?);`
					this.database.executeSql(sql, [item.id, item.descripcion])
				}, this)

				return condiciones
			})
	}

	/* Funcion para obtener un listado de cuerpos. */
	getCondiciones = () => {
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`select condicion_id, descripcion from condiciones`, {})
					.then((result) => {
						let condiciones = []
						for (let i = 0; i < result.rows.length; i++) {
							condiciones.push({
								condicion_id: result.rows.item(i).condicion_id,
								descripcion: result.rows.item(i).descripcion
							})
						}
						return condiciones
					})

			})
	}

	/* Registramos las condiciones. */
	registrarCarriles = (carriles) => {
		return this.isReady()
			.then(() => {
				carriles.forEach(item => {
					let sql = `insert into carriles (carril_id, descripcion) values (?,?);`
					this.database.executeSql(sql, [item.id, item.descripcion])
				}, this)

				return carriles
			})
	}


	/* Funcion para obtener un listado de los carriles. */
	getCarriles = () => {
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`select carril_id, descripcion from carriles`, {})
					.then((result) => {
						let carriles = []
						for (let i = 0; i < result.rows.length; i++) {
							carriles.push({
								carril_id: result.rows.item(i).carril_id,
								descripcion: result.rows.item(i).descripcion
							})
						}
						return carriles
					})

			})
	}

	/* Registramos levantamientos en el origen de datos movil. */
	registrarInventarios = (levantamiento) => {
		return this.isReady()
			.then(() => {
				let sql = `insert into levantamientos (autopista_id, cuerpo_id, elemento_id, tipo_elemento_id, coondicion_id, carril_id,
				        	longitud_elemento, cadenamiento_inicial_km, cadenamiento_inicial_m, cadenamiento_final_km,
				        	cadenamiento_final_m, reportar, estatus) values (?,?,?,?,?,?,?,?,?,?,?,?,?);`
				return this.database.executeSql(sql, [levantamiento.autopista, levantamiento.cuerpo, levantamiento.elemento,
					levantamiento.tipoElemento, levantamiento.condicion, levantamiento.carril, levantamiento.longitudElemento,
					levantamiento.cadenamientoInicialKm, levantamiento.cadenamientoInicialm, levantamiento.cadenamientoFinalKm,
					levantamiento.cadenamientoFinalm, levantamiento.reportar, levantamiento.statusLevantamiento
				])
			}).catch(console.error.bind(console))

	}

	/* Registrar imagen y levantamiento. */
	registrarImagenes = (url, id) => {
		return this.isReady()
			.then(() => {
				let sql = `insert into levantamiento_imagen (levantamiento_id, imagen) values (?,?);`
				return this.database.executeSql(sql, [id, url])
			})
	}

	/* Obtiene un listado de levantamientos registrados de una autopista. */
	listadoLevantamientos = (id: number) => {
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`
					select a.id, a.elemento_id, b.descripcion as elemento_descripcion, a.estatus as seguimiento,
					a.cadenamiento_inicial_km || ' + ' || a.cadenamiento_inicial_m as cadenamiento_inicial,
					a.cadenamiento_final_km || ' + ' || a.cadenamiento_final_m as cadenamiento_final,
					c.descripcion as cuerpo_descripcion, e.descripcion as condicion_descripcion,
					d.descripcion_subelemento, f.descripcion as carril_descripcion, a.longitud_elemento, a.reportar, a.estatus
					from levantamientos as a
					INNER JOIN elementos as b on a.elemento_id = b.elemento_id
					INNER JOIN cuerpos as c on a.cuerpo_id = c.cuerpo_id
					INNER JOIN subelementos as d on a.tipo_elemento_id = d.subelemento_id
					INNER JOIN condiciones as e on a.coondicion_id = e.condicion_id
					INNER JOIN carriles as f on a.carril_id = f.carril_id
					where a.autopista_id = ? order by a.id ASC`, [id])
					.then((result) => {
						let levantamientos = []
						for (let i = 0; i < result.rows.length; i++) {
							levantamientos.push({
								id: result.rows.item(i).id,
								elemento_id: result.rows.item(i).elemento_id,
								elemento: result.rows.item(i).elemento_descripcion,
								seguimiento: result.rows.item(i).seguimiento,
								cadenamientoInicial: result.rows.item(i).cadenamiento_inicial,
								cadenamientoFinal: result.rows.item(i).cadenamiento_final,
								cuerpo: result.rows.item(i).cuerpo_descripcion,
								subelemento: result.rows.item(i).descripcion_subelemento,
								condicion: result.rows.item(i).condicion_descripcion,
								carril: result.rows.item(i).carril_descripcion,
								longitudElemento: result.rows.item(i).longitud_elemento,
								reportar: result.rows.item(i).reportar,
								estatus: result.rows.item(i).estatus,
							})
						}
						return levantamientos
					})

			})
	}
	/* Obtiene la url de las fotos de un levantamiento. */
	getFotos = (id: number) => {
		return this.isReady()
			.then(() => {
				return this.database.executeSql(`select imagen from levantamiento_imagen where levantamiento_id = ?`, [id])
					.then((result) => {
						let fotos = []
						for (let i = 0; i < result.rows.length; i++) {
							fotos.push({
								imagen: result.rows.item(i).imagen
							})
						}
						return fotos
					})

			})
	}
}
