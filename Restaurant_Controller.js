/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 5.
 * Alumno: Santiago Rosado Ruiz.
 * UT05 Práctica 5: Gestión de restaurantes - DOM y MVC.
 */

"use strict";
//Importamos la clase Coordinate.
import { Coordinate } from "./Objetos_restaurante.js"; 
//Importamos la función GetCookie.
import { getCookie } from "./util.js";

/**Creamos las propiedades privadas de nuestro controlador a través de Symbol. Estas propiedades son
 * el modelo (capa donde se recuperarán los datos almacenados), la vista (encargada de visualizar el
 * contenido de la aplicación) y el bread (encargado de gestionar las migas de pan de nuestra web).
 */
const MODEL = Symbol("RestaurantModel");
const VIEW = Symbol("RestaurantView");
const BREAD = Symbol("Bread");
const LOAD_MANAGER_OBJECTS = Symbol("loadManagerObjects");

//Creación de dos Symbol para los campos privados del servicio y usuario autenticado.
const AUTH = Symbol("AUTH");
const USER = Symbol("USER");

/**Clase que funciona como controlador, haciendo de intermediario entre el modelo y la vista. */
class RestaurantController {
  /**El constructor recibe como parámetros el modelo, la vista y el bread. Además, para la realización de
   * la carga inicial de datos, se llama al método onLoad(). En este método se crean las categorías, alér-
   * génos, menus, platos y restaurantes, para posteriormente mostrarlos en la web mediante la vista.
   * También recibe el método bindInit de la vista, para los enlaces del logo e Inicio.
   */
  constructor(model, view, bread, auth) {
    this[MODEL] = model;
    this[VIEW] = view;
    this[BREAD] = bread;
    this[AUTH] = auth;
    this[USER] = null;
    this.onLoad();
    this[VIEW].bindInit(this.handleInit);
  }

  /**Método privado que se encarga de realizar la carga inicial de objetos a través de la funcionalidad de la
   * capa de modelo. Para se ha utilizado la API fetch para cargar los datos desde un archivo JSON.
   */
  async [LOAD_MANAGER_OBJECTS]() {
    
    try {
      //Asignamos a la variable response, la carga de datos del json.
      const response = await fetch('/data/data.json');
      //Asignamos a la variable data, el contenido del json.
      const data = await response.json();

       //Recorremos los datos recuperados.
       for (const literalDish of data.dishes) {
        const dish = this[MODEL].createDish(literalDish.name);
        dish.ingredients = literalDish.ingredients;
        dish.description = literalDish.description;
        dish.image = literalDish.image;
        this[MODEL].addDish(dish);
      }

      //Recorremos los datos recuperados del archivo json, especificamente, los que tengan que ver con categorías.
      for (const literalCategory of data.categories) {
        const category = this[MODEL].createCategory(literalCategory.name);
        category.description = literalCategory.description;
        category.url = literalCategory.url;
        this[MODEL].addCategory(category);

        //Recorremos los platos asignados en cada categoría para asignarlos en el manager.
        for (const literalDishInCategory of literalCategory.dishes) {
          const dish = this[MODEL].getDishByName(literalDishInCategory);
          this[MODEL].assignCategoryToDish(category, dish);
        }
      }

      for (const literalAllergen of data.allergens) {
        const allergen = this[MODEL].createAllergen(literalAllergen.name);
        this[MODEL].addAllergen(allergen);
        for(const literalDishInAllerge of literalAllergen.dishes){
          const dish = this[MODEL].getDishByName(literalDishInAllerge);
          this[MODEL].assignAllergentoDish(allergen, dish);
        }
        }
      
      //Recorremos los menus y les asignamos los platos.
      for (const literalMenu of data.menus) {
        const menu = this[MODEL].createMenu(literalMenu.name);
        this[MODEL].addMenu(menu);
        for(const literalDishInMenu of literalMenu.dishes){
          const dish = this[MODEL].getDishByName(literalDishInMenu);
          this[MODEL].assignDishtoMenu(menu, dish);
        }
      }

        //Recorremos los restaurantes y los creamos.
        for (const literalRestaurant of data.restaurants) {
          const restaurant = this[MODEL].createRestaurant(literalRestaurant.name);
          restaurant.description = literalRestaurant.description
          restaurant.image = literalRestaurant.image;
          const location = new Coordinate(literalRestaurant.location.latitude,literalRestaurant.location.longitude);
          restaurant.location = location;
          this[MODEL].addRestaurant(restaurant);
        }
        
      
     
    } catch (error) {
      console.error(error);
    }
  }

