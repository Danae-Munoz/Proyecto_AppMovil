import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.page.html',
  styleUrls: ['./miclase.page.scss'],
})
export class MiclasePage implements OnInit, AfterViewInit {
  mdl_correo: string = '';
  mdl_contrasena: string = '';
  public bloqueInicio: number = 0;
  public bloqueTermino: number = 0;
  public dia: string = '';
  public horaFin: string = '';
  public horaInicio: string = '';
  public idAsignatura: string = '';
  public nombreAsignatura: string = '';
  public nombreProfesor: string = '';
  public seccion: string = '';
  public sede: string = '';  

  @ViewChild('titulo', { read: ElementRef, static: true }) itemTitulo!: ElementRef;

  public usuario: Usuario = new Usuario();

  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
  ) {
    this.activeroute.queryParams.subscribe(params => {
      const nav = this.router.getCurrentNavigation();
      if (nav && nav.extras.state) {
        this.usuario = nav.extras.state['usuario'];
        console.log(this.usuario.toString());
      }
    });
  }

  ngOnInit() {
    this.activeroute.paramMap.subscribe(params => {
      // Validación antes de asignar los valores
      this.bloqueInicio = Number(params.get('bloqueInicio')) || 0;
      this.bloqueTermino = Number(params.get('bloqueTermino')) || 0;
      this.dia = params.get('dia') || '';
      this.horaFin = params.get('horaFin') || '';
      this.horaInicio = params.get('horaInicio') || '';
      this.idAsignatura = params.get('idAsignatura') || '';
      this.nombreAsignatura = params.get('nombreAsignatura') || '';
      this.nombreProfesor = params.get('nombreProfesor') || '';
      this.seccion = params.get('seccion') || '';
      this.sede = params.get('sede') || '';
    });
  }

  cerrarsesion() {
    this.router.navigate(['/login']);
  }

  principal() {
    let extras: NavigationExtras = {
      state: {
        user: this.mdl_correo,
        pass: this.mdl_contrasena
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

