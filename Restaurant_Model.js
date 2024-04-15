/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 5.
 * Alumno: Santiago Rosado Ruiz.
 * UT05 Práctica 5: Gestión de restaurantes - DOM y MVC.
 */

//Importamos las excepciones.
import {
    InvalidAccessConstructorException, DishNotExistinManagerException,
    ErrorExistenceElementException, ElementExistsYetException, ElementRecordedYetException,
    ElementNotRecordedException, DishExistInListException, DishNotExistInListException
} from './Excepcion_gestion_restaurantes.js';

//Importamos las clases de los objetos.
import { Dish, Category, Allergen, Menu, Restaurant } from './Objetos_restaurante.js'

//Creación de la propiedad privada instance mediante Symbol.
const instance = Symbol("instancia");


/**Creación de la clase Manager la cuál sigue una estructura singleton.*/
class RestaurantsManager {

    [instance];
    constructor(name) {
        this.name = name;
        this._category = [];
        this._allergics = [];
        this._dishes = [];
        this._menus = [];
        this._restaurants = [];

        //Hacemos iterables los arrays.
        Object.defineProperty(this, 'categories', {
            enumerable: true,
            get() {
                const array = this._category;
                return {
                    *[Symbol.iterator]() {
                        for (const arrayCat of array) {
                            yield arrayCat.category;
                        }
                    }
                }
            }
        });

        Object.defineProperty(this, 'allergics', {
            enumerable: true,
            get() {
                const array = this._allergics;
                return {
                    *[Symbol.iterator]() {
                        for (const arrayAll of array) {
                            yield arrayAll.allergen;
                        }
                    }
                }
            }
        });

        Object.defineProperty(this, 'dishes', {
            enumerable: true,
            get() {
                const array = this._dishes;
                return {
                    *[Symbol.iterator]() {
                        for (const dish of array) {
                            yield dish;
                        }
                    }
                }
            }
        });

        Object.defineProperty(this, 'menus', {
            enumerable: true,
            get() {
                const array = this._menus;
                return {
                    *[Symbol.iterator]() {
                        for (const arrayMenu of array) {
                            yield arrayMenu.menu;
                        }
                    }
                }
            }
        });

        Object.defineProperty(this, 'restaurants', {
            enumerable: true,
            get() {
                const array = this._restaurants;
                return {
                    *[Symbol.iterator]() {
                        for (const restaurant of array) {
                            yield restaurant;
                        }
                    }
                }
            }
        });


    }



    //Función que devuelve una instancia de Restaurants Manager si ya existe, sino crea una nueva.
    static getInstance() {
        if (!this[instance]) {
            this[instance] = new RestaurantsManager("El Porrón");
        }

        return this[instance];
    }

    //Función que devuelve un iterador con la categorías creadas. Para ello utilizamos un generador.
    * getterCategories() {

        for (const iterator of this._category) {
            yield iterator;

        }
    }

    //Función que devuelve un iterador con los menús creados. Para ello utilizamos un generador.
    * getterMenus() {
        for (const iterator of this._menus) {
            yield iterator;

        }
    }

    //Función que devuelve un iterador con los alérgenos creados. Para ello utilizamos un generador.
    * getterAllergens() {
        for (const iterator of this._allergics) {
            yield iterator;

        }
    }

    //Función que devuelve un iterador con los restaurantes creados. Para ello utilizamos un generador.
    * getterRestaurants() {
        for (const iterator of this._restaurants) {
            yield iterator;

        }

    }

