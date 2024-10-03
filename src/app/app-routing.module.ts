import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CorreoPage } from './pages/correo/correo.page';
import { CorreoPageModule } from './pages/correo/correo.module';
import { CorrectoPageModule } from './pages/correcto/correcto.module';
import { PreguntaPageModule } from './pages/pregunta/pregunta.module';
import { IncorrectoPageModule } from './pages/incorrecto/incorrecto.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ingreso',
    pathMatch: 'full'
  },
  {
    path: 'ingreso',
    loadChildren: () => import('./pages/ingreso/ingreso.module').then( m => m.IngresoPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'miclase',
    loadChildren: () => import('./pages/miclase/miclase.module').then( m => m.MiclasePageModule)
  },
  {
    path: 'misdatos',
    loadChildren: () => import('./pages/misdatos/misdatos.module').then( m => m.MisdatosPageModule)
  },
  {
    path: 'correo',
    loadChildren: () => import('./pages/correo/correo.module').then( m => CorreoPageModule)
  },
  {
    path: 'correcto',
    loadChildren: () => import('./pages/correcto/correcto.module').then( m => CorrectoPageModule)
  },
  {
    path: 'incorrecto',
    loadChildren: () => import('./pages/incorrecto/incorrecto.module').then( m => IncorrectoPageModule)
  },
  {
    path: 'pregunta',
    loadChildren: () => import('./pages/pregunta/pregunta.module').then( m => PreguntaPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
