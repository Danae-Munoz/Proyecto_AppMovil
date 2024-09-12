import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { AnimationController} from '@ionic/angular';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.page.html',
  styleUrls: ['./misdatos.page.scss'],
})
export class MisdatosPage implements AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('page', { read: ElementRef }) page!: ElementRef;
  @ViewChild('itemCuenta', { read: ElementRef }) itemCuenta!: ElementRef;
  @ViewChild('itemNombre', { read: ElementRef }) itemNombre!: ElementRef;
  @ViewChild('itemApellido', { read: ElementRef }) itemApellido!: ElementRef;
  @ViewChild('itemEducacion', { read: ElementRef }) itemEducacion!: ElementRef;
  @ViewChild('itemFechaNacimiento', { read: ElementRef }) itemFechaNacimiento!: ElementRef;
  
  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();
  
  public usuario: Usuario;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController) 
  {
    this.usuario = new Usuario();
    this.usuario.recibirUsuario(this.activatedRoute, this.router);
  }

  ngAfterViewInit() {
    this.animarTituloIzqDer();
    this.animarVueltaDePagina();
  }

  limpiarPagina() {
    this.usuario.cuenta = '';
    this.usuario.nombre = '';
    this.usuario.apellido = '';
    this.usuario.correo = '';
    this.usuario.preguntaSecreta = '';
    this.usuario.respuestaSecreta = '';
    this.usuario.nivelEducacional = NivelEducacional.buscarNivelEducacional(1)!;
    this.usuario.fechaNacimiento = undefined;
    this.usuario.password = '';
    this.usuario.confirmPassword = ''; // Added confirm password clear
  }

  limpiarAnimandoDerIzq() {
    this.limpiarPagina();
    this.animarDerIzq(this.itemCuenta.nativeElement, 100);
    this.animarDerIzq(this.itemNombre.nativeElement, 200);
    this.animarDerIzq(this.itemApellido.nativeElement, 300);
    this.animarDerIzq(this.itemEducacion.nativeElement, 400);
    this.animarDerIzq(this.itemFechaNacimiento.nativeElement, 500);
  }

  limpiarAnimandoRotacion() {
    this.limpiarPagina();
    this.animarRotacion(this.itemCuenta.nativeElement, 800);
    this.animarRotacion(this.itemNombre.nativeElement, 1100);
    this.animarRotacion(this.itemApellido.nativeElement, 1400);
    this.animarRotacion(this.itemEducacion.nativeElement, 1700);
    this.animarRotacion(this.itemFechaNacimiento.nativeElement, 2000);
  }

  animarTituloIzqDer() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(6000)
      .fromTo('transform', 'translate(0%)', 'translate(100%)')
      .fromTo('opacity', 0.2, 1)
      .play();
  }

  animarDerIzq(nativeElement: any, duration: number) {
    this.animationController
      .create()
      .addElement(nativeElement)
      .iterations(1)
      .duration(duration)
      .fromTo('transform', 'translate(100%)', 'translate(0%)')
      .play();
  }

  animarRotacion(elementRef: any, duration: number) {
    this.animationController
      .create()
      .addElement(elementRef)
      .iterations(1)
      .duration(duration)
      .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)')
      .play();
  }

  animarVueltaDePagina() {
    this.animationController
      .create()
      .addElement(this.page.nativeElement)
      .iterations(1)
      .duration(1000)
      .fromTo('transform', 'rotateY(0deg)', 'rotateY(-180deg)')
      .duration(1000)
      .fromTo('transform', 'rotateY(-180deg)', 'rotateY(0deg)')
      .play();
  }

  asignado(texto: string) {
    if (texto.trim() !== '') {
      return texto;
    }
    return 'No asignado';
  }

  // Validate if passwords match
  validarContrasenas() {
    if (this.usuario.password !== this.usuario.confirmPassword) {
      this.mostrarMensajeAlerta('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  }

  mostrarDatosPersona() {
    // First validate passwords
    if (this.validarContrasenas()) {
      // Continue with showing user data
      if (this.usuario.cuenta.trim() === '') {
        this.mostrarMensajeAlerta('La cuenta es un campo obligatorio.');
        return;
      }

      this.usuario.nombre = this.usuario.nombre.trim();
      this.usuario.apellido = this.usuario.apellido.trim();
      if (this.usuario.nombre.trim() === '' && this.usuario.apellido === '') {
        this.mostrarMensajeAlerta('Debe ingresar al menos un nombre o un apellido.');
        return;
      }

      let mensaje = `
        <small>
          <b>Cuenta:      </b> ${this.usuario.cuenta} <br>
          <b>Usuario:     </b> ${this.usuario.correo} <br>
          <b>Nombre:      </b> ${this.asignado(this.usuario.nombre)} <br>
          <b>Apellido:    </b> ${this.asignado(this.usuario.apellido)} <br>
          <b>Educación:   </b> ${this.asignado(this.usuario.nivelEducacional.getEducacion())} <br>
          <b>Nacimiento:  </b> ${this.usuario.getFechaNacimiento()}
        </small>
      `;
      this.mostrarMensajeAlerta(mensaje);
    }
  }

  async mostrarMensajeAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Datos personales',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  navegar(pagina: string) {
    this.usuario.navegarEnviandousuario(this.router, pagina);
  }

}


