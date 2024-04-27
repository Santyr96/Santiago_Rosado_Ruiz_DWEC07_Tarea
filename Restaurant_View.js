/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 6.
 * Alumno: Santiago Rosado Ruiz.
 * UT04 Práctica 6: Gestión de formularios.
 */
"use strict";

import { Allergen, Category, Menu } from "./Objetos_restaurante.js";
import {
  newDishValidation,
  newCategoryValidation,
  newRestaurantValidation,
} from "./validation.js";
import {
  DishExistInListException,
  ErrorExistenceElementException,
} from "./Excepcion_gestion_restaurantes.js";

//Importamos la función setCookie.
import { setCookie } from "./util.js";

/*Clase de la vista de nuestra web. Se encargará de visualizar el contenido obtenido del modelo, a través
del controlador, en la web. */
class RestaurantView {
  /*Constructor que se encarga de obtener los principales elementos donde queremos visualizar el contenido
  a través del DOM. */
  constructor() {
    this.main = document.getElementsByTagName("main")[0];
    this.menu = document.querySelector(".navbar-nav");
    this.options = document.getElementById("dropdowns");
    this.categories = document.getElementById("categories");
    this.nav_bread = document.getElementById("nav_bread");
  }

  /**Método para mostrar la notificación creada en la cookie. */
  showCookiesMessage() {
    const toast = `<div class="fixed-top p-5 mt-5">
<div id="cookies-message" class="toast fade show bg-dark text-white
w-100 mw-100" role="alert" aria-live="assertive" aria-atomic="true">
<div class="toast-header">
<h4 class="me-auto">Aviso de uso de cookies</h4>
<button type="button" class="btn-close" data-bs-dismiss="toast"
aria-label="Close" id="btnDismissCookie"></button>
</div>
<div class="toast-body p-4 d-flex flex-column">
<p>
Este sitio web almacena datos en cookies para activar su
funcionalidad, entre las que se encuentra
datos analíticos y personalización. Para poder utilizar este
sitio, estás automáticamente aceptando
que
utilizamos cookies.
</p>
<div class="ml-auto">
<button type="button" class="btn btn-outline-light mr-3 deny"
id="btnDenyCookie" data-bs-dismiss="toast">
Denegar
</button>
<button type="button" class="btn btn-primary"
id="btnAcceptCookie" data-bs-dismiss="toast">
Aceptar
</button>
</div>
</div>
</div>
</div>`;
    document.body.insertAdjacentHTML("afterbegin", toast);

    //Añadimos listener para el botón de aceptar, que al pulsarlo, guarda la cookie.
    const btnAcceptCookie = document.getElementById("btnAcceptCookie");
    btnAcceptCookie.addEventListener("click", (event) => {
      setCookie("acceptedCookieMessage", "true", 1);
    });

    //Eliminación de la notificación cuando se cierre.
    const cookiesMessage = document.getElementById("cookies-message");
    cookiesMessage.addEventListener("hidden.bs.toast", (event) => {
      event.currentTarget.parentElement.remove();
    });

    //Método que se encarga de mostrar un mensaje si se deniega las cookies.
    const denyCookieFunction = (event) => {
      this.main.replaceChildren();
      this.main.insertAdjacentHTML(
        "afterbegin",
        `<div class="container my-3"><div class="alert alert-warning" role="alert">
					<strong>Para utilizar esta web es necesario aceptar el uso de cookies. Debe recargar la página y aceptar las condiciones para seguir navegando. Gracias.</strong>
				</div></div>`
      );
      this.options.remove();
      this.categories.remove();
      this.menu.remove();
      this.nav_bread.remove();
    };

    //Creación de los botones de aceptar y denegar, junto con sus listeners, que invocán al método de denegar las cookies.
    const btnDenyCookie = document.getElementById("btnDenyCookie");
    btnDenyCookie.addEventListener("click", denyCookieFunction);
    const btnDismissCookie = document.getElementById("btnDismissCookie");
    btnDismissCookie.addEventListener("click", denyCookieFunction);
  }

  /**Método para mostrar el link de autenticación del usuario. */
  showIdentificationLink() {
    const userArea = document.getElementById("userArea");
    userArea.replaceChildren();
    userArea.insertAdjacentHTML(
      "afterbegin",
      `<div class="account d-flex
    mx-2 flex-column" style="text-align: right; height: 40px">
    <a id="login" href="#"><i class="fa-solid fa-user"></i> Identificate</a>
    </div>`
    );
  }

  /**Método para mostrar el menún para guardar platos favoritos. */
  showFavoriteDishMenu() {
    //Creamos un nuevo desplegable.
    const favouriteDish = document.createElement("li");
    //Le agregamos las clases Boostrap.
    favouriteDish.classList.add("nav-item");
    favouriteDish.classList.add("dropdown");
    //Le agregamos el botón para expandir el contenido.
    favouriteDish.insertAdjacentHTML(
      "afterbegin",
      `<a class="nav-link dropdown-toggle" href="#" id="favouriteDish" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="fa-solid fa-heart"></i>
      Platos Favoritos</a>`
    );

    //Establecemos las opciones del desplegable.
    const subOptions = document.createElement("ul");
    subOptions.classList.add("dropdown-menu");
    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="saveFavouriteDish" class="dropdown-item" href="#">Guardar platos favoritos</a></li>`
    );

    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="lookupDish" class="dropdown-item" href="#">Consultar platos favoritos</a></li>`
    );