  //Creación de eventos de aplicación.

  /**Método que se encarga de la carga inicial de datos. Se llama al método privado de carga. Además, con en
   * la página principal, se muestran las categorías, platos aleatorios en la zona central, además de los de-
   * splegables con las categorías, alérgenos, menus y restaurantes, se llama a los métodos bind de la vista
   * para enlazar los eventos con los manejadores de eventos.
   */
  onLoad = async () => {
     await this[LOAD_MANAGER_OBJECTS]();
    const iteratorCategories = this[MODEL].categories;
    //Llamada al método showCategories que recibe un array para mostrar las categorías en la zona central.
    this[VIEW].showCategories(iteratorCategories);
    //Llamas a los métodos onAddCategory y onAddOptions para establecer los despegables.
    this.onAddCategory();
    this.onAddOptions();

    const iteratorDishes = this[MODEL].dishes;
    //Llamada al método showDishesRandom que recibe un array para mostrar los platos de forma aleatoria en la zona central.
    this[VIEW].showDishesRandom(iteratorDishes);
    //Llamada al método bindDishesCategory que recibe un manejador de eventos para enlazar los eventos con el manejador de eventos.
    this[VIEW].bindDishesCategory(this.handleDishesCategoryList);
    //Llamada al método bindDishInformation que recibe un manejador de eventos para enlazar los eventos con el manejador de eventos.
    this[VIEW].bindDishInformation(this.handleDishesInformation);
   
    //Detectar si existe la cookie de aceptación del mensaje.
    if(getCookie('acceptedCookieMessage') !== true){
      this[VIEW].showCookiesMessage();
    }

    //Detectar si existe la cookie de usuario activo.
    if (getCookie("activeUser")){
      //Si existe la cookie, se obtiene el usuario.
     const userCookie = getCookie("activeUser");

      if (userCookie){
        //Se obtiene el usuario.
        const user = this[AUTH].getUser(userCookie);
        //Se comprueba que el usuario exista.
        if(user){
          //Se establece el usuario y se llama a la función onOpenSession.
          this[USER] = user;
          this.onOpenSession();
        }
      } else{
          this.onCloseSession();
        }
      //En caso de que no existe la cookie, mostramos el formulario.
    } else{
      this[VIEW].showIdentificationLink();
      this[VIEW].bindIdentificationLink(this.handleLoginForm);
    }
  };

  /**Método para mostrar el contenido si se ha autenticado el usuario.
   */
  onOpenSession(){
    this.onInit();
    this[VIEW].showAuthUserProfile(this[USER]);
    //Llamamos al bind de cerrar sesión después de cargar el perfil de usuario.
    this[VIEW].bindCloseSession(this.handleCloseSession);
    //Llamamos al método show showLoginMessage, para mostrar mensaje de bienvenida.
    this[VIEW].showLoginMessage(this[USER]);
    //Llamada al método showAdminMenu para mostrar en en el header el menún para la administración de nuestro modelo.
    this[VIEW].showAdminMenu();
    this[VIEW].bindAdminMenu(
      this.handleNewDishForm,
      this.handleRemoveDishForm,
      this.handleAssDssDishForm,
      this.handleNewCategoryForm,
      this.handleRemoveCategoryForm,
      this.handleNewRestaurantForm,
      this.handleModifyCategoryofDish,
      this.handleBackUp
    );
    //Llamada al método showFavoriteDishMenu para mostrar el menú para guardar los platos favoritos.
    this[VIEW].showFavoriteDishMenu();
    this[VIEW].bindSaveFavouriteDishes(this.handleFavouriteDish);

    //Llamada al método showFavouriteDishes para mostrar los platos guardados en favoritos.
    this[VIEW].bindConsultFavouriteDishes(this.handleConsultFavouriteDishes);
  }

