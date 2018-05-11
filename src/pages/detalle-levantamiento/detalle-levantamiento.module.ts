import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleLevantamientoPage } from './detalle-levantamiento';

@NgModule({
  declarations: [
    DetalleLevantamientoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleLevantamientoPage),
  ],
})
export class DetalleLevantamientoPageModule {}
