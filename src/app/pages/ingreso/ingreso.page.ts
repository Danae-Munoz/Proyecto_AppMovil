import { ApplicationRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage {

  public usuario: Usuario;

  constructor(
      private router: Router
    , private activatedRoute: ActivatedRoute
    , private toastController: ToastController) 
  {
    this.usuario = new Usuario();
    this.usuario.cuenta = 'atorres';
    this.usuario.password = '1234';
    this.usuario.recibirUsuario(this.activatedRoute, this.router);
  }

  ingresar() {
    const error = this.usuario.validarUsuario();
    if(error) {
      this.mostrarMensajeEmergente(error);
      return;
    } 
    this.mostrarMensajeEmergente('¡Bienvenido(a) al Sistema de Asistencia DUOC!');
    this.usuario.asistencia = this.usuario.asistenciaVacia();
    this.usuario.navegarEnviandoUsuario(this.router, '/inicio');
  }

  creaTuCuenta() {
    this.mostrarMensajeEmergente('Funcionalidad aún no implementada');
  }

  async mostrarMensajeEmergente(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion? duracion: 2000
      });
    toast.present();
  }
  contrasena(): void {
    this.router.navigate(['correo']);
  }

}