  //Método que se encargará del cierre de sessión del usuario.
  onCloseSession() {
    //Se elimina el usuario.
    this[USER] = null;
    //Se elimina la cookie de usuario.
    this[VIEW].deleteUserCookie();
    //Se muestra el link para identificación.
    this[VIEW].showIdentificationLink();
    //Se llama al bind para manejar el link de identificación.
    this[VIEW].bindIdentificationLink(this.handleLoginForm);
    //Eliminamos el menú de administración.
    this[VIEW].removeAdminMenu();
    //Eliminamos el menú para guardar platos favorits.
    this[VIEW].removeFavoriteDishMenu();
    
    }

  /**Método que realiza práctica la misma funcón que la carga inicial, sin embargo, este se ejecuta al realizar
   * click en el enlace de Inicio o en el logo de la empresa.
   */
  onInit = () => {
    //Para evitar que se muestran las migas de pan en la página principal, las eliminamos.
    this[BREAD].removeAllCrumbs();
    const iteratorCategories = this[MODEL].categories;
    this[VIEW].showCategories(iteratorCategories);
    const iteratorDishes = this[MODEL].dishes;
    this[VIEW].showDishesRandom(iteratorDishes);
    this[VIEW].bindDishesCategory(this.handleDishesCategoryList);
    this[VIEW].bindDishInformation(this.handleDishesInformation);
  };

  /**Método que se encarga de cargar los desplegables del menu de categorías. Además, enlaza los eventos con los
   * manejadores de eventos.
   */
  onAddCategory = () => {
    const iteratorCategories = this[MODEL].categories;
    //Llamada al método showCategoriesInMenu que recibe un array para mostrar las categorías en el despegable.
    this[VIEW].showCategoriesinMenu(iteratorCategories);
    //Llamada al método bindDishesCategoryInMenu que recibe un manejador de eventos para enlazar los eventos con el manejador de eventos.
    this[VIEW].bindDishesCategoryInMenu(this.handleDishesCategoryList);
  };

  /**Método que se encarga de cargar los desplegables del menu de opciones. Además, enlaza los eventos con los manejadores
   * de eventos.
   */
  onAddOptions = () => {
    const iteratorAllergens = this[MODEL].allergics;
    //Llamada al método showAllergenMenu que recibe un array para mostrar los alérgenos en el menú de opciones.
    this[VIEW].showAllergenMenu(iteratorAllergens);
    //Llamada al método bindAllergenMenu que recibe un manejador de eventos para enlazar los eventos con el manejador de eventos.
    this[VIEW].bindAllergenMenu(this.handleDishesAllergenList);
    const iteratorMenus = this[MODEL].menus;
    //Llamada al método showMenus que recibe un array para mostrar los menus en el menú de opciones.
    this[VIEW].showMenus(iteratorMenus);
    //Llamada al método bindMenus que recibe un manejador de eventos para enlazar los eventos con el manejador de eventos.
    this[VIEW].bindMenus(this.handleDishesMenuList);
    const iteratorRestaurants = this[MODEL].restaurants;
    //Llamada al método showRestaurantsMenu que recibe un array para mostrar los restaurantes en el menú de opciones.
    this[VIEW].showRestaurantsMenu(iteratorRestaurants);
    //Llamada al método bindRestaurantsMenu que recibe un manejador de eventos para enlazar los eventos con el manejador de eventos.
    this[VIEW].bindRestaurants(this.handleRestaurantInformation);
  };

  //Métodos manejadores de los eventos.

  //Manejador de eventos para el enlace de Inicio y el logo de la empresa.
  handleInit = () => {
    this.onInit();
  };

