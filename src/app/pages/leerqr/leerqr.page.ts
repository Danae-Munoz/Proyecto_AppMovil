
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Asistencia } from 'src/app/model/asistencia';
import { Usuario } from 'src/app/model/usuario';
import jsQR, { QRCode } from 'jsqr';
import { AfterViewInit} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { AnimationController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-leerqr',
  templateUrl: './leerqr.page.html',
  styleUrls: ['./leerqr.page.scss'],
})
export class LeerqrPage implements OnInit {

  correo: string = '';
  contrasena: string ='';
  nombre: string = '';
  

  @ViewChild('video') private video!: ElementRef;
  @ViewChild('page', { read: ElementRef }) page!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  public usuario: Usuario;
  public asistencia: Asistencia = new Asistencia();
  public escaneando = false;
  public datosQR: string = '';

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController,
    private navCtrl: NavController

  ) { 
    this.usuario = new Usuario();
    this.usuario.recibirUsuario(activatedRoute, router);
  }

  ngOnInit() {
  }

  public async comenzarEscaneoQR() {
    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      if (qrCode.data !== '') {
        this.escaneando = false;
        this.mostrarDatosQROrdenados(qrCode.data);
        return true;
      }
    }
    return false;
  }

  public mostrarDatosQROrdenados(datosQR: string): void {
    this.datosQR = datosQR;
    
    // Convertir el string de datos QR a objeto JSON
    try {
        const objetoDatosQR = JSON.parse(datosQR);
        
        // Rellenar los campos de asistencia con los datos del QR
        this.asistencia.bloqueInicio = objetoDatosQR.bloqueInicio;
        this.asistencia.bloqueTermino = objetoDatosQR.bloqueTermino;
        this.asistencia.dia = objetoDatosQR.dia;
        this.asistencia.horaFin = objetoDatosQR.horaFin;
        this.asistencia.horaInicio = objetoDatosQR.horaInicio;
        this.asistencia.idAsignatura = objetoDatosQR.idAsignatura;
        this.asistencia.nombreAsignatura = objetoDatosQR.nombreAsignatura;
        this.asistencia.nombreProfesor = objetoDatosQR.nombreProfesor;
        this.asistencia.seccion = objetoDatosQR.seccion;
        this.asistencia.sede = objetoDatosQR.sede;

        // Navegar a la página de clase, pasando el usuario y los datos de asistencia
        this.router.navigate(['/miclase'], { 
            state: { 
                usuario: this.usuario, 
                asistencia: this.asistencia 
            } 
        });
    } catch (error) {
        console.error('Error al parsear los datos QR:', error);
    }
}


  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

  navegar(pagina: string) {
    this.usuario.navegarEnviandousuario(this.router, pagina);
  }
  ngAfterViewInit() {
    this.animarTituloIzqDer();
    this.animarVueltaDePagina();
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
  public onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e) => {
        // Verificar que e.target y e.target.result no sean null
        if (e.target && e.target.result) {
          const img = new Image();
          img.src = e.target.result as string;
          img.onload = () => {
            this.obtenerDatosQRDesdeImagen(img);
          };
        }
      };
      reader.readAsDataURL(file);
    }
  }  
  public selectImage(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      this.onFileSelected(event);
    };
    input.click();
  }
  
  private obtenerDatosQRDesdeImagen(img: HTMLImageElement): void {
    const w: number = img.width;
    const h: number = img.height;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(img, 0, 0, w, h);
    const imgData: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(imgData.data, w, h, { inversionAttempts: 'dontInvert' });
    
    if (qrCode) {
      this.mostrarDatosQROrdenados(qrCode.data);
    } else {
      this.datosQR = 'No se encontró un código QR en la imagen.';
    }
  }
  mostrarDatosPersona() {
    // Si el usuario no ingresa la cuenta, se mostrará un error
    if (this.usuario.cuenta.trim() === '') {
      this.mostrarMensajeAlerta('⚠️ La cuenta es un campo obligatorio.⚠️');
      return;
    }

    // Si el usuario no ingresa al menos el nombre o el apellido, se mostrará un error
    this.usuario.nombre = this.usuario.nombre.trim();
    this.usuario.apellido = this.usuario.apellido.trim();
    if (this.usuario.nombre.trim() === '' && this.usuario.apellido === '') {
      this.mostrarMensajeAlerta('⚠️ Debe ingresar al menos un nombre o un apellido.⚠️');
      return;
    }

    // Mostrar un mensaje emergente con los datos de la persona
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
  async mostrarMensajeAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Datos personales',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  asignado(texto: string) {
    if (texto.trim() !== '') {
      return texto;
    }
    return 'No asignado';
  }

  miclase(){
    let extras: NavigationExtras ={
      state:{
        user: this.correo,
        pass:this.contrasena

      // state: propiedad para recibir variables para que puedan navegar
      }
    }
    
  // let para crear variables en JavaScript, las variables existen solo donde se definen.
  // si hay llaves {es un objeto}

    this.router.navigate(['miclase'],extras)
    
  }

}