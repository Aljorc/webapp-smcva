import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class LoginGuardGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) {}

  canActivate(){

    if ( this._usuarioService.estaLogueado() ) {
      return true;
    } else {
      console.log( 'Bloqueado por guard' );
      this.router.navigate(['/inicia-sesion']);
      return false;
    }
  }
}