  //Manejador de eventos para mostrar los platos de una determinada categoría.
  handleDishesCategoryList = (title) => {
    let error;
    try {
      //Llamaos al método getCategoryByName para obtener la categoría clickeada el evento click.
      const category = this[MODEL].getCategoryByName(title);
      /**Llamamos al método showDishes que recibe un array, y el método getDishesInCategory para obtener los platos de la categoría
       * seleccionada y un string para mostrar los platos de la categoría en la zona central.**/
      this[VIEW].showDishes(
        this[MODEL].getDishesInCategory(category, (objA, objB) => {
          return objA._name
            .toLocaleLowerCase()
            .localeCompare(objB._name.toLocaleLowerCase());
        }),
        category.name,
        category
      );
      /*Llamamos al método bindDishInformation que recibe un manejador de eventos para enlazar los eventos con el manejador de eventos
      de los platos, con el objeto de mostrar su información al realizar click en su enlace.*/
      this[VIEW].bindDishInformation(this.handleDishesInformation);
      //Limpiamos las migas de pan y añadimos nuevas con el método addCrumb*/
      this[BREAD].removeAllCrumbs();
      this[BREAD].addCrumb("Inicio", "Categorías", title);
      //Enlazamos los eventos con el método bindBreadcrumbs para que al realizar click en una miga de pan, muestre su contenido.
      this[VIEW].bindBreadcrumbs(this.handleBreads);
    } catch (exception) {
      error = exception;
      this[VIEW].showNotDishes(error);
    }
  };

  //Manejador de eventos para mostrar los platos en los que se encuentra el alérgeno indicado. Sigue el mismo proceso que el anterior.
  handleDishesAllergenList = (name) => {
    try {
      const allergen = this[MODEL].getAllergenByName(name);
      this[VIEW].showDishes(
        this[MODEL].getDishesWithAllergen(allergen, (objA, objB) => {
          return objA._name
            .toLocaleLowerCase()
            .localeCompare(objB._name.toLocaleLowerCase());
        }),
        allergen.name,
        allergen
      );
      this[VIEW].bindDishInformation(this.handleDishesInformation);
      this[BREAD].removeAllCrumbs();
      this[BREAD].addCrumb("Inicio", "Alérgenos", name);
      this[VIEW].bindBreadcrumbs(this.handleBreads);
    } catch (error) {
      console.error(
        "Se produjo un error al manejar la lista de platos por alérgeno:",
        error
      );
    }
  };

  //Manejador de eventos para mostrar los platos del menú indicado. Sigue el mismo proceso que el anterior.
  handleDishesMenuList = (name) => {
    try {
      const menu = this[MODEL].getMenuByName(name);
      this[VIEW].showDishes(
        this[MODEL].getDishesInMenu(menu, (objA, objB) => {
          return objA._name
            .toLocaleLowerCase()
            .localeCompare(objB._name.toLocaleLowerCase());
        }),
        menu.name,
        menu
      );
      this[VIEW].bindDishInformation(this.handleDishesInformation);
      this[BREAD].removeAllCrumbs();
      this[BREAD].addCrumb("Inicio", "Menus", name);
      this[VIEW].bindBreadcrumbs(this.handleBreads);
    } catch (error) {
      console.error(
        "Se produjo un error al manejar la lista de platos por alérgeno:",
        error
      );
    }
  };

  //Manejador de eventos para mostrar la información del restaurante indicado. Sigue el mismo proceso que el anterior.
  handleRestaurantInformation = (name) => {
    try {
      const restaurant = this[MODEL].getRestaurantByName(name);
      this[VIEW].showRestaurantInformation(restaurant);
      this[BREAD].removeAllCrumbs();
      this[BREAD].addCrumb("Inicio", "Restaurantes", restaurant.name);
      this[VIEW].bindBreadcrumbs(this.handleBreads);
    } catch (error) {
      console.error(
        "Se produjo un error al mostrar la información del plato:",
        error
      );
      alert("Se produjo un error al mostrar la información del plato:", error);
    }
  };