    //Agregamos las opciones al desplegable.
    favouriteDish.append(subOptions);
    this.menu.append(favouriteDish);
  }

  /**Método para mostra las cards de todos los platos y que se seleccionen los favoritos. */
  showSelectFavouriteDishes(dishes) {
    this.main.replaceChildren();
    //Creamos un contenedor para mostrar los platos.
    const container = document.createElement("div");
    container.id = "dish-list";

    const div = document.createElement("div");
    div.id = "dishes_cards";
    div.classList.add("row");

    let ingredientList;
    //Insertamos las propiedades de los platos.
    for (const dish of dishes) {
      ingredientList = Array.isArray(dish.ingredients)
        ? dish.ingredients.join(", ")
        : dish.ingredients;
      div.insertAdjacentHTML(
        "beforeend",
        `<div class="card" id="${dish.name}"  style="width: 18rem;">
      <img src="${dish.image}" class="card-img-top" alt="${dish.name}">
      <div class="card-body">
        <h5 class="card-title">${dish.name}</h5>
        <p class="card-text"><strong>Ingredientes:</strong> ${ingredientList}</p>
        <a href="#" class="btn btn-primary" data-dish="${dish.name}">Propiedades</a>
        <a href="#" class="btn btn-success"  data-dish="${dish.name}">Guardar</a>
      </div>
    </div>`
      );
    }

    this.main.append(container);
    container.append(div);
  }

  //Método para mostrar los platos guardados en favoritos.
  showFavouriteDishes(dishes) {
    this.main.replaceChildren();
    //Creamos un contenedor para mostrar los platos.
    const container = document.createElement("div");
    container.id = "dish-list";

    const div = document.createElement("div");
    div.id = "dishes_cards";
    div.classList.add("row");

    let ingredientList;
    for (const dish of dishes) {
      //Insertamos las propiedades de los platos.
      console.log(dish.name);
      ingredientList = Array.isArray(dish.ingredients)
        ? dish.ingredients.join(", ")
        : dish.ingredients;

      div.insertAdjacentHTML(
        "beforeend",
        `<div class="card" id="${dish.name}"  style="width: 18rem;">
      <img src="${dish.image}" class="card-img-top" alt="${dish.name}">
      <div class="card-body">
        <h5 class="card-title">${dish.name}</h5>
        <p class="card-text"><strong>Ingredientes:</strong> ${ingredientList}</p>
        <a href="#" class="btn btn-primary" data-dish="${dish.name}">Propiedades</a>
      </div>
    </div>`
      );
    }
    this.main.append(container);
    container.append(div);
  }

  /**Método para mostrar en la vista el formulario. */
  showLoginForm() {
    this.main.replaceChildren();
    const login = `<div class="container h-100">
			<div class="d-flex justify-content-center h-100">
				<div class="user_card">
					<div class="d-flex justify-content-center form_container">
					<form name="fLogin" role="form" novalidate>
							<div class="input-group mb-3">
								<div class="input-group-append">
									<span class="input-group-text"><i class="fa-solid fa-user"></i></span>
								</div>
								<input type="text" name="username" class="form-control input_user" value="" placeholder="usuario">
							</div>
							<div class="input-group mb-2">
								<div class="input-group-append">
									<span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
								</div>
								<input type="password" name="password" class="form-control input_pass" value="" placeholder="contraseña">
							</div>
							<div class="form-group">
								<div class="custom-control custom-checkbox">
									<input name="remember" type="checkbox" class="custom-control-input" id="customControlInline">
									<label class="custom-control-label" for="customControlInline">Recuerdame</label>
								</div>
							</div>
								<div class="d-flex justify-content-center mt-3 login_container">
									<button class="btn login_btn" type="submit">Acceder</button>
						</div>
						</form>
					</div>
				</div>
			</div>
		</div>`;
    this.main.insertAdjacentHTML("afterbegin", login);
  }

  /**Método para mostar en la vista el mensaj de usuario no válido. */
  showInvalidUserMessage() {
    this.main.insertAdjacentHTML(
      "beforeend",
      `<div class="container my3"><div class="alert alert-warning" role="alert">
    <strong>El usuario y la contraseña no son válidos. Inténtelo
    nuevamente.</strong>
    </div></div>`
    );
    document.forms.fLogin.reset();
    document.forms.fLogin.username.focus();
  }

  /**Método para mostar el perfil del usuario. */
  showAuthUserProfile(user) {
    //Obtenemos el elemento donde se mostrará el perfil del usuario.
    const userArea = document.getElementById("userArea");
    //Limpiamos el elemento.
    userArea.replaceChildren();
    //Insertamos el perfil del usuario.
    userArea.insertAdjacentHTML(
      "afterbegin",
      `<div class="account d-flex
mx-2 flex-column" style="text-align: right">
 Usuario: ${user.username} <a id="aCloseSession" href="#">Cerrar sesión</a>
</div>
<div class="image">
<img class="img-fluid" alt="${user.username}" src="/Imagenes/imagen_perfil/imagen_perfil.jpg" />
</div>`
    );
  }

  /**Método para habilitar la cookie del usuario. */
  setUserCookie(user) {
    setCookie("activeUser", user.username, 1);
  }

  /**Método para borrar la cookie del usuario. */
  deleteUserCookie() {
    setCookie("activeUser", "", 0);
  }

  /**Método para eliminar los enlaces de administración. */
  removeAdminMenu() {
    const adminMenu = document.getElementById("adminMenu");
    if (adminMenu) adminMenu.parentElement.remove();
  }

  /**Método para eliminar el menú de seleccionar platos favoritos. */
  removeFavoriteDishMenu() {
    const favouriteDish = document.getElementById("favouriteDish");
    if (favouriteDish) favouriteDish.parentElement.remove();
  }

  /**Método para mostrar mensaje al usuario al iniciar sesión. */
  showLoginMessage(user) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "¡Bienvenido!";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    body.insertAdjacentHTML(
      "afterbegin",
      `<div class="p-3">Hola ${user.username}!</div>`
    );
    messageModal.show();
  }

  /*Método encargado de mostrar las categorías en la zona central de la web */
  showCategories(categories) {
    //En primer lugar, limpiamos la zona central por si existen elementos.
    this.categories.replaceChildren();

    //Creamos un contenedor para las categorías.
    const container = document.createElement("div");
    container.id = "category_cards";
    container.classList.add("row");

    //Insertamos el título de las categorías.
    container.insertAdjacentHTML("beforeend", `<h1>Categorías</h1>`);

    //Insertamos las categorías en el contenedor.
    for (const category of categories) {
      container.insertAdjacentHTML(
        "beforeend",

        `<div class="card" style="width: 18rem;">
        <img src="${category.url}" class="card-img-top" alt="${category.name}">
        <div class="card-body">
          <h5 class="card-title">${category.name}</h5>
          <p class="card-text">${category.description}</p>
          <a href="#" class="btn btn-primary" data-category="${category.name}">Go somewhere</a>
        </div>
      </div>`
      );

      //Si no existe el elemento 'categories', lo creamos y lo agregamos a la zona central.
      if (!this.main.querySelector("#categories")) {
        // Si no existe, crea y agrega el elemento 'categories'
        this.main.replaceChildren();
        const categoriesContainer = document.createElement("div");
        categoriesContainer.id = "categories";
        this.main.appendChild(categoriesContainer);
        this.categories = categoriesContainer;
        this.categories.append(container);
      } else {
        this.categories.append(container);
      }
    }
  }

  //Método que se encarga de mostrar las categorías en el menú del encabezado
  showCategoriesinMenu(categories) {
    //Creamos un elemento li con la clase dropdown de Boostrap para que funcione como un desplegable.
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.classList.add("dropdown");
    //Insertamos el enlace que desplegará las categorías.
    li.insertAdjacentHTML(
      "beforeend",
      `<a class="nav-link dropdown-toggle" href="#" id="navCats" role="button"
			data-bs-toggle="dropdown" aria-expanded="false">Categorías</a>`
    );

    //Creamos un contenedor para las categorías.
    const container = document.createElement("ul");

    //Añadimos las clases necesarias para que funcione el desplegable.
    container.classList.add("dropdown-menu");
    container.id = "navCat";

    //Insertamos las categorías en el desplegable.
    for (const category of categories) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a class="dropdown-item" href="#" data-category="${category.name}">${category.name}</a></li>`
      );
    }

    li.append(container);
    this.menu.append(li);
  }

  /**Método encargado de mostrar platos de forma aleatoria en la zona central de la web */
  showDishesRandom(dishes) {
    //Convertirmos en array el conjunto de platos.
    const dish = Array.from(dishes);

    //Creeamos un contenedor para mostrar los platos.
    const div = document.createElement("div");
    div.id = "dishes_cards";
    div.classList.add("row");

    //Insertamos el título de los platos.
    div.insertAdjacentHTML("beforeend", `<h1>Platos</h1>`);

    //Bucle for para mostrar tres platos de manera aleatorioa.
    for (let index = 0; index < 3; index++) {
      const dish_random = dish[Math.floor(Math.random() * dish.length)];
      const ingredientsList = Array.isArray(dish_random.ingredients)
        ? dish_random.ingredients.join(", ")
        : dish_random.ingredients;
      //Si disponemos de un plato, lo guardamos en una variable auxiliar para eliminarlo del array, de esta manera no se repetiran los platos.
      if (dish_random) {
        const aux_random = dish_random;
        dish.splice(dish.indexOf(aux_random), 1);
      }

      //Insertamos los platos en el contenedor.
      div.insertAdjacentHTML(
        "beforeend",

        `<div class="card" id="dishes_cards" style="width: 18rem;">
      <img src="${dish_random.image}" class="card-img-top" alt="${dish_random.name}">
      <div class="card-body">
        <h5 class="card-title">${dish_random.name}</h5>
        <p class="card-text"><strong>Ingredientes:</strong> ${ingredientsList}</p>
        <a href="#" class="btn btn-primary" data-dish = "${dish_random.name}">Propiedades</a>
      </div>
    </div>`
      );

      this.categories.append(div);
    }
  }

  /**Método que se encarga de mostrar platos en la zona central de la web */
  showDishes(dishes, title, elem) {
    //Limpiamos la zona central por si existen elementos.
    this.main.replaceChildren();
    if (this.categories.children.length > 1) {
      this.categories.children[1].remove();
    }

    //Creamos un contenedor para mostrar los platos.
    const container = document.createElement("div");
    container.id = "dish-list";

    const div = document.createElement("div");
    div.id = "dishes_cards";
    div.classList.add("row");

    /*Como este método lo vamos a utilizar para categorías, alérgenos y menus, creamos if anidados para mostrar el titulo
    según que elemento sea. */
    if (elem instanceof Category) {
      div.insertAdjacentHTML("beforeend", `<h1>Categoría: ${title}</h1>`);
    } else if (elem instanceof Allergen) {
      div.insertAdjacentHTML(
        "beforeend",
        `<h1>Platos que contienen el alérgeno ${title}</h1>`
      );
    } else if (elem instanceof Menu) {
      div.insertAdjacentHTML("beforeend", `<h1>Platos del ${title} </h1>`);
    }
    let ingredientList;
    //Insertamos las propiedades de los platos.
    for (const dish of dishes) {
      ingredientList = Array.isArray(dish.ingredients)
        ? dish.ingredients.join(", ")
        : dish.ingredients;
      console.log(dish);
      div.insertAdjacentHTML(
        "beforeend",
        `<div class="card"  style="width: 18rem;">
      <img src="${dish.image}" class="card-img-top" alt="${dish.name}">
      <div class="card-body">
        <h5 class="card-title">${dish.name}</h5>
        <p class="card-text"><strong>Ingredientes:</strong> ${ingredientList}</p>
        <a href="#" class="btn btn-primary" data-dish="${dish.name}">Propiedades</a>
      </div>
    </div>`
      );
    }

    this.main.append(container);
    container.append(div);
  }

  //Método para indicar al usuario que no existen platos asignados a la categoría.
  showNotDishes(error) {
    //Limpiamos la zona central por si existen elementos.
    this.main.replaceChildren();
    if (this.categories.children.length > 1) {
      this.categories.children[1].remove();
    }
    //Creamos un contenedor para mostrar los platos.
    const div = document.createElement("div");
    div.id = "dish-list";
    div.classList.add("notDishes");
    if (error) {
      div.insertAdjacentHTML(
        "beforeend",
        `<h1>No se han encontrado platos</h1>`
      );
    }
    this.main.append(div);
  }

  /**Método que muestra información sobre el plato clickeado */
  showDishInformation(dish) {
    //Limpiamos la zona central por si existen elementos.
    if (this.categories) {
      if (this.categories.children.length > 1) {
        this.categories.replaceChildren();
      }
    }

    //Creamos un contenedor para mostrar los platos.
    const containerDish = document.getElementById("dish-list");

    //Si el contenedor existe ya con elementos, lo limpiamos.
    if (containerDish) {
      if (containerDish.children.length >= 1) {
        containerDish.replaceChildren();
      }
    }

    //Creamos otro div para mostrar las cards de los platos.
    const container = document.createElement("div");
    container.classList.add("containerInformation");

    //Creamos el div que contiene las cards.
    const div = document.createElement("div");
    div.id = "card_dish";
    div.classList.add("row");
    const ingredientsList = Array.isArray(dish.ingredients)
      ? dish.ingredients.join(", ")
      : dish.ingredients;
    div.insertAdjacentHTML(
      "beforeend",

      `<div class="card mb-3">
      <img src="${dish.image}" class="card-img-top" alt="${dish.name}">
      <div class="card-body">
        <h5 class="border-animation">${dish.name}</h5>
        <p class="card-text"><strong>Ingredientes:</strong></p>
        <p class="card-text">${ingredientsList}</p> 
        <p class="card-text"><strong>Descripción:</strong></p>
        <p class="card-text description">${dish.description}</p>
      </div>
    </div>
   `
    );

    if (this.categories) {
      this.categories.append(container);
      container.append(div);
    }
    if (containerDish) {
      containerDish.append(container);
      container.append(div);
    }
  }

  //Método que muestra información sobre el restaurate registrado.
  showRestaurantInformation(restaurant) {
    //Limpiamos la zona central por si existen elementos.
    if (this.categories) {
      if (this.categories.children.length >= 1) {
        this.categories.replaceChildren();
      }
    }

    //Obtenemos el contenedor de los platos, por si se encuentran los platos mostrandose.
    const containerDish = document.getElementById("dish-list");

    //Si el contenedor existe ya con elementos, lo limpiamos.
    if (containerDish) {
      if (containerDish.children.length >= 1) {
        containerDish.replaceChildren();
      }
    }

    const containerForm = document.querySelector(".container.my-3");

    if (containerForm) {
      containerForm.replaceChildren();
    }

    //Creamos contenedores para mostrar las cards con la información de los restaurantes.
    const container = document.createElement("div");
    container.classList.add("containerInformation");

    const div = document.createElement("div");
    div.id = "card_dish";
    div.classList.add("row");

    div.insertAdjacentHTML(
      "beforeend",

      `<div class="card mb-3">
      <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
      <div class="card-body">
        <h5 class="border-animation">${restaurant.name}</h5>
        <p class="card-text description">${restaurant.description}</p>
        <div class="containerMap">
        <h4>Ubicación</h4>
        <div
        class="m-4" id="mapid"></div>
        </div>
      </div>
    </div>
   `
    );
   
    

    if (this.categories) {
      this.categories.append(container);
      container.append(div);
    }
    if (containerDish) {
      containerDish.append(container);
      container.append(div);
    }

    if (containerForm) {
      containerForm.append(container);
      container.append(div);
    }

    if(restaurant.location){
    const mapContainer = document.getElementById("mapid");
    mapContainer.style.height = "350px";
    mapContainer.style.border = "2px solid #faa541";

    let map = L.map("mapid").setView(
      [restaurant.location.latitude, restaurant.location.longitude],
      13
    );

    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://cloudmade.com">CloudMade</a>',
      maxZoom: 18,
    }).addTo(map);

    let circle = L.circle ([restaurant.location.latitude, restaurant.location.longitude], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 100,
    }).addTo(map);
  }
  }

  /**Método que se va a encargar de mostrar en el menú de opciones, los alérgenos de nuestra pagina. */
  showAllergenMenu(allergens) {
    //Creamos un listado desplegable para los alérgenos.
    const li = document.createElement("li");

    //Insertamos un enlace que servirá como despegable en el menú de opciones.
    li.insertAdjacentHTML(
      "beforeend",
      `<a class="dropdown-item " href="#" id="dropdownAlergenos"
			 aria-expanded="false"><i class="fa-solid fa-arrow-left"></i> Alérgenos</a>`
    );

    //Creamos una lista que tenga la capacidad de desplegable, para ello creamos un elemento ul con la clase de dropdown (Boostrap).
    const container = document.createElement("ul");
    container.classList.add("dropdown-menu", "submenu", "submenu-left");

    container.id = "allergens-menu";
    //Recorremos los alergenos recibidos por nuestro modelo y creamos un contador, con el objeto de crear separadores en las opciones de alérgenos.
    let contador = 0;
    for (const allergen of allergens) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a class="dropdown-item" href="#" data-allergen="${allergen.name}">${allergen.name}</a></li>
        `
      );

      const allergen_array = Array.from(allergens);

      if (contador < allergen_array.length - 1) {
        container.insertAdjacentHTML(
          "beforeend",
          `<hr class="dropdown-divider">`
        );
        contador++;
      }
    }

    //Agregamos el elemento ul al menú de opciones.
    this.options.append(li);
    li.append(container);
  }

  //Método que se ve a encargar de mostrar en el menú de opciones, los menús de nuestra pagina. Sigue el mismo procedimiento que el anterior método.
  showMenus(menus) {
    const li = document.createElement("li");

    li.insertAdjacentHTML(
      "beforeend",
      `<a class="dropdown-item " href="#" id="dropdownMenus"
      aria-expanded="false"><i class="fa-solid fa-arrow-left"></i> Menus</a>`
    );

    const container = document.createElement("ul");
    container.classList.add("dropdown-menu", "submenu", "submenu-left");
    container.id = "menus-menu";

    let contador = 0;
    for (const menu of menus) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a class="dropdown-item" href="#" data-menu="${menu.name}">${menu.name}</a></li>`
      );

      const menus_array = Array.from(menus);

      if (contador < menus_array.length - 1) {
        container.insertAdjacentHTML(
          "beforeend",
          `<hr class="dropdown-divider">`
        );
        contador++;
      }
    }

    this.options.append(li);
    li.append(container);
  }

  /*Método que se va a encargar de mostrar en el menú de opciones los restaurantes registrados en el manager. Siguer el mismo procedimientos que el método anterior.*/
  showRestaurantsMenu(restaurants) {
    const li = document.createElement("li");

    li.insertAdjacentHTML(
      "beforeend",
      `<a class="dropdown-item " href="#" id="dropdownMenus"
      aria-expanded="false"><i class="fa-solid fa-arrow-left"></i> Restaurantes</a>`
    );

    const container = document.createElement("ul");
    container.classList.add("dropdown-menu", "submenu", "submenu-left");
    container.id = "menus-restaurant";

    let contador = 0;
    for (const restaurant of restaurants) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a class="dropdown-item" href="#" data-restaurant="${restaurant.name}">${restaurant.name}</a></li>`
      );

      const restaurants_array = Array.from(restaurants);

      if (contador < restaurants_array.length - 1) {
        container.insertAdjacentHTML(
          "beforeend",
          `<hr class="dropdown-divider">`
        );
        contador++;
      }
    }

    this.options.append(li);
    li.append(container);
  }

  //Método para mostrar los menus de administración en la barra de navegación.
  showAdminMenu() {
    const menuOption = document.createElement("li");
    menuOption.classList.add("nav-item");
    menuOption.classList.add("dropdown");
    menuOption.insertAdjacentHTML(
      "afterbegin",
      `<a class="nav-link dropdown-toggle" href="#" id="adminMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">Administración</a>`
    );

    const subOptions = document.createElement("ul");
    subOptions.classList.add("dropdown-menu");
    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="newDish" class="dropdown-item" href="#new-dish">Crear plato</a></li>`
    );

    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="deleteDish" class="dropdown-item" href="#delete-dish">Eliminar plato</a></li>`
    );
    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="assignDish" class="dropdown-item" href="#assign-dishes">Asignación de platos</a></li>`
    );
    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="newCategory" class="dropdown-item" href="#new-category">Crear categoría</a></li>`
    );
    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="deleteCategory" class="dropdown-item" href="#delete-category">Eliminar categoría</a></li>`
    );
    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="newRestaurant" class="dropdown-item" href="#new-restaurant">Crear restaurante</a></li>`
    );
    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="modifyCategories" class="dropdown-item" href="#modify-categories">Modificar categorías de un plato</a></li>`
    );

    subOptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="backupObjects" class="dropdown-item" href="#backup-objects">Backup de los objectos creados</a></li>`
    );

    menuOption.append(subOptions);
    this.menu.append(menuOption);
  }

  //Método que muestra el formulario de creación de platos.
  showDishCreationForm(categories, allergens) {
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "new-dish";

    container.insertAdjacentHTML(
      "afterbegin",
      `<h1 class="display-5">Nuevo plato</h1>`
    );

    container.insertAdjacentHTML(
      "beforeend",
      `<form name="fNewDish" role="form" class="row g-3" novalidate>
          <div class="col-md-6 mb-3">
              <label class="form-label" for="npName">Nombre *</label>
              <div class="input-group">
                  <span class="input-group-text"><i class="fa-solid fa-bowl-food"></i></span>
                  <input type="text" class="form-control" id="npName" name="npName" placeholder="Nombre del plato" value="" required>
                  <div class="invalid-feedback">El nombre es obligatorio.</div>
                  <div class="valid-feedback">Correcto.</div>
              </div>
          </div>
          <div class="col-md-6 mb-3">
              <label class="form-label" for="npIngredients">Ingredientes *</label>
              <div class="input-group">
                  <span class="input-group-text"><i class="fa-solid fa-lemon"></i></span>
                  <input type="url" class="form-control" id="npIngredients" name="npIngredients" placeholder="Ingredientes de la imagen" value="">
                  <div class="invalid-feedback"></div>
                  <div class="valid-feedback">Correcto.</div>
              </div>
          </div>
          <div class="col-md-6 mb-3">
              <label class="form-label" for="npUrl">URL de la imagen *</label>
              <div class="input-group">
                  <span class="input-group-text"><i class="fa-solid fa-image"></i></span>
                  <input type="url" class="form-control" id="npUrl" name="npUrl" placeholder="URL de la imagen" value="" required>
                  <div class="invalid-feedback">La URL no es válida.</div>
                  <div class="valid-feedback">Correcto.</div>
              </div>
          </div>
          <div class="col-md-12 mb-3">
              <label class="form-label" for="npDescription">Descripción</label>
              <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-body-text"></i></span>
                  <input type="text" class="form-control" id="npDescription" name="nDescription" value="">
                  <div class="invalid-feedback"></div>
                  <div class="valid-feedback">Correcto.</div>
              </div>
          </div>

          <div class="col-md-3 mb-3">
          <label class="form-label" for="npCategories">Categorías *</label>
          <div class="input-group">
            <label class="input-group-text" for="npCategories"><i class="bi bi-card-checklist"></i></label>
            <select class="form-select" name="npCategories" id="npCategories" multiple required>
            </select>
            <div class="invalid-feedback">El plato debe pertenecer al menos a una categoría.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>

        </div>

        <div class="col-md-3 mb-3">
				<label class="form-label" for="npAllergen">Alérgenos *</label>
				<div class="input-group">
					<label class="input-group-text" for="npAllergen"><i class="bi bi-card-checklist"></i></label>
					<select class="form-select" name="npAllergen" id="npAllergen" multiple>
					</select>
					<div class="invalid-feedback"></div>
					<div class="valid-feedback">Correcto.</div>
				</div>
			</div>
          <div class="mb-12">
              <button class="btn btn-primary" type="submit">Enviar</button>
              <button class="btn btn-primary" type="reset">Cancelar</button>
          </div>
         
      </form>`
    );

    const npCategories = container.querySelector("#npCategories");
    for (const category of categories) {
      npCategories.insertAdjacentHTML(
        "beforeend",
        `<option value="${category.name}">${category.name}</option>`
      );
    }

    const npAllergen = container.querySelector("#npAllergen");
    for (const allergen of allergens) {
      npAllergen.insertAdjacentHTML(
        "beforeend",
        `<option value="${allergen.name}">${allergen.name}</option>`
      );
    }

    this.main.append(container);
  }

  //Método que muestra el formulario de eliminación de platos.
  showRemoveDishForm(dishes) {
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "remove-dish";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Eliminar un plato</h1>'
    );

    const form = document.createElement("form");
    form.name = "fRemoveDish";
    form.setAttribute("role", "form");
    form.setAttribute("novalidate", "");
    form.classList.add("row");
    form.classList.add("g-3");

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-6 mb-3">
				<label class="form-label" for="rpDishes">Elimina un plato</label>
				<div class="input-group">
					<label class="input-group-text" for="rpDishes"><i class="bi bi-card-checklist"></i></label>
					<select class="form-select" name="rpDishes" id="rpDishes">
						<option disabled selected value=''>Selecciona un plato</option>
					</select>
				</div>
			</div>
      <div class="mb-12">
      <button class="btn btn-primary" name="eliminar" id="eliminar" type="submit">Eliminar</button>
  </div>`
    );
    const rpDishes = form.querySelector("#rpDishes");
    for (const dish of dishes) {
      rpDishes.insertAdjacentHTML(
        "beforeend",
        `<option value="${dish.name}" data-dish="${dish.name}">${dish.name}</option>`
      );
    }

    container.append(form);
    container.insertAdjacentHTML(
      "beforeend",
      '<div id="dish-list" class="container my-3"><div class="row"></div></div>'
    );

    this.main.append(container);
  }

  //Método que muestra el formulario de asignación de platos a menus.
  showAssignDishesForm(dishes, menus) {
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "assign-dish";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Asignación y designación de platos a menus</h1>'
    );

    const form = document.createElement("form");
    form.name = "fAssignDish";
    form.setAttribute("role", "form");
    form.setAttribute("novalidate", "");
    form.classList.add("row");
    form.classList.add("g-3");

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-6 mb-3">
				<label class="form-label" for="rpDishes">Asigna un plato a menu</label>
				<div class="input-group">
					<label class="input-group-text" for="rpDishes"><i class="bi bi-card-checklist"></i></label>
					<select class="form-select" name="rpDishes" id="rpDishes">
						<option disabled selected value=''>Selecciona un plato</option>
					</select>

          <label class="input-group-text" for="rpDishes"><i class="bi bi-card-checklist"></i></label>
					<select class="form-select" name="rpMenus" id="rpMenus">
						<option disabled selected value=''>Selecciona un menú para asignar o desasignar</option>
					</select>
				</div>
			</div>
      <div class="mb-12">
      <button class="btn btn-primary"  id="Asignar" type="submit">Asignar</button>
      <button class="btn btn-primary" " id="desasignar" type="submit">Desasignar</button>
  </div>
  
  <div id="menusList">
      <p>Menus donde se encuentra el plato</p>
  </div>`
    );

    const rpDishes = form.querySelector("#rpDishes");
    for (const dish of dishes) {
      rpDishes.insertAdjacentHTML(
        "beforeend",
        `<option value="${dish.name}">${dish.name}</option>`
      );
    }

    const rpMenus = form.querySelector("#rpMenus");
    for (const menu of menus) {
      rpMenus.insertAdjacentHTML(
        "beforeend",
        `<option value="${menu.name}">${menu.name}</option>`
      );
    }

    this.main.append(container);
    container.append(form);
  }

  //Método para mostrar los menus dondse encuentran asignados los platos.
  showMenusWithDish(dish, menus) {
    const menusList = document.getElementById("menusList");
    menusList.replaceChildren();
    menusList.insertAdjacentHTML(
      "afterbegin",
      `<p>Menus donde se encuentra el plato <strong>${dish}</strong></p>`
    );

    for (const menu of menus) {
      menusList.insertAdjacentHTML(
        "beforeend",
        `<div class="col-md-4"><p><strong>${menu.name}</strong></p></div>`
      );
    }
  }

  //Método que muestra el modal que proporcionará retroalimentación al usuario a la hora de crear un plato.
  showNewDishModal(done, dish, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Plato creado";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El plato <strong>${dish.name}</strong>  ha sido creada correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> no ha podido crearse correctamente.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewDish.reset();
      }
      document.fNewDish.npName.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  showBackupModal(done) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Creación del Backup.";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El backup ${done} se ha creado con éxito.</div>`
      );
    }
    messageModal.show();
  }

  //Método que muestra el modal que proporcionará retroalimentación al usuario a la hora de eliminar un plato.
  showRemoveDishModal(done, dish, error) {
    const productList = document.getElementById("dish-list");
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Plato eliminado";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido eliminado correctamente.</div>`
      );
    } else if (!done && !dish) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe en el manager.</div>'
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        const select = document.getElementById("rpDishes");
        const options = select.querySelector(
          `option[data-dish = "${dish.name}"]`
        );
        options.remove();
        document.fRemoveDish.reset();
      }
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  //Método que muestra el formulario para crear una categoría.
  showNewCategoryForm() {
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "new-category";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Nueva categoría</h1>'
    );
    container.insertAdjacentHTML(
      "beforeend",
      `<form name="fNewCategory" role="form" class="row g-3" novalidate>
			<div class="col-md-6 mb-3">
				<label class="form-label" for="ncName">Título *</label>
				<div class="input-group">
					<span class="input-group-text"><i class="bi bi-type"></i></span>
					<input type="text" class="form-control" id="ncName" name="ncTitle"
						placeholder="Título de categoría" value="" required>
					<div class="invalid-feedback">El título es obligatorio.</div>
					<div class="valid-feedback">Correcto.</div>
				</div>
			</div>
			<div class="col-md-6 mb-3">
				<label class="form-label" for="ncUrl">URL de la imagen *</label>
				<div class="input-group">
					<span class="input-group-text"><i class="bi bi-file-image"></i></span>
					<input type="url" class="form-control" id="ncUrl" name="ncUrl" placeholder="URL de la imagen"
						value="" required>
					<div class="invalid-feedback">La URL no es válida.</div>
					<div class="valid-feedback">Correcto.</div>
				</div>
			</div>
			<div class="col-md-12 mb-3">
				<label class="form-label" for="ncDescription">Descripción</label>
				<div class="input-group">
					<span class="input-group-text"><i class="bi bi-body-text"></i></span>
					<input type="text" class="form-control" id="ncDescription" name="ncDescription" value="">
					<div class="invalid-feedback"></div>
					<div class="valid-feedback">Correcto.</div>
				</div>
			</div>
			<div class="mb-12">
				<button class="btn btn-primary" type="submit">Enviar</button>
				<button class="btn btn-primary" type="reset">Cancelar</button>
			</div>
		</form>`
    );
    this.main.append(container);
  }

  //Método que muestra el formulario para modificar una categoría de un plato.
  showModifyCategoryForm(dishes, categories) {
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "assign-dish";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Asignación y designación de platos a categorías</h1>'
    );

    const form = document.createElement("form");
    form.name = "fAssignDish";
    form.setAttribute("role", "form");
    form.setAttribute("novalidate", "");
    form.classList.add("row");
    form.classList.add("g-3");

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-6 mb-3">
				<label class="form-label" for="rpDishes">Asigna un plato a una categoría</label>
				<div class="input-group">
					<label class="input-group-text" for="rpDishes"><i class="bi bi-card-checklist"></i></label>
					<select class="form-select" name="rpDishes" id="rpDishes">
						<option disabled selected value=''>Selecciona un plato</option>
					</select>

          <label class="input-group-text" for="rpCategories"><i class="bi bi-card-checklist"></i></label>
					<select class="form-select" name="rpCategories" id="rpCategories">
						<option disabled selected value=''>Selecciona una categoría para asignar o desasignar</option>
					</select>
				</div>
			</div>
      <div class="mb-12">
      <button class="btn btn-primary"  id="Asignar" type="submit">Asignar</button>
      <button class="btn btn-primary" " id="desasignar" type="submit">Desasignar</button>
  </div>
  
  <div id="categoryList">
      <p>Categorías donde se encuentra el plato</p>
  </div>`
    );

    const rpDishes = form.querySelector("#rpDishes");
    for (const dish of dishes) {
      rpDishes.insertAdjacentHTML(
        "beforeend",
        `<option value="${dish.name}">${dish.name}</option>`
      );
    }

    const rpCategories = form.querySelector("#rpCategories");
    for (const category of categories) {
      rpCategories.insertAdjacentHTML(
        "beforeend",
        `<option value="${category.name}">${category.name}</option>`
      );
    }

    this.main.append(container);
    container.append(form);
  }

  //Método para mostrar las categorías a las que pertenece un plato.
  showCategoryWithDish(dish, categories) {
    const categoriesList = document.getElementById("categoryList");
    categoriesList.replaceChildren();
    categoriesList.insertAdjacentHTML(
      "afterbegin",
      `<p>Categorías donde se encuentra el plato <strong>${dish}</strong></p>`
    );

    for (const category of categories) {
      categoriesList.insertAdjacentHTML(
        "beforeend",
        `<div class="col-md-4"><p><strong>${category.name}</strong></p></div>`
      );
    }
  }

  //Método para mostrar el modal de mensaje de retroalimnetación a la hora de asignar un plato a una categoría.
  showAssignDishCategoryModal(done, dish, error, categories) {
    const categoryList = document.getElementById("categoryList");
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    if (!dish) {
      const title = document.getElementById("messageModalTitle");
      title.innerHTML = `Asignación de plato`;
      const body = messageModalContainer.querySelector(".modal-body");
      body.replaceChildren();
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`
      );
    } else {
      const title = document.getElementById("messageModalTitle");
      title.innerHTML = `Asignación del Plato: ${dish.name}`;
      const body = messageModalContainer.querySelector(".modal-body");
      body.replaceChildren();
      if (done) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido asignado correctamente.</div>`
        );
      } else if (!done && !dish) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`
        );
      } else if (error instanceof DishExistInListException) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> ya existe en la categoría.</div>`
        );
      } else {
        body.insertAdjacentHTML(
          "afterbegin",
          '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe.</div>'
        );
      }
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        this.showCategoryWithDish(dish.name, categories);
      }
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  //Método para mostrar el modal de mensaje de retroalimentación a la hora de desasignar un plato de una categoría.
  showDesassignDishCategoryModal(done, dish, error, categories) {
    const categoryList = document.getElementById("categoryList");
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    if (!dish) {
      const title = document.getElementById("messageModalTitle");
      title.innerHTML = `Asignación de plato`;
      const body = messageModalContainer.querySelector(".modal-body");
      body.replaceChildren();
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`
      );
    } else {
      const title = document.getElementById("messageModalTitle");
      title.innerHTML = `Desasignación del plato: ${dish.name}`;
      const body = messageModalContainer.querySelector(".modal-body");
      body.replaceChildren();
      if (done) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido desasignado correctamente.</div>`
        );
      } else if (!done && !dish) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`
        );
      } else if (error instanceof DishExistInListException) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> no existe en el menú.</div>`
        );
      } else {
        body.insertAdjacentHTML(
          "afterbegin",
          '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe en el manager.</div>'
        );
      }
    }
    messageModal.show();
    const listener = (event) => {
      this.showCategoryWithDish(dish.name, categories);
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  //Método para mostrar el modal de mensaje de retroalimentación a la hora de crear un restaurante.
  showNewRestaurantModal(done, restaurant, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Creación de restaurante";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El restaurante <strong>${restaurant.name}</strong>  ha sido creado correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El restaurante <strong>${restaurant.name}</strong> no ha podido crearse correctamente.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewRestaurant.reset();
      }
      document.fNewRestaurant.npName.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  //Método que muestra el formulario para eliminar una categoría.
  showRemoveCategoryForm(categories) {
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "removeCategory";
    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Eliminar una categoría</h1>'
    );
    const row = document.createElement("div");
    row.classList.add("rew");
    for (const category of categories) {
      row.insertAdjacentHTML(
        "beforeend",
        `<div id="category_cards" class="row">
        <div class="card" style="width: 18rem;">
        <img src="${category.url}" class="card-img-top" alt="${category.nam}">
        <div class="card-body">
          <h5 class="card-title">${category.name}</h5>
          <p class="card-text">${category.description}</p>
          <a href="#" class="btn btn-primary" data-category="${category.name}">Eliminar</a>
        </div>
      </div>
      </div>
      `
      );
    }
    container.append(row);
    this.main.append(container);
  }

  //Método que muestra el formulario para crear un restaurante.
  shownewRestaurantForm() {
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "new-restaurant";

    container.insertAdjacentHTML(
      "afterbegin",
      `<h1 class="display-5">Nuevo Restaurante</h1>`
    );

    container.insertAdjacentHTML(
      "beforeend",
      `<div class="container p-4">
          <form id="fGeocoder" method="get">
              <h2>GeoCoder</h2>
              <div class="form-group row">
                  <div class="col-sm-10">
                      <label for="address" class="col-form-label">Dirección</label>
                      <input type="text" name="q" class="form-control" id="address" placeholder="Introduce la dirección a buscar">
                  </div>
                  <div class="col-sm-2 align-self-end">
                      <button id="bAddress" class="btn btn-primary" type="submit">Buscar</button>
                  </div>
              </div>
              <div id="geocoderAddresses"></div>
              <div id="geocoderMap" class="my-2"></div>
          </form>
      </div>`
  );

 
    container.insertAdjacentHTML(
      "beforeend",
      `<form name="fNewRestaurant" role="form" class="row g-3" novalidate>
          <div class="col-md-6 mb-3">
              <label class="form-label" for="npName">Nombre *</label>
              <div class="input-group">
                  <span class="input-group-text"><i class="fa-solid fa-utensils"></i></span>
                  <input type="text" class="form-control" id="npName" name="npName" placeholder="Nombre del restaurante" value="" required>
                  <div class="invalid-feedback">El nombre es obligatorio.</div>
                  <div class="valid-feedback">Correcto.</div>
              </div>
          </div>
          
          </div>
          <div class="col-md-6 mb-3">
              <label class="form-label" for="npUrl">URL de la imagen *</label>
              <div class="input-group">
                  <span class="input-group-text"><i class="fa-solid fa-image"></i></span>
                  <input type="url" class="form-control" id="npUrl" name="npUrl" placeholder="URL de la imagen" value="" required>
                  <div class="invalid-feedback">La URL no es válida.</div>
                  <div class="valid-feedback">Correcto.</div>
              </div>
          </div>
          <div class="col-md-12 mb-3">
              <label class="form-label" for="npDescription">Descripción</label>
              <div class="input-group">
                  <span class="input-group-text"><i class="fa-solid fa-t"></i></span>
                  <input type="text" class="form-control" id="npDescription" name="nDescription" value="">
                  <div class="invalid-feedback"></div>
                  <div class="valid-feedback">Correcto.</div>
              </div>
          </div>

          <div class="col-md-6 mb-3">
          <label class="form-label" for="npLatitude">Latitud</label>
          <div class="input-group">
              <span class="input-group-text"><i class="fa-solid fa-location-dot"></i></span>
              <input type="text" class="form-control" id="npLatitude" name="npLatitude">
              <div class="invalid-feedback">Formato de latitud incorrecto.</div>
              <div class="valid-feedback">Correcto.</div>
          </div>
      </div>

      <div class="col-md-6 mb-3">
          <label class="form-label" for="npLongitude">Longitud</label>
          <div class="input-group">
              <span class="input-group-text"><i class="fa-solid fa-location-dot"></i></span>
              <input type="text" class="form-control" id="npLongitude" name="npLongitude">
              <div class="invalid-feedback">Formato de longitud incorrecto.</div>
              <div class="valid-feedback">Correcto.</div>
          </div>
      </div>
    
  <div class="mb-12">
              <button class="btn btn-primary" type="submit">Enviar</button>
              <button class="btn btn-primary" type="reset">Cancelar</button>
          </div>
      </form>`
    );



    this.main.append(container);
  }

  //Método para mostrar retroalimentación al asignar un plato a un menú.
  showAssignDishModal(done, dish, error) {
    const productList = document.getElementById("menusList");
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    if (!dish) {
      const title = document.getElementById("messageModalTitle");
      title.innerHTML = `Asignación de plato`;
      const body = messageModalContainer.querySelector(".modal-body");
      body.replaceChildren();
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`
      );
    } else {
      const title = document.getElementById("messageModalTitle");
      title.innerHTML = `Asignación del Plato: ${dish.name}`;
      const body = messageModalContainer.querySelector(".modal-body");
      body.replaceChildren();
      if (done) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido asignado correctamente.</div>`
        );
      } else if (!done && !dish) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`
        );
      } else if (error instanceof DishExistInListException) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> ya existe en el menú.</div>`
        );
      } else {
        body.insertAdjacentHTML(
          "afterbegin",
          '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe.</div>'
        );
      }
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        const button = productList.querySelector(
          `a.btn[data-name="${dish.name}"]`
        );
        button.parentElement.parentElement.parentElement.remove();
      }
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  //Método para mostrar retroalimentación al desasignar un plato a un menú.
  showDesassignDishModal(done, dish, error) {
    const productList = document.getElementById("menusList");
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    if (!dish) {
      const title = document.getElementById("messageModalTitle");
      title.innerHTML = `Asignación de plato`;
      const body = messageModalContainer.querySelector(".modal-body");
      body.replaceChildren();
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`
      );
    } else {
      const title = document.getElementById("messageModalTitle");
      title.innerHTML = `Desasignación del plato: ${dish.name}`;
      const body = messageModalContainer.querySelector(".modal-body");
      body.replaceChildren();
      if (done) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido desasignado correctamente.</div>`
        );
      } else if (!done && !dish) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`
        );
      } else if (error instanceof DishExistInListException) {
        body.insertAdjacentHTML(
          "afterbegin",
          `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> no existe en el menú.</div>`
        );
      } else {
        body.insertAdjacentHTML(
          "afterbegin",
          '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe en el manager.</div>'
        );
      }
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        const button = productList.querySelector(
          `a.btn[data-name="${dish.name}"]`
        );
        button.parentElement.parentElement.parentElement.remove();
      }
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  //Método para mostrar retroalimentación al crear una nueva categoría.
  showNewCategoryModal(done, cat, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Nueva Categoría";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">La categoría <strong>${cat.name}</strong> ha sido creada correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> La categoría <strong>${cat.name}</strong> ya está creada.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewCategory.reset();
      }
      document.fNewCategory.ncTitle.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  //Método para mostrar retroalimentación al borrar una categoría.
  showRemoveCategoryModal(done, cat, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");
    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Borrado de categoría";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">La categoría <strong>${cat.name}</strong> ha sido eliminada correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> La categoría <strong>${cat.name}</strong> no se ha podido borrar.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        // Selecciona todos los enlaces dentro del contenedor #removeCategory con el atributo data-category correspondiente a la categoría
        const buttons = document.querySelectorAll(
          `#removeCategory a[data-category="${cat.name}"]`
        );

        // Itera sobre todos los enlaces encontrados y elimina los contenedores de tarjetas correspondientes
        buttons.forEach((button) => {
          const cardContainer = button.closest(".row");
          if (cardContainer) {
            cardContainer.remove();
          }
        });
      }
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  //Método para actualizar las categorías en los menús de navegación al crear o eliminar categorías.
  showUpdateCategoryMenu(cat) {
    const navCats = document.getElementById("navCats");
    const container = navCats.nextElementSibling;
    container.replaceChildren();
    for (const category of cat) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a data-category="${category.name}" class="dropdown-item" href="#product-list">${category.name}</a></li>`
      );
    }
  }

  //Método para actualizar los restaurantes en los menús de navegación al crear restaurantes.
  showUpdateRestaurantMenu(restaurants) {
    const menuRestaurant = document.getElementById("menus-restaurant");
    menuRestaurant.replaceChildren();
    let contador = 0;
    for (const restaurant of restaurants) {
      menuRestaurant.insertAdjacentHTML(
        "beforeend",
        `<li><a class="dropdown-item" href="#" data-restaurant="${restaurant.name}">${restaurant.name}</a></li>`
      );

      const restaurants_array = Array.from(restaurants);

      if (contador < restaurants_array.length - 1) {
        menuRestaurant.insertAdjacentHTML(
          "beforeend",
          `<hr class="dropdown-divider">`
        );
        contador++;
      }
    }
  }
  //Métodos bind para enlazar el manejador de eventos de la vista con el controlador.

  /**Método bind para enlazar los enlaces de inicio y el logo con el manejador que da respuesta
   * a la acción de click.
   */
  bindInit(handler) {
    document.getElementById("init").addEventListener("click", (event) => {
      handler();
    });

    document.getElementById("logo").addEventListener("click", (event) => {
      handler();
    });
  }

  /**Bind para dotar de funcionalidad al link del login. */
  bindIdentificationLink(handler) {
    const login = document.getElementById("login");
    login.addEventListener("click", (event) => {
      handler();
    });
  }

  /**Bind para enlazar los enlaces de los cards de las categorías. */
  bindDishesCategory(handler) {
    //Obtenemos los cards que componen las categorías.
    const categoryCards = document.getElementById("category_cards");

    //Obtenemos los enlaces de los cards.
    const links = categoryCards.querySelectorAll("a");

    //Recorremos los enlaces y enlazamos el manejador de eventos.
    for (const link of links) {
      //Añadimos un evento de click a cada enlace.
      link.addEventListener("click", (event) => {
        //Llamamos al manejador d eventos, que recibe el objeto en donde se ha hecho click mediante el atributo personalizado.
        handler(event.currentTarget.dataset.category);
      });
    }
  }

  /**Método para enlazar los enlaces del despegable de las categorías.
   */
  bindDishesCategoryInMenu(handler) {
    const menu = document.getElementById("navCat");
    const links = menu.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        handler(event.currentTarget.dataset.category);
      });
    }
  }

  /*Método para enlazar los enlaces de los cards de los platos.*/
  bindDishInformation(handler) {
    const dishes = document.getElementById("dishes_cards");
    const links = dishes.querySelectorAll("a:not(.btn.btn-success)");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        console.log(event.currentTarget.dataset.dish);
        handler(event.currentTarget.dataset.dish);
      });
    }
  }

  //Método para enlazar los enlaces del listado de alérgenos con el manejador de eventos correspondiente.
  bindAllergenMenu(handler) {
    const menu = document.getElementById("allergens-menu");
    const links = menu.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        handler(event.currentTarget.dataset.allergen);
      });
    }
  }

  //Método para enlazar los enlaces del listado de menús con el manejador de eventos correspondiente.
  bindMenus(handler) {
    const menu = document.getElementById("menus-menu");
    const links = menu.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        handler(event.currentTarget.dataset.menu);
      });
    }
  }

  //Método para enlazar los enlaces del listado de restaurantes con el manejador de eventos correspondiente.
  bindRestaurants(handler) {
    const menu = document.getElementById("menus-restaurant");
    const links = menu.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        handler(event.currentTarget.dataset.restaurant);
      });
    }
  }

  //Método para enlazar los enlaces del listado de migas de pan con el manejador de eventos correspondiente.
  bindBreadcrumbs(handler) {
    const navbread = document.getElementById("nav_bread"); // Corregido el ID del elemento
    const ol = navbread.querySelector("ol");
    const links = ol.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        handler(event.currentTarget.dataset.bread);
      });
    }
  }

  //Método para enlazar el formulario de nuevo plato con el manejador de eventos correspondiente.
  bindNewDishForm(handler) {
    newDishValidation(handler);
  }

  //Método para enlazar el formulario de eliminar categoría con el manejador de eventos correspondiente.
  bindRemoveDish(handler) {
    const button = document.getElementById("eliminar");
    const select = document.getElementById("rpDishes");

    button.addEventListener("click", function (event) {
      // Obtener el valor seleccionado del select
      const selectedDish = select.value;

      // Llamar al manejador con el valor seleccionado del plato
      handler(selectedDish);

      // Prevenir el comportamiento predeterminado del botón (enviar formulario)
      event.preventDefault();
    });
  }

  //Método para enlazar el formulario de desasignar plato de menú con el manejador de eventos correspondiente.
  bindDesAssignDishInMenu(handler) {
    const buttonDesasignar = document.getElementById("desasignar");
    const selectDishes = document.getElementById("rpDishes");
    const selectMenus = document.getElementById("rpMenus");

    buttonDesasignar.addEventListener("click", function (event) {
      // Obtener el valor seleccionado del select
      const selectedDish = selectDishes.value;
      const selectedMenu = selectMenus.value;

      // Llamar al manejador con el valor seleccionado del plato
      handler(selectedDish, selectedMenu);

      // Prevenir el comportamiento predeterminado del botón (enviar formulario)
      event.preventDefault();
    });
  }

  //Método para enlazar el formulario de asignar plato de menú con el manejador de eventos correspondiente.
  bindAssignDishInMenu(handler) {
    const button = document.getElementById("Asignar");
    const selectDishes = document.getElementById("rpDishes");
    const selectMenus = document.getElementById("rpMenus");

    button.addEventListener("click", function (event) {
      // Obtener el valor seleccionado del select
      const selectedDish = selectDishes.value;
      const selectedMenu = selectMenus.value;

      // Llamar al manejador con el valor seleccionado del plato
      handler(selectedDish, selectedMenu);

      // Prevenir el comportamiento predeterminado del botón (enviar formulario)
      event.preventDefault();
    });
  }

  //Método para enlazar el formulario de asignar plato de categoría con el manejador de eventos correspondiente.
  bindAssignDishInCategory(handler) {
    const button = document.getElementById("Asignar");
    const selectDishes = document.getElementById("rpDishes");
    const selectCategories = document.getElementById("rpCategories");

    button.addEventListener("click", function (event) {
      // Obtener el valor seleccionado del select
      const selectedDish = selectDishes.value;
      const selectedCategory = selectCategories.value;

      // Llamar al manejador con el valor seleccionado del plato
      handler(selectedDish, selectedCategory);

      // Prevenir el comportamiento predeterminado del botón (enviar formulario)
      event.preventDefault();
    });
  }

  //Método para enlazar el formulario de desasignar plato de categoría con el manejador de eventos correspondiente.
  bindDesassignDishInCategory(handler) {
    const button = document.getElementById("desasignar");
    const selectDishes = document.getElementById("rpDishes");
    const selectCategories = document.getElementById("rpCategories");

    button.addEventListener("click", function (event) {
      //Obtener el valor seleccionado del select.
      const selectedDish = selectDishes.value;
      const selectedCategory = selectCategories.value;

      //Llamar al manejador con el valor seleccionado del plato.
      handler(selectedDish, selectedCategory);

      //Prevenir el comportamiento predeterminado del botón (enviar formulario).
      event.preventDefault();
    });
  }

  //Método para enlazar el apartado de mostrar platos en menú con el manejador de eventos correspondiente.
  bindShowDishInMenus(handle) {
    document.getElementById("rpDishes").addEventListener("change", function () {
      const selectDishes = document.getElementById("rpDishes");
      console.log(selectDishes.value);

      handle(selectDishes.value);
    });
  }

  //Método para enlazar el apartado de mostrar platos en categoría con el manejador de eventos correspondiente.
  bindShowDishInCategories(handle) {
    document.getElementById("rpDishes").addEventListener("change", function () {
      const selectDishes = document.getElementById("rpDishes");

      handle(selectDishes.value);
    });
  }

  //Método para enlazar el formulario de nueva categoría con el manejador de eventos correspondiente.
  bindNewCategoryForm(handler) {
    newCategoryValidation(handler);
  }

  //Método para enlazar el formulario de eliminar categoría con el manejador de eventos correspondiente.
  bindRemoveCategoryForm(delHandler) {
    const removeContainer = document.getElementById("removeCategory");
    const buttons = removeContainer.getElementsByTagName("a");
    for (const button of buttons) {
      button.addEventListener("click", function (event) {
        delHandler(this.dataset.category);
      });
    }
  }

  //Método para enlazar el formulario de nuevo restaurante con el manejador de eventos correspondiente.
  bindNewRestaurantForm(handler) {
    newRestaurantValidation(handler);
  
  }

  //Método bind para enlazar el submit del geocoder al manejador.
  bindGeocoder(handler) {
    const form = document.forms.fGeocoder;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handler();
      
    });
  }

  //Método para enlazar el menú de administración de la página con el manejador de eventos correspondiente.
  bindAdminMenu(
    hNewDish,
    hRemoveDish,
    hAssignsDish,
    hnewCategory,
    hRemoveCategory,
    hNewRestaurant,
    hModifyCategoryDish,
    hBackUp
  ) {
    const newDishLink = document.getElementById("newDish");
    newDishLink.addEventListener("click", (event) => {
      hNewDish();
    });

    const removeDishLink = document.getElementById("deleteDish");
    removeDishLink.addEventListener("click", (event) => {
      hRemoveDish();
    });

    const assignDishLink = document.getElementById("assignDish");
    assignDishLink.addEventListener("click", (event) => {
      hAssignsDish();
    });

    const newCategoryLink = document.getElementById("newCategory");
    newCategoryLink.addEventListener("click", (event) => {
      hnewCategory();
    });

    const removeCategoryLink = document.getElementById("deleteCategory");
    removeCategoryLink.addEventListener("click", (event) => {
      hRemoveCategory();
    });

    const newRestaurantLink = document.getElementById("newRestaurant");
    newRestaurantLink.addEventListener("click", (event) => {
      hNewRestaurant();
    });
    const modifyCategoryDishLink = document.getElementById("modifyCategories");
    modifyCategoryDishLink.addEventListener("click", (event) => {
      hModifyCategoryDish();
    });

    const backUpLink = document.getElementById("backupObjects");
    backUpLink.addEventListener("click", (event) => {
      hBackUp();
    });
  }

  /**Método bind para dotar de funcionalidad el formulario de autenticación. */
  bindLoginForm(handler) {
    const form = document.forms.fLogin;
    form.addEventListener("submit", (event) => {
      handler(form.username.value, form.password.value, form.remember.checked);
      event.preventDefault();
    });
  }

  /**Método bind para dotar de funcionalidad al botón de cerrar sesión. */
  bindCloseSession(handler) {
    document
      .getElementById("aCloseSession")
      .addEventListener("click", (event) => {
        handler();
        event.preventDefault();
      });
  }

  /**Método bind para añadir funcionalidad al enlace de guardar platos favoritos. */
  bindSaveFavouriteDishes(handler) {
    document
      .getElementById("saveFavouriteDish")
      .addEventListener("click", (event) => {
        handler();
      });
  }

  /**Método bind para dar funcionalidad al enlace de mostrar platos favoritos. */
  bindConsultFavouriteDishes(handler) {
    document.getElementById("lookupDish").addEventListener("click", (event) => {
      handler();
    });
  }

  /**Método bind para dar funcionalidad al botón de guardar de las cards de los platos. */
  bindSaveDishCard(handler) {
    const dishesCards = document.getElementById("dishes_cards");
    const linkGuardar = dishesCards.querySelectorAll(".btn.btn-success");
    for (const link of linkGuardar) {
      link.addEventListener("click", (event) => {
        handler(event.currentTarget.dataset.dish);
      });
    }
  }
}

//Exportamos la clase RestaurantView.
export default RestaurantView;
