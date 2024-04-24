/**
 * Desarrollo de Aplicaciones Web
 * Módulo: Desarrollo Web en Entorno Servidor
 * Autor: Santiago Rosado Ruiz
 * Unidad 7: Programación AJAX en JavaScript.
 *
 * Archivo para gestionar objetos de tipo usuario.
 */

//Importamos las excepciones personalizadas.
import {
  InvalidAccessConstructorException,
  EmptyValueException,
} from "./Excepcion_gestion_restaurantes.js";

//Clase Usuario
class User {
  //Definición de los campos privados.
  #username;
  #preferences;

  //Definición del contructor de la clase.
  constructor(username) {
    //Comprobamos que no se llame a la clase abstracta.
    if (!new.target) throw new InvalidAccessConstructorException();
    if (!username) throw new EmptyValueException("username");
    this.#username = username;
    //Definimos las preferencias por defecto.
    Object.defineProperty(this, "username", {
      enumerable: true,
      get() {
        return this.#username;
      },
    });
    Object.defineProperty(this, "preferences", {
      enumerable: true,
      get() {
        return this.#preferences;
      },

      //Definimos el setter de las preferencias.
      set(value) {
        if (!value) throw new EmptyValueException("preferences");
        this.#preferences = value;
      },
    });
  }
}

//Exportamos la clase.
export { User };