  //Manejador de eventos para mostrar la información del plato indicado. Sigue el mismo proceso que el anterior.
  handleDishesInformation = (name) => {
    try {
      const dish = this[MODEL].getDishByName(name);
      this[VIEW].showDishInformation(dish);
      this[BREAD].addCrumb("Platos", dish.name);
      this[VIEW].bindBreadcrumbs(this.handleBreads);
    } catch (error) {
      console.error(
        "Se produjo un error al mostrar la información del plato:",
        error
      );
      alert("Se produjo un error al mostrar la información del plato:", error);
    }
  };

  //Manejador de eventos que se encarga de gestionar el contenido mostrado al puslar en una miga de pan.
  handleBreads = (name) => {
    try {
      //Recuperamos el nombre de la categoría, menu o alérgeno clickeado el evento click.
      const allergen = this[MODEL].getAllergenByName(name) || "";
      const menu = this[MODEL].getMenuByName(name) || "";
      const category = this[MODEL].getCategoryByName(name) || "";
      //Recuperamos el elemento que contiene las migas de pan.
      const on = document.getElementById("dropdowns");

      /*Creamos switch para manejar las situaciones mediante el nombre pasado de la miga de pan.*/
      switch (name) {
        case "Inicio":
          this.onInit();
          break;

        case "Categorías":
          this.onInit();
          break;

        case "Alérgenos":
          this.onInit();
          on.classList.add("show");
          setTimeout(() => {
            on.classList.remove("show");
          }, 5000);

          break;

        case "Menus":
          this.onInit();
          on.classList.add("show");
          setTimeout(() => {
            on.classList.remove("show");
          }, 5000);
          break;

        case "Restaurantes":
          this.onInit();
          on.classList.add("show");
          setTimeout(() => {
            on.classList.remove("show");
          }, 5000);
          break;

        case "Platos":
          this.onInit();
          break;

        /*En el caso de las categorías, restaurantes, alérgenos y menús, se ha vuelta a enlazar los eventos
        con el manejador de eventos.*/
        case allergen.name:
          this[VIEW].showDishes(
            this[MODEL].getDishesWithAllergen(allergen, (objA, objB) => {
              return objA._name
                .toLocaleLowerCase()
                .localeCompare(objB._name.toLocaleLowerCase());
            }),
            allergen.name,
            "allergen"
          );
          this[BREAD].removeAllCrumbs();
          this[BREAD].addCrumb("Inicio", "Alérgenos", name);
          this[VIEW].bindBreadcrumbs(this.handleBreads);
          this[VIEW].bindAllergenMenu(this.handleDishesAllergenList);
          this[VIEW].bindDishInformation(this.handleDishesInformation);
          break;

        case category.name:
          this[VIEW].showDishes(
            this[MODEL].getDishesInCategory(category, (objA, objB) => {
              return objA._name
                .toLocaleLowerCase()
                .localeCompare(objB._name.toLocaleLowerCase());
            }),
            category.name,
            "category"
          );
          this[BREAD].removeAllCrumbs();
          this[BREAD].addCrumb("Inicio", "Categorías", name);
          this[VIEW].bindBreadcrumbs(this.handleBreads);
          this[VIEW].bindAllergenMenu(this.handleDishesAllergenList);
          this[VIEW].bindDishInformation(this.handleDishesInformation);
          break;

        case menu._name:
          this[VIEW].showDishes(
            this[MODEL].getDishesInMenu(menu, (objA, objB) => {
              return objA._name
                .toLocaleLowerCase()
                .localeCompare(objB._name.toLocaleLowerCase());
            }),
            menu.name,
            "menu"
          );
          this[BREAD].removeAllCrumbs();
          this[BREAD].addCrumb("Inicio", "Menus", name);
          this[VIEW].bindBreadcrumbs(this.handleBreads);
          this[VIEW].bindAllergenMenu(this.handleDishesAllergenList);
          this[VIEW].bindDishInformation(this.handleDishesInformation);
          this[VIEW].bindDishesCategoryInMenu(this.handleDishesCategoryList);
          this[VIEW].bindMenus(this.handleDishesMenuList);
          this[VIEW].bindRestaurants(this.handleRestaurantInformation);
          break;
      }
    } catch (error) {
      console.error("Se produjo un error al manejar los breadcrumbs", error);
    }
  };

