/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 5.
 * Alumno: Santiago Rosado Ruiz.
 * UT05 Práctica 5: Gestión de restaurantes - DOM y MVC.
 */

//Creamos la excepción base que hereda de Error.
class BaseException extends Error {
    constructor(message = "Default Message", fileName, lineNumber) {
        super(message, fileName, lineNumber);
        this.name = "MyError";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BaseException);
        }
    }
}

/**Creamos la excepcion base del gestor de la cual heredarán el resto de excepciones personalizadas. */
class RestaurantException extends BaseException {
    constructor(message = "Error: Restaurant Exception.", fileName, lineNumber) {
        super(message, fileName, lineNumber);
        this.name = "RestaurantException";
    }
}

/**Clase cuando el constructor se quiera invocar sin la clausula new. */
class InvalidAccessConstructorException extends BaseException {
    constructor() {
        super("Constructor can’t be called as a function.");
        this.name = "InvalidAccessConstructorException";
    }
}

/**Clase para que el objeto (categoría, menú, plato...) no pueda ser null o no es un objeto de la clase requerida. */
class ErrorExistenceElementException extends RestaurantException {
    constructor(message) {
        super(message || "Element can`t be null or the object is not a category.");
        this.name = "ErrorExistenceElementException"
    }
}

// Excepción personalizada para indicar valores vacios.
class EmptyValueException extends BaseException {
    constructor(param, fileName, lineNumber) {
      super(`Error: The parameter ${param} can't be empty.`, fileName, lineNumber);
      this.param = param;
      this.name = 'EmptyValueException';
    }
  }

/**Clase por si el objeto (categoría, menú, plato...) ya existe. */
class ElementExistsYetException extends RestaurantException {
    constructor(message) {
        super(message || "Element exists yet.");
        this.name = "ElementExistsYetException"
        this.message = message;
    }
}

/**Clase por si el objeto (categoría, menú, plato...) ya está registrado. */
class ElementRecordedYetException extends RestaurantException {
    constructor(message) {
        super(message || "Element recorded yet.");
        this.name = "ElementRecordedYetException"
        this.message = message;
    }
}

/**Clase por si el objeto (Cateogría, menú, plato...) no se encuentra registrado. */

class ElementNotRecordedException extends RestaurantException{
    constructor(message) {
        super(message || "Element not recorded.");
        this.name = "ElementNotRecordedException"
        this.message = message;
    }
}

/**Clase por si el objeto (categoría, menú, plato...) ya está registrado. */
class AttributeRequiredException extends RestaurantException {
    constructor(message) {
        super(message || "Attribute is required.");
        this.name = "AttributeRequiredException"
        this.message = message;
    }
}

class DishNotExistinManagerException extends RestaurantException {
    constructor(message) {
        super(message || "Dish not exists un our records.");
        this.name = "DishNotExistinManagerException"
        this.message = message;
    }
}

class DishExistInListException extends RestaurantException {
    constructor(message) {
        super(message || "Dish exist in  records yet.");
        this.name = "DishExistInListException"
        this.message = message;
    }
}

class DishNotExistInListException extends RestaurantException {
    constructor(message) {
        super(message || "Dish not exist in records.");
        this.name = "DishNotExistInListException"
        this.message = message;
    }
}





export {
    BaseException, RestaurantException, InvalidAccessConstructorException,
    ErrorExistenceElementException, ElementExistsYetException, ElementRecordedYetException,
     AttributeRequiredException, ElementNotRecordedException, DishNotExistinManagerException,
     DishExistInListException, DishNotExistInListException, EmptyValueException
};


