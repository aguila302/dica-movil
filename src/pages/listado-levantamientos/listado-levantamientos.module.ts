import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoLevantamientosPage } from './listado-levantamientos';

@NgModule({
  declarations: [
    ListadoLevantamientosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoLevantamientosPage),
  ],
})
export class ListadoLevantamientosPageModule {}
