/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 5.
 * Alumno: Santiago Rosado Ruiz.
 * UT05 Práctica 5: Gestión de restaurantes - DOM y MVC.
 */

import { AttributeRequiredException } from "./Excepcion_gestion_restaurantes.js";

class Dish {
    constructor(name) {

        if (!name) {
            throw new AttributeRequiredException("Attribute name required.");
        }
        this._name = name;
        this.description = "There is not description.";
        this.ingredients = "There is not ingredients.";
        this.image = "There is not images.";

        Object.defineProperty(this, 'name', {
            enumerable: true,
            get() {
                return this._name;
            },
            set(value) {
                if (!value) throw new AttributeRequiredException("Attribute name required.");
                this._name = value;
            },
        });

    }

    toString() {
        
        return `Name: ${this._name}, Description: ${this.description}, Ingredients: ${this.ingredients}, Image: ${this.image} `;
    }
}

class Category {
    constructor(name) {
        if (!name) {
            throw new AttributeRequiredException("Attribute name required.");
        }
        this._name = name;
        this.description = "There is not description.";

        Object.defineProperty(this, 'name', {
            enumerable: true,
            get() {
                return this._name;
            },
            set(value) {
                if (!value) throw new AttributeRequiredException("Attribute name required.");
                this._name = value;
            },
        });


    }

    toString() {
        
        return `Name: ${this._name}, Description: ${this.description}. `;
    }
}


class Allergen {
    constructor(name) {
        if (!name) {
            throw new AttributeRequiredException("Attribute name required.");
        }
        this._name = name;
        this.description = "There is not description.";

        Object.defineProperty(this, 'name', {
            enumerable: true,
            get() {
                return this._name;
            },
            set(value) {
                if (!value) throw new AttributeRequiredException("Attribute name required.");
                this._name = value;
            },
        });


    }

    toString() {
        
        return `Name: ${this._name}, Description: ${this.description}. `;
    }
}

class Menu {
    constructor(name) {
        if (!name) {
            throw new AttributeRequiredException("Attribute name required.");
        }
        this._name = name;
        this.description = "There is not description.";

        Object.defineProperty(this, 'name', {
            enumerable: true,
            get() {
                return this._name;
            },
            set(value) {
                if (!value) throw new AttributeRequiredException("Attribute name required.");
                this._name = value;
            },
        });
    }

    toString() {
       
        return `Name: ${this._name}, Description: ${this.description}. `;
    }

}

class Restaurant {
    constructor(name) {
        if (!name) {
            throw new AttributeRequiredException("Attribute name required.");
        }
        this._name = name;
        this.description = "There is not description.";
        this.location = "There is not location information.";

        Object.defineProperty(this, 'name', {
            enumerable: true,
            get() {
                return this._name;
            },
            set(value) {
                if (!value) throw new AttributeRequiredException("Attribute name required.");
                this._name = value;
            },
        });
    }

    toString() {
       
        return `Name: ${this._name}, Description: ${this.description}, Location: ${this.location}.`;
    }
}

class Coordinate {
    constructor(latitude, longitude) {
        if (!latitude && !longitude) {
            throw new AttributeRequired("Attribute latitude and longitud required.");
        }
        this._latitude = latitude;
        this._longitude = longitude;

        Object.defineProperty(this, 'latitude', {
            enumerable: true,
            get() {
                return this._latitude;
            },
            set(value) {
                if (!value) throw new AttributeRequiredException("Attribute name required.");
                this._latitude = value;
            },
        });

        Object.defineProperty(this, 'longitude', {
            enumerable: true,
            get() {
                return this._longitude;
            },
            set(value) {
                if (!value) throw new AttributeRequiredException("Attribute name required.");
                this._longitude = value;
            },
        });
    }

    toString() {
        return `Latitude: ${this._latitude}, Longitude: ${this._longitude}`;
    }
}

export {Dish, Category, Allergen, Menu, Restaurant, Coordinate };