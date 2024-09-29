import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public usuario: Usuario = new Usuario(); 

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController)
  {
    this.usuario = new Usuario();
    this.usuario.cuenta = 'atorres';
    this.usuario.password = '1234';
    this.usuario.recibirUsuario(this.activatedRoute, this.router);
  }

  ngOnInit(): void {}

  contrasena(): void {
    this.router.navigate(['correo']);
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
   
  validarUsuario(usuario: Usuario): boolean {  
  const usuarioModelo = new Usuario(); // Asegúrate de instanciar correctamente el modelo  
  const usu = usuarioModelo.buscarUsuarioValido(usuario.cuenta, usuario.password);  

  if (usu) {  
      this.usuario = usu; // Actualiza la instancia de usuario  
      return true;  
  } else {  
      this.mostrarMensajeEmergente('Las credenciales no son correctas!');  
      return false;  
  }  
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
}

