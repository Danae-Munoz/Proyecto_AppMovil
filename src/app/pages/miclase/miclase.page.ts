import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { Asistencia } from 'src/app/model/asistencia';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.page.html',
  styleUrls: ['./miclase.page.scss'],
})
export class MiclasePage implements OnInit, AfterViewInit {
  correo: string = '';
  contrasena: string = '';

  @ViewChild('titulo', { read: ElementRef, static: true }) itemTitulo!: ElementRef;

  public usuario: Usuario = new Usuario();
  public asistencia: Asistencia = new Asistencia();

  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state) {
      this.usuario = nav.extras.state['usuario'];
      this.asistencia = nav.extras.state['asistencia']; // Asegúrate de recibir asistencia
      console.log(this.usuario.toString());
      console.log(this.asistencia); // Verifica que se esté recibiendo correctamente
    }
  }

  ngOnInit() {
    // Ya no necesitas el paramMap si los datos vienen del estado de navegación
  }

  cerrarsesion() {
    this.router.navigate(['/login']);
  }

  principal() {
    let extras: NavigationExtras = {
      state: {
        user: this.correo,
        pass: this.contrasena
      }
    };
    this.router.navigate(['principal'], extras);
  }

  ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(6000)
        .fromTo('transform', 'translateX(0%)', 'translateX(100%)')
        .fromTo('opacity', 0.2, 1);
      animation.play();
    }
  }
}