  //Manejador de eventos que se encarga de mostrar el formulario de crear plato.
  handleNewDishForm = () => {
    this[VIEW].showDishCreationForm(
      this[MODEL].categories,
      this[MODEL].allergics
    );
    this[VIEW].bindNewDishForm(this.handleNewDish);
    this[BREAD].removeAllCrumbs();
    this[BREAD].addCrumb("Administración", "Crear plato");
  };

  //Manejador de eventos que se encarga de mostrar el formulario de eliminar plato. 
  handleRemoveDishForm = () => {
    this[VIEW].showRemoveDishForm(this[MODEL].dishes);
    this[VIEW].bindRemoveDish(this.handleRemoveDish);
    this[BREAD].removeAllCrumbs();
    this[BREAD].addCrumb("Administración", "Eliminar platos");
  };

  //Manejador de eventos que se encarga de mostrar el formulario para asignar o desasignar un plato de un menú.
  handleAssDssDishForm = () => {
    this[VIEW].showAssignDishesForm(this[MODEL].dishes, this[MODEL].menus);
    this[VIEW].bindShowDishInMenus(this.handleShowDishInMenus);
    this[VIEW].bindAssignDishInMenu(this.handleAssignDishtoMenu);
    this[VIEW].bindDesAssignDishInMenu(this.handleDesassignDishToMenu);
    this[BREAD].removeAllCrumbs();
    this[BREAD].addCrumb("Administración", "Asignar platos a menús");
  };

  //Manejador de eventos que se encarga de mostrar el formulario para asignar o desasignar un plato a una categoría.
  handleModifyCategoryofDish = () => {
    this[VIEW].showModifyCategoryForm(
      this[MODEL].dishes,
      this[MODEL].categories
    );
    this[VIEW].bindShowDishInCategories(this.handleShowDishInCategories);
    this[VIEW].bindAssignDishInCategory(this.handleAssignDishtoCategory);
    this[VIEW].bindDesassignDishInCategory(this.handleDesassignDishToCategory);
    this[BREAD].removeAllCrumbs();
    this[BREAD].addCrumb("Administración", "Modificar categorías");
  };

  //Manejador de eventos que se encarga de mostrar el formulario para crear una nueva categoría.
  handleNewCategoryForm = () => {
    this[VIEW].showNewCategoryForm();
    this[VIEW].bindNewCategoryForm(this.handleCreateCategory);
    this[BREAD].removeAllCrumbs();
    this[BREAD].addCrumb("Administración", "Crear Categoría");
  };

  //Manejador de eventos que se encarga de mostrar el formulario para eliminar una categoría.
  handleRemoveCategoryForm = () => {
    this[VIEW].showRemoveCategoryForm(this[MODEL].categories);
    this[VIEW].bindRemoveCategoryForm(this.handleRemoveCategory);
    this[BREAD].removeAllCrumbs();
    this[BREAD].addCrumb("Administración", "Eliminar Categoría");
  };

  //Manejador de eventos que se encarga de mostrar el formulario para crear un nuevo restaurante.
  handleNewRestaurantForm = () => {
    this[VIEW].shownewRestaurantForm();
    this[VIEW].bindNewRestaurantForm(this.handleNewRestaurant);
    this[BREAD].removeAllCrumbs();
    this[BREAD].addCrumb("Administración", "Crear Restaurante");
  };

