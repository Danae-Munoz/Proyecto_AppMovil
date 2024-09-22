import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public usuario: Usuario = new Usuario(); // Inicializa un usuario

  constructor(private router: Router, private toastController: ToastController) {}

  ngOnInit(): void {}

  contrasena(): void {
    this.router.navigate(['correo']);
  }

  login(): void {
    if (!this.validarUsuario(this.usuario)) {
      return;
    }

    this.mostrarMensaje('¡Bienvenido!');

    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario
      }
    };
    this.router.navigate(['principal'], navigationExtras);
  }

  validarUsuario(usuario: Usuario): boolean {
    const usu = Usuario.buscarUsuarioValido(this.usuario.correo, this.usuario.password);

    if (usu) {
      this.usuario = usu; // Actualiza la instancia de usuario
      return true;
    } else {
      this.mostrarMensaje('Las credenciales no son correctas!');
      return false;
    }
  }

  async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion ? duracion : 2000
      });
    toast.present();
  }
}

