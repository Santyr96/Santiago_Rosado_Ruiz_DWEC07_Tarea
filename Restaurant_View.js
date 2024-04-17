/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 5.
 * Alumno: Santiago Rosado Ruiz.
 * UT04 Práctica 5: Gestión de restaurantes - DOM y MVC.
 */
"use strict";

import { Allergen, Category, Menu } from "./Objetos_restaurante.js";
import { newDishValidation} from "./validation.js";

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
      //Si disponemos de un plato, lo guardamos en una variable auxiliar para eliminarlo del array, de esta manera no se repetiran los platos.
      if (dish_random) {
        const aux_random = dish_random;
        dish.splice(dish.indexOf(aux_random), 1);
      }

      //Insertamos los platos en el contenedor.
      div.insertAdjacentHTML(
        "beforeend",

        `<div class="card" id="dishes_cards" style="width: 18rem;">
      <img src="${dish_random.image}" class="card-img-top" alt="${
          dish_random.name
        }">
      <div class="card-body">
        <h5 class="card-title">${dish_random.name}</h5>
        <p class="card-text">Ingredientes: ${dish_random.ingredients.join(
          ", "
        )}</p>
        <a href="#" class="btn btn-primary" data-dish = "${
          dish_random.name
        }">Propiedades</a>
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

    //Insertamos las propiedades de los platos.
    for (const dish of dishes) {
      console.log(dish);
      const ingredientsList = Array.isArray(dish.ingredients) ? dish.ingredients.join(", ") : dish.ingredients;
      div.insertAdjacentHTML(
        "beforeend",
        `<div class="card" style="width: 18rem;">
          <img src="${dish.image}" class="card-img-top" alt="${dish.name}">
          <div class="card-body">
            <h5 class="card-title">${dish.name}</h5>
            <p class="card-text"><strong>Ingredientes:</strong> ${ingredientsList}</p>
            <a href="#" class="btn btn-primary" data-dish="${dish.name}">Propiedades</a>
          </div>
        </div>`
      );
    }

    this.main.append(container);
    container.append(div);
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
    const ingredientsList = Array.isArray(dish.ingredients) ? dish.ingredients.join(", ") : dish.ingredients;
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

    menuOption.append(subOptions);
    this.menu.append(menuOption);
  }

  //Método que muestra el formulario de creación de platos.
  showDishCreationForm(categories,allergens) {
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
    for(const allergen of allergens){
      npAllergen.insertAdjacentHTML(
        "beforeend",
        `<option value="${allergen.name}">${allergen.name}</option>`
      );
    }

    this.main.append(container);
  }

  showRemoveDishForm(dishes) {
    this.main.replaceChildren();
    if (this.categories.children.length > 1) this.categories.children[1].remove();

  	const container = document.createElement('div');
  	container.classList.add('container');
  	container.classList.add('my-3');
  	container.id = 'remove-dish';

    container.insertAdjacentHTML(
      'afterbegin',
      '<h1 class="display-5">Eliminar un plato</h1>',
    );

    const form = document.createElement('form');
    form.name = 'fRemoveDish';
    form.setAttribute('role', 'form');
    form.setAttribute('novalidate', '');
    form.classList.add('row');
    form.classList.add('g-3');


    form.insertAdjacentHTML(
      'beforeend',
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
  </div>`,
    );
    const rpDishes = form.querySelector('#rpDishes');
    for (const dish of dishes) {
      rpDishes.insertAdjacentHTML('beforeend', `<option value="${dish.name}">${dish.name}</option>`);
    }

    container.append(form);
    container.insertAdjacentHTML(
      'beforeend',
      '<div id="dish-list" class="container my-3"><div class="row"></div></div>',
    );

  	this.main.append(container);
  }


  showAssignDishesForm(dishes,menus) {
    this.main.replaceChildren();
    if (this.categories.children.length > 1) this.categories.children[1].remove();

    const container = document.createElement('div');
  	container.classList.add('container');
  	container.classList.add('my-3');
  	container.id = 'assign-dish';

    container.insertAdjacentHTML(
      'afterbegin',
      '<h1 class="display-5">Asignación y designación de platos a menus</h1>',
    );

    const form = document.createElement('form');
    form.name = 'fAssignDish';
    form.setAttribute('role', 'form');
    form.setAttribute('novalidate', '');
    form.classList.add('row');
    form.classList.add('g-3');

    form.insertAdjacentHTML(
      'beforeend',
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
      <button class="btn btn-primary"  id="asignar" type="submit">Asignar</button>
      <button class="btn btn-primary" " id="desasignar" type="submit">Desasignar</button>
  </div>
  
  <div id="menusList">
      <p>Menus donde se encuentra el plato</p>
  </div>`,
    );

    const rpDishes = form.querySelector('#rpDishes');
    for (const dish of dishes) {
      rpDishes.insertAdjacentHTML('beforeend', `<option value="${dish.name}">${dish.name}</option>`);
    }

    const rpMenus = form.querySelector('#rpMenus');
    for (const menu of menus) {
      rpMenus.insertAdjacentHTML('beforeend', `<option value="${menu.name}">${menu.name}</option>`);
    }

    this.main.append(container);
    container.append(form);
  }

  //Método que muestra el modal que proporcionará retroalimentación al usuario.
  showNewProductModal(done, dish, error) {
    const messageModalContainer = document.getElementById('messageModal');
    const messageModal = new bootstrap.Modal('#messageModal');

    const title = document.getElementById('messageModalTitle');
    title.innerHTML = 'Plato creado';
    const body = messageModalContainer.querySelector('.modal-body');
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML('afterbegin', `<div class="p-3">El plato <strong>${dish.name}</strong>  ha sido creada correctamente.</div>`);
    } else {
      body.insertAdjacentHTML(
        'afterbegin',
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> no ha podido crearse correctamente.</div>`,
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewDish.reset();
      }
      document.fNewDish.npName.focus();
    };
    messageModalContainer.addEventListener('hidden.bs.modal', listener, { once: true });
  }

  showRemoveDishModal(done, dish, error) {
    const productList = document.getElementById('dish-list');
    const messageModalContainer = document.getElementById('messageModal');
    const messageModal = new bootstrap.Modal('#messageModal');

    const title = document.getElementById('messageModalTitle');
    title.innerHTML = 'Plato eliminado';
    const body = messageModalContainer.querySelector('.modal-body');
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML('afterbegin', `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido eliminado correctamente.</div>`);
    } else if (!done && !dish){
      body.insertAdjacentHTML(
        'afterbegin',
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`,
      );
    }
    else {
      body.insertAdjacentHTML(
        'afterbegin',
        '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe en el manager.</div>',
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        const button = productList.querySelector(`a.btn[data-name="${dish.name}"]`);
        button.parentElement.parentElement.parentElement.remove();
      }
    };
    messageModalContainer.addEventListener('hidden.bs.modal', listener, { once: true });
  }

  showAssignDishModal(done, dish, error) {
    const productList = document.getElementById('dish-list');
    const messageModalContainer = document.getElementById('messageModal');
    const messageModal = new bootstrap.Modal('#messageModal');

    const title = document.getElementById('messageModalTitle');
    title.innerHTML = `Plato: ${dish.name} asignado`;
    const body = messageModalContainer.querySelector('.modal-body');
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML('afterbegin', `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido asignado correctamente.</div>`);
    } else if (!done && !dish){
      body.insertAdjacentHTML(
        'afterbegin',
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`,
      );
    }
    else {
      body.insertAdjacentHTML(
        'afterbegin',
        '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe.</div>',
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        const button = productList.querySelector(`a.btn[data-name="${dish.name}"]`);
        button.parentElement.parentElement.parentElement.remove();
      }
    };
    messageModalContainer.addEventListener('hidden.bs.modal', listener, { once: true });
  }

  showDesassignDishModal(done, dish, error) {
    const productList = document.getElementById('dish-list');
    const messageModalContainer = document.getElementById('messageModal');
    const messageModal = new bootstrap.Modal('#messageModal');

    const title = document.getElementById('messageModalTitle');
    title.innerHTML = `Plato: ${dish.name} desasignado`;
    const body = messageModalContainer.querySelector('.modal-body');
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML('afterbegin', `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido desasignado correctamente.</div>`);
    } else if (!done && !dish){
      body.insertAdjacentHTML(
        'afterbegin',
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> No has seleccionado ningún plato</div>`,
      );
    }
    else {
      body.insertAdjacentHTML(
        'afterbegin',
        '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe en el manager.</div>',
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        const button = productList.querySelector(`a.btn[data-name="${dish.name}"]`);
        button.parentElement.parentElement.parentElement.remove();
      }
    };
    messageModalContainer.addEventListener('hidden.bs.modal', listener, { once: true });
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
    const links = dishes.querySelectorAll("a");
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

  bindNewDishForm(handler) {
    newDishValidation(handler);
  }

  bindRemoveProduct(handler) {
    const button = document.getElementById('eliminar');
    const select = document.getElementById('rpDishes');
  
    button.addEventListener('click', function(event) {
      // Obtener el valor seleccionado del select
      const selectedDish = select.value;
      
      // Llamar al manejador con el valor seleccionado del plato
      handler(selectedDish);
      
      // Prevenir el comportamiento predeterminado del botón (enviar formulario)
      event.preventDefault();
    });
  }

  bindAssignDish(handlerAssign,handlerDeassign) {
    const buttonAsignar = document.getElementById('asignar');
    const buttonDesasignar = document.getElementById('desasignar');
    const selectDishes = document.getElementById('rpDishes');
    const selectMenus = document.getElementById('rpMenus');

    buttonAsignar.addEventListener('click', function(event) {
      // Obtener el valor seleccionado del select
      const selectedDish = selectDishes.value;
      const selectedMenu = selectMenus.value;

      // Llamar al manejador con el valor seleccionado del plato
      handlerAssign(selectedDish, selectedMenu);

      // Prevenir el comportamiento predeterminado del botón (enviar formulario)
      event.preventDefault();
    });

    buttonDesasignar.addEventListener('click', function(event) {
      // Obtener el valor seleccionado del select
      const selectedDish = selectDishes.value;
      const selectedMenu = selectMenus.value;

      // Llamar al manejador con el valor seleccionado del plato
      handlerDeassign(selectedDish, selectedMenu);

      // Prevenir el comportamiento predeterminado del botón (enviar formulario)
      event.preventDefault();
    });
    
  }
  

  bindAdminMenu(hNewDish,hRemoveDish,hAssignsDish){
    const newDishLink = document.getElementById("newDish");
    newDishLink.addEventListener("click", (event) => {
      hNewDish();
    })

    const removeDishLink = document.getElementById("deleteDish");
    removeDishLink.addEventListener("click", (event) => {
      hRemoveDish();
    })

    const assignDishLink = document.getElementById("assignDish");
    assignDishLink.addEventListener("click", (event) => {
      hAssignsDish();
    })

    };
}

//Exportamos la clase RestaurantView.
export default RestaurantView;
