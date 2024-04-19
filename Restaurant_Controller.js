/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 5.
 * Alumno: Santiago Rosado Ruiz.
 * UT05 Práctica 5: Gestión de restaurantes - DOM y MVC.
 */

"use strict";
//Importamos la clase Coordinate.
import { Coordinate } from "./Objetos_restaurante.js";

/**Creamos las propiedades privadas de nuestro controlador a través de Symbol. Estas propiedades son
 * el modelo (capa donde se recuperarán los datos almacenados), la vista (encargada de visualizar el
 * contenido de la aplicación) y el bread (encargado de gestionar las migas de pan de nuestra web).
 */
const MODEL = Symbol("RestaurantModel");
const VIEW = Symbol("RestaurantView");
const BREAD = Symbol("Bread");
const LOAD_MANAGER_OBJECTS = Symbol("loadManagerObjects");

/**Clase que funciona como controlador, haciendo de intermediario entre el modelo y la vista. */
class RestaurantController {
  /**El constructor recibe como parámetros el modelo, la vista y el bread. Además, para la realización de
   * la carga inicial de datos, se llama al método onLoad(). En este método se crean las categorías, alér-
   * génos, menus, platos y restaurantes, para posteriormente mostrarlos en la web mediante la vista.
   * También recibe el método bindInit de la vista, para los enlaces del logo e Inicio.
   */
  constructor(model, view, bread) {
    this[MODEL] = model;
    this[VIEW] = view;
    this[BREAD] = bread;
    this.onLoad();
    this[VIEW].bindInit(this.handleInit);
  }

