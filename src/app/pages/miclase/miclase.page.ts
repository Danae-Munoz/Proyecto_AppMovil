import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.page.html',
  styleUrls: ['./miclase.page.scss'],
})
export class MiclasePage implements OnInit {

  public usuario: Usuario;

  constructor(
      private activatedRoute: ActivatedRoute
    , private router: Router) 
  { 
    this.usuario = new Usuario();
    this.usuario.recibirUsuario(this.activatedRoute, this.router);
  }

  ngOnInit() {
  }

  navegar(pagina: string) {
    this.usuario.navegarEnviandoUsuario(this.router, pagina);
  }

}
