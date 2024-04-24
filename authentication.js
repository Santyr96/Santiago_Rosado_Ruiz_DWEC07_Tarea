/**
 * Desarrollo de Aplicaciones Web
 * Módulo: Desarrollo Web en Entorno Servidor
 * Autor: Santiago Rosado Ruiz
 * Unidad 7: Programación AJAX en JavaScript.
 *
 * Archivo para establece la autenticación a la página web.
 */

//Importamos las excepciones.
import {
  BaseException,
  InvalidAccessConstructorException,
} from "./Excepcion_gestion_restaurantes.js";

//Importamos la clase user.
import { User } from "./user.js";

//Creación de la clase AuthenticationException que se encargará de lanzar excepción si surge algún error.
class AuthenticationException extends BaseException {
  constructor(
    message = "Error: Authentication Service Exception.",
    fileName,
    lineNumber
  ) {
    super(message, fileName, lineNumber);
    this.name = "AuthenticationException";
  }
}

//Creación el servicion de autenticación utilizando el patrón Singleton.
const AuthenticationService = (() => {
  let instantiated; //Variable para almacenar la instancia.

  function init() {
    //.Clase Authentication que se instanciará una sola vez
    class Authentication {
        //Creación del constructor.
      constructor() {
        // Validamos que no se pueda instanciar la clase sin usar new.
        if (!new.target) throw new InvalidAccessConstructorException();
      }

      //Método para validar el usuario y la contraseña.
      validateUser(username, password) {
        // Método para validar usuario
        return username === "admin" && password === "admin";
      }

      //Método para obtener el usuario.
      getUser(username) {
        
        if (username === "admin") {
          return new User("admin");
        }
        return null;
      }
    }

    //Instanciamos la clase Authentication.
    const auth = new Authentication();
    Object.freeze(auth); //Hacemos inmutable la instancia.
    return auth;
  }


  return {
    //Método para obtener la instancia de la clase Authentication.
    getInstance() {
      
        //Si no existe la instancia, la creamos.
      if (!instantiated) {
        instantiated = init(); // Solo se inicializa una vez
      }
      return instantiated;
    },
  };
})();

//Exportamos la clase AuthenticationService.
export default AuthenticationService;


