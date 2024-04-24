/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 5.
 * Alumno: Santiago Rosado Ruiz.
 * UT04 Práctica 5: Gestión de restaurantes - DOM y MVC.
  */


//Importamos las clases necesarias para la creación de la app.
import  {RestaurantsManager}  from "/Restaurant_Model.js";
import  RestaurantsView  from "/Restaurant_View.js";
import  RestaurantsController  from "./Restaurant_Controller.js";
import  Bread  from "/Breadcrumbs.js";
import AuthenticationService from "./authentication.js";

//Creamos la instancia de la app, que recibe como parámetros el modelo, la vista y el bread.
const RestaurantApp = new RestaurantsController(RestaurantsManager.getInstance(), new RestaurantsView(), new Bread(), AuthenticationService.getInstance());


//Exportamos la app para poderla usar en otros ficheros.
export default RestaurantApp;

