import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
//import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    //public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/inicia-sesion']);
  }

  /*loginGoogle( token: string ) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token } )
                .map( (resp: any) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario );
                  return true;
                });
  }*/

  login( usuario: Usuario, recordar: boolean = false ) {
    if ( recordar ) {
      localStorage.setItem('email', usuario.email );
    }else {
      localStorage.removeItem('email');
    }
    let url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario )
                .map( (resp: any) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario );
                  return true;
                });
  }

  crearUsuario( usuario: Usuario ) {
    let url = URL_SERVICIOS + '/usuario';
    return this.http.post( url, usuario )
              .map( (resp: any) => {
                swal('Usuario creado con éxito: ', ''+ usuario.email, 'success' );
                return resp.usuario;
              });
  }
  
  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put( url, usuario )
                .map( (resp: any) => {

                  if ( usuario._id === this.usuario._id ) {
                    let usuarioDB: Usuario = resp.usuario;
                    this.guardarStorage( usuarioDB._id, this.token, usuarioDB );
                  }
                  swal('Usuario actualizado con éxito ', ''+ usuario.email,'success');
                  return true;
                });
  }

  actualizarContrasena( usuario: Usuario ) {
    let url = URL_SERVICIOS + '/usuario/contrasena/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put( url, usuario )
                .map( (resp: any) => {
                  swal('Contraseña actualizado con éxito ', ''+ usuario.email,'success');
                  return true;
                });
  }

  borrarUsuario( id: string ) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete( url )
                .map( resp => {
                  swal('Éxito','Usuario '+ this.usuario.email +' eliminado con éxito','success');
                  //swal('Usuario borrado', 'El usuario a sido eliminado correctamente', 'success');
                  console.log(resp);
                  return true;
                });
  }
}