    //Función para obtener la posición del objeto introducido (menu, categoria o alérgeno). Que son los que tienen los platos almacenados.
    #getPosition(list, object, objectName) {
        console.log(object instanceof Category);
        if (!object || !(object instanceof objectName)) {
            throw new ErrorExistenceElementException(`${objectName} can't be null and must be ${objectName} object.`);
        } else {
            if (object instanceof Category){
                
                return list.findIndex(x => x.category.name === object._name);
            } else if (object instanceof Menu){
                return list.findIndex(x => x.menu.name === object._name);
            } else if(object instanceof Allergen){
                return list.findIndex(x => x.allergen.name === object._name);
            }
            
        }


    }


    /**Función que obtiene la posición de un plato dentro de una categoría. Para ello utilizamos la función findIndex () 
     * para buscar aquel plato que coincida con el introducido.*/
    #getDishPositionsinCategory(dish, category) {
        if (!category || !dish) {
            throw new ErrorExistenceElementException("Dish and Category can`t be null.");
        } else {
            const positionDishInCategory = category.dishes.findIndex(x => x.name === dish.name);
            return positionDishInCategory;
        }
    }

    /**Función que obtiene la posición de un plato dentro de un menú. Para ello utilizamos la función findIndex () 
     * para buscar aquel plato que coincida con el introducido.*/
    #getDishPositionsinMenu(dish, menu) {
        if (!menu || !dish) {
            throw new ErrorExistenceElementException("Dish and Menu can`t be null.");
        } else {
            const positionDishInMenu = menu.dishes.findIndex(x => x.name === dish.name);
            return positionDishInMenu;
        }
    }

    /**Función que obtiene la posición de un plato dentro de un alérgeno. Para ello utilizamos la función findIndex () 
     * para buscar aquel plato que coincida con el introducido.*/
    #getDishPositionsinAllergens(dish, allergen) {
        if (!allergen || !dish) {
            throw new ErrorExistenceElementException("Dish and Allergen can`t be null.");
        } else {
            const positionDishInAllergen = allergen.dishes.findIndex(x => x.name === dish.name);
            return positionDishInAllergen;
        }
    }


    /**Función que nos permite ordenar dos objetos por orden alfabetico. En este caso, se va ordenar las categorías, los menus,
     * los alergenos, los platos y los restaurantes. Para comprobar que el objeto introducido pertenece a una clase u otra, 
     * se utiliza el operador instance of.
     */
    #sortobjects = function (objA, objB) {
        if (objA.object instanceof Category && objB.object instanceof Category) {
            //Realizamos la comparación con la función localeCompare() ya sean de minusculas o mayusculas (función toLocaleLowerCase);
            return objA.object.name.toLocaleLowerCase().localeCompare(objB.object.name.toLocaleLowerCase());
        }

        if (objA.object instanceof Menu && objB.object instanceof Menu) {
            return objA.object.name.toLocaleLowerCase().localeCompare(objB.object.name.toLocaleLowerCase());
        }

        if (objA.object instanceof Allergen && objB.object instanceof Allergen) {

            return objA.object.name.toLocaleLowerCase().localeCompare(objB.object.name.toLocaleLowerCase());

        }

        if (objA instanceof Dish && objB instanceof Dish) {
            return objA._name.toLocaleLowerCase().localeCompare(objB._name.toLocaleLowerCase());
        }

        if (objA instanceof Restaurant && objB instanceof Restaurant) {
            return objA._name.toLocaleLowerCase().localeCompare(objB._name.toLocaleLowerCase());
        }

        return 0; // Si los objetos no son del mismo tipo, devuelve 0 (sin orden específico).
    }


    /**Función que permite añadir un objeto a la lista indicada. Para ello se comprueba si ese objeto ya existe, 
     * si no se introduce en la lista. Si ya existe, lanzamos una excepción.
     * 
     */
    #addobject(list, object, objectName) {
        const position = this.#getPosition(list, object, objectName);
        if (object instanceof Category) {
            let category = object;
            if (position === -1) {
                list.push({
                    category,
                    dishes: [],
                });
                list.sort(this.#sortobjects);
            }
        } else if (object instanceof Menu) {
            let menu = object;
            if (position === -1) {
                list.push({
                    menu,
                    dishes: [],
                });
                list.sort(this.#sortobjects);
            }
        } else if (object instanceof Allergen) {
            let allergen = object;
            if (position === -1) {
                list.push({
                    allergen,
                    dishes: [],
                });
                list.sort(this.#sortobjects);
            }

        } else {
            throw new ElementExistsYetException(`${objectName} exists yet.`);
        }
    }

    /**Función para eliminar un objeto de la lista indicada. Para ello, comprobamos que existe el objeto, si existe lo eliminamos de la lista.
     * En caso contrario, lanzamos la excepción.
     */
    #removeobject(list, object, objectName) {
        const position = this.#getPosition(list, object, objectName);
        if (position !== -1) {
            list.splice(position, 1);
            list.sort(this.#sortobjects);
        } else {
            throw new ElementNotRecordedException(`${objectName} not recorded.`);
        }
    }

    //Función para añadir una categoria a la lista. Para ello utilizamos la función addobject.
    addCategory(...categories) {
        for (const category of categories) {
            this.#addobject(this._category, category, Category);
        }
        return this;
    }

    //Función para eliminar una categoría de la lista. Para ello utilizamos la función remove object.
    removeCategory(...categories) {
        for (const category of categories) {
            this.#removeobject(this._category, category, Category);
            console.log(`Categoría: ${category.name} eliminada con éxito.`)
        }
    }

    //Función para añadir un menú a la lista. Para ello utilizamos la función addobject.
    addMenu(...menus) {
        for (const menu of menus) {
            this.#addobject(this._menus, menu, Menu);
        }
        return this;
    }

    //Función para eliminar un menú de la lista. Para ello utilizamos la función remove object.
    removeMenu(...menus) {
        for (const menu of menus) {
            this.#removeobject(this._menus, menu, Menu);
            console.log(`${menu.name} : eliminado con éxito.`)
        }
    }

    //Función para añadir un alérgeno a la lista. Para ello utilizamos la función addobject.
    addAllergen(...allergens) {
        for (const allergen of allergens) {
            this.#addobject(this._allergics, allergen, Allergen);
        }
        return this;
    }

    //Función para eliminar un alérgeno de la lista. Para ello utilizamos la función remove object.
    removeAllergens(...allergens) {
        for (const allergen of allergens) {
            this.#removeobject(this._allergics, allergen, Allergen);
            console.log(`Alérgeno: ${allergen.name} eliminado con éxito.`)
        }
    }

    //Función para obtener la posición de un plato de la lista de platos del manager. Para ello utilizamos la función findIndex().
    #getDishPosition(dish) {
        return this._dishes.findIndex(x => x.name === dish.name);
    }

    //Función para obtener la posición de un restaurante de la lista de restaurantes del manager. Para ello utilizamos la función findIndex().
    #getRestaurantPosition(restaurant) {
        return this._restaurants.findIndex(x => x.name === restaurant.name);
    }


    /**Función para añadir platos a la lista. Para ello obtenemos la posición del plato. Si este se encuentra en la lista, se lanza
     * la excepción. En caso contrario, se añade el plato.
     */
    addDish(...dishes) {
        for (const dish of dishes) {
            const position = this.#getDishPosition(dish);
            if (position === -1) {
                this._dishes.push(dish)
                this._dishes.sort(this.#sortobjects);
            } else {
                throw new ElementExistsYetException(`Dish exists yet.`);
            }
        }
        return this;
    }

    /**Función para eliminar un plato de la lista. Como los platos se encuentran asignados a categorias, menus y alérgenos,
     * almacenamos el plato que queremos eliminar y obtenemos su posición dentro de las categorias, menus y alérgenos en los
     * que se encuentre para eliminar las asignaciones.
     */
    removeDish(...dishes) {
        for (const dish of dishes) {
            const position = this.#getDishPosition(dish);
            const storedDishes = this._dishes[position];
            if (storedDishes) {
                for (const category of this._category) {
                    const positionCategory = this.#getDishPositionsinCategory(storedDishes, category);
                    if (positionCategory !== -1) {

                        category.dishes.splice(positionCategory, 1);
                        console.log(`Plato: ${dish.name} eliminado con exito y desasignado de: ${category.category.name} `);

                    }


                }

                for (const menu of this._menus) {
                    const positionMenu = this.#getDishPositionsinMenu(storedDishes, menu);
                    if (positionMenu !== -1) {
                        menu.dishes.splice(positionMenu, 1);
                        console.log(`Plato: ${dish.name} eliminado con exito y desasignado de: ${menu.menu.name} `);
                    }
                }

                for (const allergen of this._allergics) {
                
                    const positionAllergen = this.#getDishPositionsinAllergens(storedDishes, allergen);
                    if (positionAllergen !== -1) {
                        console.log(`Plato: ${dish.name} eliminado con exito y desasignado de: ${allergen.allergen.name} `);
                        allergen.dishes.splice(positionAllergen, 1);
                
                        
                    }
                }

                this._dishes.splice(position, 1);


            } else {
                throw new DishNotExistinManagerException("Dish not exist in our records.");
            }
        }
        return this;

    }

    /**Función para añadir un restaurante a la lista de restaurantes. Si este se encuentra en la lista, se lanza
     * la excepción. En caso contrario, se añade el restaurante. */
    addRestaurant(...restaurants) {
        for (const restaurant of restaurants) {
            const position = this.#getRestaurantPosition(restaurant);
            if (position === -1) {
                this._restaurants.push(restaurant)
                this._restaurants.sort(this.#sortobjects);
            } else {
                throw new ElementExistsYetException(`Restaurant exists yet.`);
            }
        }
        return this;
    }

    /**Función para eliminar un restaurante de la lista de restaurantes del manager. Si el restaurante no encuentra en la lista,
     * lanzamos una excepción. En caso constrario, lo eliminamos.
      */
    removeRestaurant(...restaurants) {
        for (const restaurant of restaurants) {
            const position = this.#getRestaurantPosition(restaurant);
            if (position !== -1) {
                this._restaurants.splice(position, 1)
                this._restaurants.sort(this.#sortobjects);
            } else {
                throw new ElementExistsYetException(`Restaurant don't exists.`);
            }
        }
        return this;

    }

    /**Función que asigna una categoría a varios platos. En primer lugar, se busca si existe la categoria, si no se añade en la lista.
     * Lo mismo con los platos. Posteriormente, con la función getDishPositionsinCategory() obtenemos la posición del plato en categorías
     * para comprobar si ya esta asignado, sino lo introducimos a la categoría. En caso constrario, lanzamos la excepción.
     */
    assignCategoryToDish(category, ...dishes) {
        let positionCategory = this.#getPosition(this._category, category, Category);
        if (positionCategory === -1) {
            this.addCategory(category);
            positionCategory = this.#getPosition(this._category, category, Category)
        }

        for (const dish of dishes) {
            let positionDish = this.#getDishPosition(dish);
            if (positionDish === -1) {
                this.addDish(dish);
                positionDish = this.#getDishPosition(dish);
            }

            const position = this.#getDishPositionsinCategory(dish, this._category[positionCategory]);




            if (position === -1) {
                this._category[positionCategory].dishes.push(this._dishes[positionDish]);
                this._category[positionCategory].dishes.sort(this.#sortobjects);
            } else {
                throw new DishExistInListException("Dish exists in category records yet.");
            }
        }

        return this;


    }

    /**Función que se encarga de desasignar un plato de una categoría. Si no se encuentra la categoría se lanza una excepción. Si existe,
     * buscamos el plato en la cateogría, si no existe lanzamos una excepción y si existe lo eliminamos de la categoría.
      */
    deassignCategoryToDish(category, ...dishes) {
        let positionCategory = this.#getPosition(this._category, category, Category);

        if (positionCategory !== -1) {
            for (let index = 0; index < dishes.length; index++) {
                let dish = dishes[index];

                let positionDish = this.#getDishPositionsinCategory(dish, this._category[positionCategory]);

                if (positionDish !== -1) {
                    this._category[positionCategory].dishes.splice(positionDish, 1);
                    let notification = `Plato: ${dish.name} eliminado de la categoría: ${category.name}`;
                    console.log(notification);
                } else {
                    throw new DishNotExistInListException("Dish not exist in category records.");
                }

            }
        } else {
            throw new ErrorExistenceElementException("Category don't exists.")
        }

        return this;
    }
    

    /**Las siguientes funciones de asignación siguen la misma metodologia que la anteriormente explicada. */

    assignAllergentoDish(allergen, ...dishes) {
        let positionAllergen = this.#getPosition(this._allergics, allergen, Allergen);
        if (positionAllergen === -1) {
            this.addAllergen(allergen);
            positionAllergen = this.#getPosition(this._allergics, allergen, Allergen);
        }

        for (const dish of dishes) {
            let positionDish = this.#getDishPosition(dish);
            if (positionDish === -1) {
                this.addDish(dish);
                positionDish = this.#getDishPosition(dish);
            }

            const position = this.#getDishPositionsinAllergens(dish, this._allergics[positionAllergen]);

            if (position === -1) {
                this._allergics[positionAllergen].dishes.push(this._dishes[positionDish]);
                this._allergics[positionAllergen].dishes.sort(this.#sortobjects);
            } else {
                throw new DishExistInListException("Dish exists in allergics records yet.");
            }
        }

        return this;

    }

    deassignAllergenToDish(allergen, ...dishes) {

        let positionAllergen = this.#getPosition(this._allergics, allergen, Allergen);

        if (positionAllergen !== -1) {
            for (let index = 0; index < dishes.length; index++) {
                let dish = dishes[index];

                let positionDish = this.#getDishPositionsinAllergens(dish, this._allergics[positionAllergen]);

                if (positionDish !== -1) {
                    this._allergics[positionAllergen].dishes.splice(positionDish, 1);

                    let notification = `Plato: ${dish.name} eliminado del alérgeno: ${allergen.name}`;
                    console.log(notification);
                } else {
                    throw new DishNotExistInListException("Dish not exist in allergics records.");
                }

            }
        } else {
            throw new ErrorExistenceElementException("Category don't exists.")
        }

        return this;
    }

    assignDishtoMenu(menu, ...dishes) {
        let positionMenu = this.#getPosition(this._menus, menu, Menu);
        if (positionMenu === -1) {
            this.addMenu(menu);
            positionMenu = this.#getPosition(this._menus, menu, Menu);
        }

        for (const dish of dishes) {
            let positionDish = this.#getDishPosition(dish);
            if (positionDish === -1) {
                this.addDish(dish);
                positionDish = this.#getDishPosition(dish);
            }

            const position = this.#getDishPositionsinMenu(dish, this._menus[positionMenu]);

            if (position === -1) {
                this._menus[positionMenu].dishes.push(this._dishes[positionDish]);
                this._menus[positionMenu].dishes.sort(this.#sortobjects);
            } else {
                throw new DishExistInListException("Dish exists in menus records yet.");
            }
        }

        return this;

    }

    deassignDishToMenu(menu, ...dishes) {

        let positionMenu = this.#getPosition(this._menus, menu, Menu);

        if (positionMenu !== -1) {
            for (let index = 0; index < dishes.length; index++) {
                let dish = dishes[index];

                let positionDish = this.#getDishPositionsinMenu(dish, this._menus[positionMenu]);

                if (positionDish !== -1) {
                    this._menus[positionMenu].dishes.splice(positionDish, 1);

                    let notification = `Plato: ${dish.name} eliminado del ${menu.name}`;
                    console.log(notification);
                } else {
                    throw new DishNotExistInListException("Dish not exist in menus records.");
                }

            }
        } else {
            throw new ErrorExistenceElementException("Category don't exists.")
        }

        return this;
    }

    /**Función que intercambia la posición de un plato por otro dentro de un menú. Para ello, obtenemos las posiciones dentro del menú de
     * ambos platos. Si los platos no existen en el menú, lanzamos una excepción. En caso contrario, almacenamos la posición de un plato
     * en una variable local para asignarlo luego al otro plato.
     */
    changeDishesPositionsInMenu(menu, dish1, dish2) {
        let positionMenu = this.#getPosition(this._menus, menu, Menu);
        if (dish1 === null || !(dish1 instanceof Dish) && dish2 === null || !(dish2 instanceof Dish)) {
            throw new ErrorExistenceElementException("Dish can't be null and must be Dish object.");
        }

        if (positionMenu !== -1) {
            let positionDish1 = this.#getDishPositionsinMenu(dish1, this._menus[positionMenu]);
            console.log(`Posición del plato ${dish1.name} antes del intercambio: ${positionDish1}`);
            let positionDish2 = this.#getDishPositionsinMenu(dish2, this._menus[positionMenu]);
            console.log(`Posición del plato ${dish2._name} antes del intercambio: ${positionDish2}`);

            if (positionDish1 !== -1 && positionDish2 !== -1) {
                let savePosition = this._menus[positionMenu].dishes[positionDish1];
                this._menus[positionMenu].dishes[positionDish1] = this._menus[positionMenu].dishes[positionDish2];
                this._menus[positionMenu].dishes[positionDish2] = savePosition;

                let positionDishnew1 = this.#getDishPositionsinMenu(dish1, this._menus[positionMenu]);
                console.log(`Posición del plato ${dish1.name} después del intercambio: ${positionDishnew1}`);

                let positionDishnew2 = this.#getDishPositionsinMenu(dish2, this._menus[positionMenu]);
                console.log(`Posición del plato ${dish2._name} antes del intercambio: : ${positionDishnew2}`);

            } else {
                throw new DishNotExistInListException("Dishes don't exist in menu records.");
            }


        }

    }

    /**Función que devuelve un iterable  que almacena los platos de una categoría. */
    * getDishesInCategory(category, orderFunction) {
        let positionCategory = this.#getPosition(this._category, category, Category);

        if (positionCategory !== -1) {
            let array = this._category[positionCategory].dishes;
            if (array.length === 0) {
                throw new ErrorExistenceElementException("No existen platos en esta categoría.");
            } else {
                array.sort(orderFunction);
                for (let i of array) {
                    yield i;
                }
            }
        } else {
            throw new ElementNotRecordedException("Category is not recorded.");
        }
    }

    /**Función que devuelve un iterable  que almacena los platos de un menú. */
    * getDishesInMenu(menu, orderFunction) {
        let positionMenu = this.#getPosition(this._menus, menu, Menu);

        if (positionMenu !== -1) {
            let array = this._menus[positionMenu].dishes;
            if (array.length === 0) {
                throw new ErrorExistenceElementException("No existen platos en este menú.");
            } else {
                array.sort(orderFunction);
                for (let i of array) {
                    yield i;
                }
            }
        } else {
            throw new ElementNotRecordedException("Menu is not recorded.");
        }
    }

    /**Función que devuelve un iterable  que almacena los platos de un alérgeno. */
    * getDishesWithAllergen(allergen, orderFunction) {
        let positionAllergen = this.#getPosition(this._allergics, allergen, Allergen);

        if (positionAllergen !== -1) {
            let array = this._allergics[positionAllergen].dishes;
            if (array.length === 0) {
                throw new ErrorExistenceElementException("No existen platos en este alérgeno.");
            } else {
                array.sort(orderFunction);
                for (let i of array) {
                    yield i;
                }
            }
        } else {
            throw new ElementNotRecordedException("Allergen is not recorded.");
        }
    }

    //Función que devuelve un iterable con los platos que cumplen con el criterio pasado por la función callback.
    * findDishes(dish, functionfind, orderFunction) {

        if (dish === Dish || !dish) {
            throw new ErrorExistenceElementException(`Dish can't be null and must be a Dish Object.`)
        }

        const findDishes1 = this._dishes.filter(functionfind);

        findDishes1.sort(orderFunction);

        for (const dish of findDishes1) {
            yield dish;
        }
    }

    //Método que se encarga de obtener l una categoría dentro del manager.
    getCategoryByName(name){
        //Recorremos todas las categorías y comprobamos si el nombre coincide con el pasado por parámetro.
        for (const category of this._category) { 
            //Si concide, devolvemos la categoría.
            if(category.category.name.toLowerCase() === name.toLowerCase()){
                return category.category;
            }
        }
    }

    //Método que se encarga de obtener un plato dentro del manager.
    getDishByName(name){
        for (const dish of this._dishes) {
            if(dish.name.toLowerCase() === name.toLowerCase()){
                return dish;
            }
        }
    } 

    //Método que se encarga de obtener un alérgeno dentro del manager.
    getAllergenByName(name){
        for (const allergen of this._allergics) {
            if(allergen.allergen.name.toLowerCase() === name.toLowerCase()){
                return allergen.allergen;
            }
        }
    }

    //Método que se encarga de obtener un menú dentro del manager.
    getMenuByName(name){
        for (const menu of this._menus) {
            if(menu.menu.name.toLowerCase() === name.toLowerCase()){
                return menu.menu;
            }
        }
    }

    //Método que se encarga de obtener un restaurante dentro del manager.
    getRestaurantByName(name){
        for (const restaurant of this._restaurants) {
            if(restaurant.name.toLowerCase() === name.toLowerCase()){
                return restaurant;
            }
        }
    }
    
    /**Función que se encarga de crear un plato. En primer lugar, se comprueba que el plato no se encuentra en la lista. Si se encuentra, 
     * devuelve el plato. Si no se encuentra, se crear el plato.
     */
    createDish(name, description, ingredients, image) {
        let dish = this._dishes.find(function (dish) {
            return dish.name.toLowerCase() === name.toLowerCase();
        })
        if (!dish) {
            dish = new Dish(name, description, ingredients, image);
        }

        return dish;
    }

    /**Estas funciones realizan el mismo procedimiento. */
    createMenu(name, description) {
        let menu = this._menus.find(cat => cat.menu.name.toLowerCase() === name.toLowerCase());
        if (!menu) {
            menu = new Menu(name, description);
        } else {
            menu = menu.menu;
        }
        return menu;
    }

    createAllergen(name, description) {
        let allergen = this._allergics.find(cat => cat.allergen.name.toLowerCase() === name.toLowerCase());
        if (!allergen) {
            allergen = new Allergen(name, description);
        } else {
            allergen = allergen.allergen;
        }
        return allergen;
    }

    createCategory(name, description) {

        let category = this._category.find(cat => cat.category.name.toLowerCase() === name.toLowerCase());
        if (!category) {
            category = new Category(name, description);
        } else {
            category = category.category;
        }
        return category;
    }

    createRestaurant(name, description, location) {
        let restaurant = this._restaurants.find(function (restaurant) {
            return restaurant.name.toLowerCase() === name.toLowerCase();
        })
        if (!restaurant) {
            restaurant = new Restaurant(name, description, location);
        }

        return restaurant;
    }

}

export { RestaurantsManager };