  /**Método privado que se encarga de realizar la carga inicial de objetos a través de la funcionalidad de la
   * capa de modelo.
   */
  [LOAD_MANAGER_OBJECTS]() {
    try {
      //Llamamos al método createCateogry() del modelo, para crear las categorías y recuperarlas (factorías).
      const category1 = this[MODEL].createCategory("Carne");
      const category2 = this[MODEL].createCategory("Pescados");
      const category3 = this[MODEL].createCategory("Postres");

      category1.description = "Carnes a la parrilla";
      category2.description = "Platos compuestos principalmente por pescados";
      category3.description = "Postres artesanales de la casa";

      category1.url = "/Imagenes/categorias/category_meal.jpg";
      category2.url = "/Imagenes/categorias/category_fish.jpg";
      category3.url = "/Imagenes/categorias/category_dessert.jpg";

      //Llamamos al método addCategory() del modelo, para añadir las categorías creadas al modelo.
      this[MODEL].addCategory(category1, category2, category3);

      //Creamos los platos llamando al método createDish() del modelo, para crearlos y recuperarlos (factorías).
      const dish1 = this[MODEL].createDish("Pastel de Carne al horno");

      const dish2 = this[MODEL].createDish(
        "Salmón a la plancha con arroz y espárragos"
      );

      const dish3 = this[MODEL].createDish("Solomillo con salsa de pistacho");

      const dish4 = this[MODEL].createDish(
        "Brocheta de calabacín y polló al limón"
      );

      const dish5 = this[MODEL].createDish("Peceto de ternera al vino tinto");

      const dish6 = this[MODEL].createDish(
        "Ensalada de átun con arroz y espárragos"
      );

      const dish7 = this[MODEL].createDish("Sopa de pescado");

      const dish8 = this[MODEL].createDish("Pulpo a la plancha con polenta");

      const dish9 = this[MODEL].createDish("Coulan de chocolate");

      const dish10 = this[MODEL].createDish("Tarta de queso de la casa");

      const dish11 = this[MODEL].createDish(
        "Tartaleta de lima con Gin & Tonic"
      );

      const dish12 = this[MODEL].createDish(
        "Pudding de albahaca con frutos rojos"
      );

      /**Creación de la propiedad ingredientes, imagen y descripción para los platos. */
      dish1.ingredients = ["Carne de res", "Harina"];
      dish2.ingredients = ["Salmón", "Arroz", "Espárragos"];
      dish3.ingredients = ["Solomillo", "Pistacho", "Pimiento"];
      dish4.ingredients = ["Calabacín", "Pollón", "Limón", "Cebolla"];
      dish5.ingredients = ["Ternera", "Vino tinto", "Azúcar"];
      dish6.ingredients = ["Átun", "Arroz", "Espárragos"];
      dish7.ingredients = ["Gambas", "Langostino"];
      dish8.ingredients = ["Pulpo", "Polenta"];
      dish9.ingredients = ["Chocolate"];
      dish10.ingredients = ["Queso crema", "Azúcar", "Harina", "Leche"];
      dish11.ingredients = ["Lima", "Gin & Tonic"];
      dish12.ingredients = ["Albahaca", "Frutos rojos", "Azúcar"];

      dish1.image = "/Imagenes/Platos/pastel_carne.jpg";
      dish2.image = "/Imagenes/Platos/salmon.jpg";
      dish3.image = "/Imagenes/Platos/solomillo.jpg";
      dish4.image = "/Imagenes/Platos/brochetas-de-pollo-al-horno.jpg";
      dish5.image = "/Imagenes/Platos/peceto_tinto.jpg";
      dish6.image = "/Imagenes/Platos/ensalada_atun.jpg";
      dish7.image = "/Imagenes/Platos/sopa_pescado.jpg";
      dish8.image = "/Imagenes/Platos/pulpo.jpg";
      dish9.image = "/Imagenes/Platos/coulan.jpg";
      dish10.image = "/Imagenes/Platos/tarta_queso.jpg";
      dish11.image = "/Imagenes/Platos/tartaleta.png";
      dish12.image = "/Imagenes/Platos/puddin.png";

      dish1.description = `Un clásico reconfortante de la cocina, el pastel de carne al horno es una deliciosa obra maestra de capas jugosas de carne molida sazonada, 
      intercaladas con tiernas capas de puré de papas. Horneado a la perfección, este plato ofrece una explosión de sabores reconfortantes, 
      con la carne jugosa y bien sazonada que se combina armoniosamente con la suavidad cremosa del puré de papas. 
      Es la definición misma de confort en cada bocado.`;
      dish2.description = `El salmón a la plancha con arroz y espárragos es una deliciosa sinfonía de sabores y texturas. En este elegante plato, 
      un filete de salmón perfectamente dorado reposa sobre un lecho de arroz blanco, tierno y esponjoso, acompañado de espárragos frescos y crujientes. 
      El Salmón a la plancha con arroz y espárragos es una deliciosa combinación de sabores.`;
      dish3.description = `El solomillo con salsa de pistacho es un plato sofisticado y lleno de sabor. Esta joya culinaria presenta un solomillo tierno y jugoso, 
      cocinado a la perfección, y bañado en una rica y cremosa salsa de pistachos, que le aporta una textura única y un sabor ligeramente dulce`;
      dish4.description = `La brocheta de calabacín y pollo es un plato vibrante y lleno de sabor, perfecto para los amantes de la comida saludable y deliciosa. 
      Alternando trozos de pollo tierno y jugoso con rodajas frescas de calabacín, estas brochetas se cocinan a la parrilla hasta alcanzar la perfección dorada, 
      lo que les confiere un delicioso sabor ahumado`;
      dish5.description = `El peceto de ternera al vino tinto es un plato elegante y sabroso, que combina la ternura del peceto con la riqueza del vino tinto. 
      Este corte de carne se cocina lentamente en una salsa de vino tinto, junto con hierbas aromáticas y verduras seleccionadas, lo que permite que los sabores se 
      fusionen maravillosamente.`;
      dish6.description = `La ensalada de atún con arroz y espárragos es una delicia ligera y nutritiva, perfecta para un almuerzo refrescante o una cena ligera. 
      Este plato combina la suavidad del atún en lata, rico en omega-3, con el arroz esponjoso y tierno y los espárragos crujientes y ligeramente al dente, 
      creando una mezcla de texturas agradables al paladar.`;
      dish7.description = `La sopa de pescado es un reconfortante y aromático plato que captura la esencia del mar. Hecha con una base de caldo rico y sabroso, 
      obtenido de la cocción lenta de pescados y mariscos, esta sopa se enriquece con una selección de hierbas y vegetales frescos.`;
      dish8.description = `El pulpo a la plancha con polenta es una combinación sublime de sabores y texturas. El pulpo, tierno y ligeramente ahumado por la parrilla,
       se sirve sobre una base de polenta cremosa y reconfortante. La polenta, elaborada con harina de maíz y caldo, adquiere una textura suave y sedosa que complementa 
       perfectamente la firmeza del pulpo.`;
      dish9.description = `El coulant de chocolate es una exquisitez indulgente que deleita los sentidos. Al romper su delicada corteza exterior, revela un corazón fundido 
      de chocolate caliente y sedoso que fluye hacia fuera, creando una experiencia sensorial inolvidable.`;
      dish10.description = `La tarta de queso es un clásico reconfortante que combina la suavidad y cremosidad del queso con la dulzura sutil de una base de galletas trituradas. 
      Esta delicia horneada se caracteriza por su textura sedosa y su sabor agradablemente ácido, que resulta de la combinación de queso crema, huevos, azúcar y, a veces, un 
      toque de vainilla o ralladura de limón. La base de galleta aporta un contraste crujiente y sabroso que complementa perfectamente la consistencia suave del relleno de queso.`;
      dish11.description = `La tartaleta es una delicia que combina la dulzura sutil de una base de galletas trituradas con el sabor delicioso de una tarta.`;
      dish12.description = `El pudding es un clásico postre reconfortante que ha cautivado los paladares durante generaciones. Hecho con una base de ingredientes simples como leche, 
      huevos, azúcar y pan o galletas, el pudding adquiere una textura suave y cremosa durante su cocción lenta al horno o al vapor.`;

      //Llamamos al método addDish() del modelo, para añadir los platos creados al modelo.
      this[MODEL].addDish(
        dish1,
        dish2,
        dish3,
        dish4,
        dish5,
        dish6,
        dish7,
        dish8,
        dish9,
        dish10,
        dish11,
        dish12
      );

      //Llamamos al método assignCategoryToDish() del modelo, para asignar los platos a las categorías.
      this[MODEL].assignCategoryToDish(category1, dish1, dish3, dish4, dish5);
      this[MODEL].assignCategoryToDish(category2, dish2, dish6, dish7, dish8);
      this[MODEL].assignCategoryToDish(
        category3,
        dish9,
        dish10,
        dish11,
        dish12
      );

      //Creamos los alérgenos.
      const allergen1 = this[MODEL].createAllergen("Gluten");
      const allergen2 = this[MODEL].createAllergen("Lactosa");
      const allergen3 = this[MODEL].createAllergen("Soja");
      const allergen4 = this[MODEL].createAllergen("Sulfitos");

      //Llamamos al método addAllergen() del modelo, para añadir los alérgenos creados.
      this[MODEL].addAllergen(allergen1, allergen2, allergen3, allergen4);

      //Llamamos al método assignDishtoAllergen() del modelo, para asignar los alérgenos a los platos.
      this[MODEL].assignAllergentoDish(
        allergen1,
        dish9,
        dish10,
        dish11,
        dish12
      );
      this[MODEL].assignAllergentoDish(
        allergen2,
        dish1,
        dish3,
        dish9,
        dish10,
        dish11
      );
      this[MODEL].assignAllergentoDish(allergen3, dish6, dish3, dish8);
      this[MODEL].assignAllergentoDish(allergen4, dish5, dish7, dish4);

      //Creamos los menús.
      const menu1 = this[MODEL].createMenu("Menu 1");
      const menu2 = this[MODEL].createMenu("Menu 2");
      const menu3 = this[MODEL].createMenu("Menu 3");

      //Llamamos al método addMenu() del modelo, para añadir los menús creados al modelo.
      this[MODEL].addMenu(menu1, menu2, menu3);

      //Llamamos al método assignDishtoMenu() del modelo, para asignar los platos a los menus.
      this[MODEL].assignDishtoMenu(menu1, dish6, dish1, dish9);
      this[MODEL].assignDishtoMenu(menu2, dish2, dish3, dish10);
      this[MODEL].assignDishtoMenu(menu3, dish4, dish5, dish11);

      //Creamos los restaurantes, llamando al método createRestaurant() del modelo, para crearlos y recuperarlos (factorías).
      const location1 = new Coordinate(
        "39.16132079848615",
        "-3.0316452337293014"
      );
      const location2 = new Coordinate(
        "39.16926102209715",
        "-3.2299912480103776"
      );
      const location3 = new Coordinate(
        "39.30549734708699",
        "-3.043940753140606"
      );

      const restaurant1 = this[MODEL].createRestaurant(
        "El Asador de la Mancha"
      );

      const restaurant2 = this[MODEL].createRestaurant("El Rincón del Quijote");

      const restaurant3 = this[MODEL].createRestaurant("El Porrón");

      //Creación de las propiedades descripción y localizacón para los restaurantes.
      restaurant1.description = `El Asador de la Mancha es un restaurante especializado en asaduras, ubicado en Tomelloso (Ciudad Real) que ofrece una experiencia 
      culinaria única y auténtica. Ubicado en el corazón de la región de La Mancha, este establecimiento se destaca por su ambiente acogedor y su cocina tradicional. Con un enfoque en 
      la excelencia de los cortes de carne y la técnica de asado, el Asador de la Mancha deleita a sus comensales con una selección de platos que resaltan 
      los sabores y la calidad de los ingredientes locales. Desde jugosas chuletas hasta deliciosas mollejas, cada bocado es una celebración de la rica 
      tradición gastronómica de la zona. Con un servicio atento y una atención meticulosa a los detalles, el Asador de la Mancha ofrece una experiencia 
      gastronómica inolvidable para los amantes de la buena comida y la cocina regional española.`;
      restaurant2.description = `El Rincón del Quijote es un restaurante que rinde homenaje a la rica tradición gastronómica española, con un enfoque particular
      en la alta cocina. Situado en Cinco Casas (Ciudad Real), este establecimiento combina la elegancia y el refinamiento con la pasión por la cocina de autor. 
      Inspirados por los sabores y la cultura de La Mancha, los chefs del Rincón del Quijote crean platos innovadores que sorprenden y deleitan a los comensales 
      más exigentes. Desde exquisitas tapas hasta elaboradas creaciones culinarias, cada plato es una obra maestra que refleja la creatividad y el talento de su 
      equipo de cocina. Con una cuidada selección de ingredientes frescos y de alta calidad, así como un servicio impecable, el Rincón del Quijote ofrece una 
      experiencia gastronómica única que invita a los clientes a sumergirse en un viaje culinario inolvidable.`;
      restaurant3.description = `El Porron, ubicado en Tomelloso, es un restaurante que destaca por su versatilidad y su amplio abanico de opciones culinarias. Con una atmósfera 
      acogedora y un ambiente familiar, este establecimiento ofrece una experiencia gastronómica para todos los gustos y ocasiones. Desde platos tradicionales de la cocina manchega 
      hasta especialidades internacionales, el Porron tiene algo para satisfacer a todos los paladares. Ya sea que desees disfrutar de una suculenta paella, una deliciosa pizza o un exquisito 
      plato de carne a la parrilla, este restaurante lo tiene todo. Además, su atención cálida y su servicio eficiente hacen que cada visita al Porron sea una experiencia memorable para toda 
      la familia y los amigos.`;

      restaurant1.location = location1;
      restaurant2.location = location2;
      restaurant3.location = location3;

      restaurant1.image = "/Imagenes/Restaurantes/asador.jpg";
      restaurant2.image = "/Imagenes/Restaurantes/quijote.jpg";
      restaurant3.image = "/Imagenes/Restaurantes/restaurant_porron.jpg";
      //Llamamos al método addRestaurant() del modelo, para añadir los restaurantes creados al modelo.
      this[MODEL].addRestaurant(restaurant1, restaurant2, restaurant3);
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
  onLoad = () => {
    this[LOAD_MANAGER_OBJECTS]();
    const iteratorCategories = this[MODEL].categories;
    //Llamada al método showCategories que recibe un array para mostrar las categorías en la zona central.
    this[VIEW].showCategories(iteratorCategories);
    //Llamas a los métodos onAddCategory y onAddOptions para establecer los despegables.
    this.onAddCategory();
    this.onAddOptions();
    const iteratorDishes = this[MODEL].dishes;
    //Llamada al método showDishesRandom que recibe un array para mostrar los platos de forma aleatoria en la zona central.
    this[VIEW].showDishesRandom(iteratorDishes);
    //Llamada al método showAdminMenu para mostrar en en el header el menún para la administración de nuestro modelo.
    this[VIEW].showAdminMenu();
    //Llamada al método bindDishesCategory que recibe un manejador de eventos para enlazar los eventos con el manejador de eventos.
    this[VIEW].bindDishesCategory(this.handleDishesCategoryList);
    //Llamada al método bindDishInformation que recibe un manejador de eventos para enlazar los eventos con el manejador de eventos.
    this[VIEW].bindDishInformation(this.handleDishesInformation);
    this[VIEW].bindAdminMenu(
      this.handleNewDishForm,
      this.handleRemoveDishForm,
      this.handleAssDssDishForm,
      this.handleNewCategoryForm,
      this.handleRemoveCategoryForm,
      this.handleNewRestaurantForm,
      this.handleModifyCategoryofDish
    );
  };

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

  //Manejador de eventos que e encarga de mostrar el formulario de crear plato.
  handleNewDishForm = () => {
    this[VIEW].showDishCreationForm(
      this[MODEL].categories,
      this[MODEL].allergics
    );
    this[VIEW].bindNewDishForm(this.handleNewDish);
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

  handleRemoveDishForm = () => {
    this[VIEW].showRemoveDishForm(this[MODEL].dishes);
    this[VIEW].bindRemoveProduct(this.handleRemoveDish);
  };

  handleAssDssDishForm = () => {
    this[VIEW].showAssignDishesForm(this[MODEL].dishes, this[MODEL].menus);
    this[VIEW].bindShowDishInMenus(this.handleShowDishInMenus);
    this[VIEW].bindAssignDishInMenu(this.handleAssignDishtoMenu);
    this[VIEW].bindDesAssignDishInMenu(this.handleDesassignDishToMenu);
  };

  handleModifyCategoryofDish = () => {
    this[VIEW].showModifyCategoryForm(this[MODEL].dishes, this[MODEL].categories);
    this[VIEW].bindShowDishInCategories(this.handleShowDishInCategories);
    this[VIEW].bindAssignDishInCategory(this.handleAssignDishtoCategory);
    this[VIEW].bindDesassignDishInCategory(this.handleDesassignDishToCategory);
  };

  handleRemoveDish = (name) => {
    let done;
    let error;
    let dish;
    console.log(name);
    try {
      dish = this[MODEL].getDishByName(name);
      console.log(dish);
      this[MODEL].removeDish(dish);
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }
    this[VIEW].showRemoveDishModal(done, dish, error);
  };

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
  }
  

  handleNewCategoryForm = () => {
    this[VIEW].showNewCategoryForm();
    this[VIEW].bindNewCategoryForm(this.handleCreateCategory);
  };

  handleNewRestaurantForm = () => {
    this[VIEW].shownewRestaurantForm();    
    this[VIEW].bindNewRestaurantForm(this.handleNewRestaurant);
  };

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
  handleRemoveCategoryForm = () => {
    this[VIEW].showRemoveCategoryForm(this[MODEL].categories);
    this[VIEW].bindRemoveCategoryForm(this.handleRemoveCategory);
  };

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

    this[VIEW].showDesassignDishCategoryModal(done, dish, error,categories);
  };

  handleNewRestaurant = (
    name,
    description,
    url,
    latitude,
    longitude
  ) => {
    let done;
    let error;
    let restaurant;
    const location = new Coordinate(latitude, longitude);

    try {
      restaurant = this[MODEL].createRestaurant(name, description,url);
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
}

}


//Exportamos la clase RestaurantController.
export default RestaurantController;
