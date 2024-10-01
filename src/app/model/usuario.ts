import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NivelEducacional } from './nivel-educacional';
import { Persona } from "./persona";
import { Asistencia } from '../interfaces/asistencia';

export class Usuario extends Persona {

  public cuenta: string;
  public correo: string;
  public password: string;
  public preguntaSecreta: string;
  public respuestaSecreta: string;
  public confirmPassword: string;
  public asistencia: Asistencia;
  public listaUsuarios: Usuario[];

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
    this.asistencia = this.asistenciaVacia();
    this.listaUsuarios = [];
  }

  public asistenciaVacia(): Asistencia {
    return {  
      bloqueInicio: 0,
      bloqueTermino: 0,
      dia: '',
      horaFin: '',
      horaInicio: '',
      idAsignatura: '',
      nombreAsignatura: '',
      nombreProfesor: '',
      seccion: '',
      sede: ''
    };
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
  public buscarUsuarioValido(cuenta: string, password: string): Usuario | undefined {
    return this.listaUsuarios.find(usu => usu.cuenta === cuenta && usu.password === password);
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
    const usu = this.buscarUsuarioValido(this.cuenta, this.password);
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

  crearListausuariosValidos() {
    if (this.listaUsuarios.length === 0) {
      this.listaUsuarios.push(
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
        )
      );
      this.listaUsuarios.push(
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
        )
      );
      this.listaUsuarios.push(
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
        )
      );
    }
  }

  recibirUsuario(activatedRoute: ActivatedRoute, router: Router) {
    if(this.listaUsuarios.length === 0) this.crearListausuariosValidos();
    activatedRoute.queryParams.subscribe(() =>{
      const nav = router.getCurrentNavigation();
      if (nav) {
        if (nav.extras.state) {
          this.listaUsuarios = nav.extras.state['listaUsuarios'];
          const encontrado = this.buscarUsuarioPorCuenta(
            nav.extras.state['cuenta']
          );
          this.cuenta = encontrado!.cuenta
          this.password = encontrado!.password
          this.preguntaSecreta = encontrado!.preguntaSecreta
          this.respuestaSecreta = encontrado!.respuestaSecreta
          this.nombre = encontrado!.nombre
          this.apellido = encontrado!.apellido
          this.nivelEducacional = encontrado!.nivelEducacional
          this.fechaNacimiento = encontrado!.fechaNacimiento
          
          this.asistencia = encontrado!.asistencia = nav.extras.state['asistencia'];
        }
      }
      router.navigate(['/login'])
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


  public buscarUsuarioPorCuenta(cuenta: string): Usuario | undefined {
    return this.listaUsuarios.find(usu => usu.cuenta === cuenta);
  }

  navegarEnviandoUsuario(router: Router, pagina: string) {
    if (this.cuenta.trim() !== '' && this.password.trim() !== ''){
      const NavigationExtras: NavigationExtras = {
        state: {
        cuenta: this.cuenta,
        listaUsuarios: this.listaUsuarios,
        Asistencia: this.asistencia,
        }
      }
      router.navigate([pagina], NavigationExtras);
    }else{
      router.navigate(['/ingreso']);
    }

  }

  actualizarUsuario() {
    const usu = this.buscarUsuarioPorCuenta(this.cuenta);
    if (usu) {
      usu.correo = this.correo;
      usu.password = this.password;
      usu.preguntaSecreta = this.preguntaSecreta;
      usu.respuestaSecreta = this.correo;
      usu.nombre = this.nombre;
      usu.apellido = this.apellido;
      usu.nivelEducacional = this.nivelEducacional;
      usu.fechaNacimiento = this.fechaNacimiento;
      usu.asistencia = this.asistencia;
    }


  }

  public buscarUsuarioPorCorreo(correo: string): Usuario | undefined {
    return this.crearListausuariosValidos().find(usuario => usuario.correo === correo);
  }
  
}
