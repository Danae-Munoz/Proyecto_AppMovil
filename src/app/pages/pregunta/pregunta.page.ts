import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage implements OnInit {
  public usuario: Usuario | undefined;
  public nombre: string = '';
  public pregunta: string = '';
  public respuesta: string = '';
  public correo: string = '';
  
  
  isAlertOpen: boolean = false;
  alertButtons: any[] = [];


  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) {

      this.activatedRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation()?.extras.state) {
          this.usuario = this.router.getCurrentNavigation()?.extras.state?.['usuario'];
        } else {
          this.router.navigate(['/login']);
        }
      });
    }

  ngOnInit() {
  }

  

  public validarRespuestaSecreta(): void {
    if (this.usuario?.respuestaSecreta === this.respuesta) {
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: this.usuario
        }
      };
      

      this.router.navigate(['correcto'], navigationExtras);
    } else {
      this.router.navigate(['incorrecto']);
    }
  }
}
