import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NivelEducacional } from './nivel-educacional';
import { Persona } from "./persona";

export class Usuario extends Persona {
  navegarEnviandoUsuario(router: Router, pagina: string) {
    throw new Error('Method not implemented.');
  }
  actualizarUsuario() {
    throw new Error('Method not implemented.');
  }

  public cuenta: string;
  public correo: string;
  public password: string;
  public preguntaSecreta: string;
  public respuestaSecreta: string;
  public confirmPassword: string;

  constructor() {
    super();
    this.cuenta = '';
    this.correo = '';
    this.password = '';
    this.preguntaSecreta = '';
    this.respuestaSecreta = '';
    this.confirmPassword = '';
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacional = NivelEducacional.buscarNivelEducacional(1)!;
    this.fechaNacimiento = undefined;
  }

  public static getNewUsuario(
    cuenta: string,
    correo: string,
    password: string,
    preguntaSecreta: string,
    respuestaSecreta: string,
    nombre: string,
    apellido: string,
    nivelEducacional: NivelEducacional,
    fechaNacimiento: Date | undefined
  ) {
    let usuario = new Usuario();
    usuario.cuenta = cuenta;
    usuario.correo = correo;
    usuario.password = password;
    usuario.preguntaSecreta = preguntaSecreta;
    usuario.respuestaSecreta = respuestaSecreta;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.nivelEducacional = nivelEducacional;
    usuario.fechaNacimiento = fechaNacimiento;
    return usuario;
  }

  // Método corregido para buscar usuario por cuenta y contraseña
  public static buscarUsuarioValido(cuenta: string, password: string): Usuario | undefined {
    return Usuario.getListaUsuarios().find(
      usu => usu.cuenta === cuenta && usu.password === password
    );
  }

  public validarCuenta(): string {
    if (this.cuenta.trim() === '') {
      return 'Para ingresar al sistema debe seleccionar una cuenta.';
    }
    return '';
  }

  public validarPassword(): string {
    if (this.password.trim() === '') {
      return 'Para ingresar al sistema debe escribir la contraseña.';
    }
    if (isNaN(+this.password)) {
      return 'La contraseña debe ser numérica.';
    }
    if (this.password.length !== 4) {
      return 'La contraseña debe ser numérica de 4 dígitos.';
    }
    return '';
  }

  public validarUsuario(): string {
    let error = this.validarCuenta();
    if (error) return error;
    error = this.validarPassword();
    if (error) return error;
    const usu = Usuario.buscarUsuarioValido(this.cuenta, this.password);
    if (!usu) return 'Las credenciales del usuario son incorrectas.';
    return '';
  }

  public actualizarDatos(
    cuenta: string,
    correo: string,
    password: string,
    preguntaSecreta: string,
    respuestaSecreta: string,
    nombre: string,
    apellido: string,
    nivelEducacional: NivelEducacional,
    fechaNacimiento: Date | undefined
  ): void {
    this.cuenta = cuenta;
    this.correo = correo;
    this.password = password;
    this.preguntaSecreta = preguntaSecreta;
    this.respuestaSecreta = respuestaSecreta;
    this.nombre = nombre;
    this.apellido = apellido;
    this.nivelEducacional = nivelEducacional;
    this.fechaNacimiento = fechaNacimiento;
  }

  public override toString(): string {
    return `      ${this.cuenta}
      ${this.correo}
      ${this.password}
      ${this.preguntaSecreta}
      ${this.respuestaSecreta}
      ${this.nombre}
      ${this.apellido}
      ${this.nivelEducacional.getEducacion()}
      ${this.getFechaNacimiento()}`;
  }

  public static getListaUsuarios(): Usuario[] {
    return [
      Usuario.getNewUsuario(
        'atorres',
        'atorres@duocuc.cl',
        '1234',
        '¿Cuál es tu animal favorito?',
        'gato',
        'Ana',
        'Torres',
        NivelEducacional.buscarNivelEducacional(6)!,
        new Date(2000, 0, 1)
      ),
      Usuario.getNewUsuario(
        'jperez',
        'jperez@duocuc.cl',
        '5678',
        '¿Cuál es tu postre favorito?',
        'panqueques',
        'Juan',
        'Pérez',
        NivelEducacional.buscarNivelEducacional(5)!,
        new Date(2000, 1, 1)
      ),
      Usuario.getNewUsuario(
        'cmujica',
        'cmujica@duocuc.cl',
        '0987',
        '¿Cuál es tu vehículo favorito?',
        'moto',
        'Carla',
        'Mujica',
        NivelEducacional.buscarNivelEducacional(6)!,
        new Date(2000, 2, 1)
      ),
    ]
  }

  recibirUsuario(activatedRoute: ActivatedRoute, router: Router) {
    activatedRoute.queryParams.subscribe(() => {
      const nav = router.getCurrentNavigation();
      if (nav && nav.extras.state) {
        const { cuenta, password } = nav.extras.state;
        const usu = Usuario.buscarUsuarioValido(cuenta, password);
        if (usu) {
          this.actualizarDatos(
            usu.cuenta, 
            usu.correo, 
            usu.password, 
            usu.preguntaSecreta, 
            usu.respuestaSecreta, 
            usu.nombre, 
            usu.apellido, 
            usu.nivelEducacional, 
            usu.fechaNacimiento
          );
          return;
        }
      }
      router.navigate(['/login']);
    });
  }

  navegarEnviandousuario(router: Router, pagina: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        cuenta: this.cuenta, 
        password: this.password,
      }
    }
    router.navigate([pagina], navigationExtras);
  }

  public static buscarUsuarioPorCorreo(correo: string): Usuario | undefined {
    return Usuario.getListaUsuarios().find(usuario => usuario.correo === correo);
  }
  
  
}