  //Manejador de eventos que se encarga de la gestión para crear un nuevo plato.
  handleNewDish = (
    name,
    description,
    url,
    ingredients,
    categories,
    allergens
  ) => {
    let done;
    let error;
    let dish;

    try {
      dish = this[MODEL].createDish(name, description, ingredients, url);
      dish.image = url;
      dish.ingredients = ingredients;
      dish.description = description;
      console.log(dish);
      this[MODEL].addDish(dish);
      categories.forEach((name) => {
        const category = this[MODEL].getCategoryByName(name);
        this[MODEL].assignCategoryToDish(category, dish);
      });

      allergens.forEach((name) => {
        const allergen = this[MODEL].getAllergenByName(name);
        this[MODEL].assignAllergentoDish(allergen, dish);
      });
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showNewDishModal(done, dish, error);
  };

  //Manejador de eventos que se encarga de la gestión para eliminar un plato.
  handleRemoveDish = (name) => {
    let done;
    let error;
    let dish;
    console.log(name);
    try {
      dish = this[MODEL].getDishByName(name);
      this[MODEL].removeDish(dish);
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }
    this[VIEW].showRemoveDishModal(done, dish, error);
  };

  //Manejador de eventos que se encarga de la gestión para asignar un plato a un menú.
  handleAssignDishtoMenu = (name, menuName) => {
    let done;
    let error;
    let dish;
    let menu;
    try {
      dish = this[MODEL].getDishByName(name);
      console.log(dish);
      menu = this[MODEL].getMenuByName(menuName);
      this[MODEL].assignDishtoMenu(menu, dish);
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }
    this[VIEW].showAssignDishModal(done, dish, error);
  };

  //Manejador de eventos que se encarga de la gestión para desasignar un plato de un menú.
  handleDesassignDishToMenu = (name, menuName) => {
    let done;
    let error;
    let dish;
    let menu;
    try {
      dish = this[MODEL].getDishByName(name);
      menu = this[MODEL].getMenuByName(menuName);
      this[MODEL].deassignDishToMenu(menu, dish);

      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showDesassignDishModal(done, dish, error);
  };

  //Manejador de eventos que se encarga de mostrar los menús a los que pertenece un plato.
  handleShowDishInMenus = (dish) => {
    let menus;
    try {
      menus = this[MODEL].dishInMenus(dish);
      this[VIEW].showMenusWithDish(dish, menus);
    } catch (exception) {
      console.error(
        "Se produjo un error al mostrar los menus donde se encuentra el plato",
        exception
      );
    }
  };

  //Manejador de eventos que se encarga de mostrar las categorías a las que pertenece un plato.
  handleShowDishInCategories = (dish) => {
    let categories;
    try {
      categories = this[MODEL].dishInCategory(dish);
      this[VIEW].showCategoryWithDish(dish, categories);
    } catch (exception) {
      console.error(
        "Se produjo un error al mostrar las categorías donde se encuentra el plato",
        exception
      );
    }
  };

  //Manejador para crear una categoría.
  handleCreateCategory = (name, url, desc) => {
    const cat = this[MODEL].createCategory(name, url);
    cat.description = desc;
    let done;
    let error;
    try {
      this[MODEL].addCategory(cat);
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }
    this[VIEW].showNewCategoryModal(done, cat, error);
    this[VIEW].showUpdateCategoryMenu(this[MODEL].categories);
    this[VIEW].bindDishesCategoryInMenu(this.handleDishesCategoryList);
  };

//Manejador para eliminar una categoría.
  handleRemoveCategory = (name) => {
    let done;
    let error;
    let cat;
    try {
      done = true;
      cat = this[MODEL].getCategoryByName(name);
      this[MODEL].removeCategory(cat);
    } catch (exception) {
      done = false;
      error = exception;
    }
    this[VIEW].showRemoveCategoryModal(done, cat, error);
    this[VIEW].showUpdateCategoryMenu(this[MODEL].categories);
    this[VIEW].bindDishesCategoryInMenu(this.handleDishesCategoryList);
  };

  //Manejador para asignar un plato a una categoría.
  handleAssignDishtoCategory = (name, categoryName) => {
    let done;
    let error;
    let dish;
    let category;
    let categories;
    try {
      dish = this[MODEL].getDishByName(name);
      console.log(dish);
      category = this[MODEL].getCategoryByName(categoryName);
      this[MODEL].assignCategoryToDish(category, dish);
      categories = this[MODEL].dishInCategory(dish.name);
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }
    this[VIEW].showAssignDishCategoryModal(done, dish, error, categories);
  };

  //Manejador para desasignar un plato de una categoría.
  handleDesassignDishToCategory = (name, categoryName) => {
    let done;
    let error;
    let dish;
    let category;
    let categories;
    try {
      dish = this[MODEL].getDishByName(name);
      category = this[MODEL].getCategoryByName(categoryName);
      this[MODEL].deassignCategoryToDish(category, dish);
      categories = this[MODEL].dishInCategory(dish.name);

      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showDesassignDishCategoryModal(done, dish, error, categories);
  };

  //Manejador para crear un nuevo restaurante.
  handleNewRestaurant = (name, description, url, latitude, longitude) => {
    let done;
    let error;
    let restaurant;
    const location = new Coordinate(latitude, longitude);

    try {
      restaurant = this[MODEL].createRestaurant(name, description, url);
      restaurant.image = url;
      restaurant.description = description;
      restaurant.location = location;
      this[MODEL].addRestaurant(restaurant);

      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showNewRestaurantModal(done, restaurant, error);
    this[VIEW].showUpdateRestaurantMenu(this[MODEL].restaurants);
    this[VIEW].bindRestaurants(this.handleRestaurantInformation);
  };

  /**Manejador para abir el formulario. */
  handleLoginForm = () => {
    this[VIEW].showLoginForm();
    this[VIEW].bindLoginForm(this.handleLogin);
  };

  /**Manejador para realizar la validación del usuario. */
  handleLogin = (username, password, remember) => {
    //Si el nombre del usuario y la contraseña es válido, recuperamosun objeto User del servicio de autenticación.
    if(this[AUTH].validateUser(username, password)){
      this[USER] = this[AUTH].getUser(username);
      this.onOpenSession();
      if(remember){
        this[VIEW].setUserCookie(this[USER]);
      }
    } else{
      this[VIEW].showInvalidUserMessage();
    }
  }

  /**Manejador para cerrar sesión. */
  handleCloseSession = () => {
    this.onCloseSession();
    this.onInit();
    };

    /**Manejador para mostrar la página para seleccionar los platos favoritos. */
  handleFavouriteDish = () => {
    this[VIEW].showSelectFavouriteDishes(this[MODEL].dishes);
    this[VIEW].bindDishInformation(this.handleDishesInformation);
    this[VIEW].bindSaveDishCard(this.handleSaveFavouriteDishes);
    this[BREAD].removeAllCrumbs();
  }

  /**Manejador que se va encargar de guardar los platos favoritos. */
  handleSaveFavouriteDishes = (name) => {
    try {
      const card = document.getElementById(name);
      const p = document.createElement("p");
  
    
      if (localStorage.getItem(name) === null) {
     
        localStorage.setItem(name, name);
        p.innerHTML = "Guardado";
        card.append(p);
      } else {
        p.innerHTML = "Ya guardado";
        card.append(p);
      }

      for (let i = 0; i < localStorage.length; i++) {
        const dish = localStorage.key(i);
        console.log(localStorage.getItem(dish));
      }
    } catch (exception) {
      console.error("Error al guardar los platos favoritos", exception);
    } 
  }

  /**Manejador que se va a encargar de mostrar los platos guardados en favoritos. */
  handleConsultFavouriteDishes = () => {
    let arrayDishes =[];
    let error = false;
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      let dish = this[MODEL].getDishByName(value);
      arrayDishes.push(dish);
    }

    if(arrayDishes.length === 0){
      error = true;
      this[VIEW].showNotDishes(error);
    } else {
    
    this[VIEW].showFavouriteDishes(arrayDishes);
    this[VIEW].bindDishInformation(this.handleDishesInformation);
    this[BREAD].removeAllCrumbs();
  }

  
}

 /**Manejador que se encargará de realizar la backup de todos los objetos de la app. */
 handleBackUp = async () => {
  let done;

  try {
    //Esperar que la función backup complete y obtener el resultado.
    done = await this[MODEL].backup();
  } catch (exception) {
    
    console.error("Error al realizar el backup", exception);
  }

  // Mostrar el modal con el resultado del backup, sea exitoso o no
  this[VIEW].showBackupModal(done);
}

  
}

//Exportamos la clase RestaurantController.
export default RestaurantController;
