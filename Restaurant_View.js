/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 5.
 * Alumno: Santiago Rosado Ruiz.
 * UT04 Práctica 5: Gestión de restaurantes - DOM y MVC.
 */
"use strict";

import { Allergen, Category, Menu } from "./Objetos_restaurante.js";

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
      if(dish_random){
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
    if(elem instanceof Category){
      div.insertAdjacentHTML("beforeend", `<h1>Categoría: ${title}</h1>`);
      
    } else if(elem instanceof Allergen){
      div.insertAdjacentHTML("beforeend", `<h1>Platos que contienen el alérgeno ${title}</h1>`);
      
    }else if(elem instanceof Menu){
      div.insertAdjacentHTML("beforeend", `<h1>Platos del ${title} </h1>`);
      
    }
    
   

    //Insertamos las propiedades de los platos.
    for (const dish of dishes) {
      console.log(dish);
      div.insertAdjacentHTML(
        "beforeend",
        `<div class="card"  style="width: 18rem;">
      <img src="${dish.image}" class="card-img-top" alt="${dish.name}">
      <div class="card-body">
        <h5 class="card-title">${dish.name}</h5>
        <p class="card-text"><strong>Ingredientes:</strong> ${dish.ingredients.join(", ")}</p>
        <a href="#" class="btn btn-primary" data-dish="${
          dish.name
        }">Propiedades</a>
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
    if(this.categories){
      if (this.categories.children.length > 1) {
        this.categories.replaceChildren();
      }
    }
     
    //Creamos un contenedor para mostrar los platos.
      const containerDish = document.getElementById("dish-list");

      //Si el contenedor existe ya con elementos, lo limpiamos.
      if(containerDish) {
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

    div.insertAdjacentHTML(
      "beforeend",

      `<div class="card mb-3">
      <img src="${dish.image}" class="card-img-top" alt="${dish.name}">
      <div class="card-body">
        <h5 class="border-animation">${dish.name}</h5>
        <p class="card-text"><strong>Ingredientes:</strong></p>
        <p class="card-text">${dish.ingredients.join(", ")}</p> 
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
    if(this.categories){
      if (this.categories.children.length >= 1) {
        this.categories.replaceChildren();
      }
    }
     
    //Obtenemos el contenedor de los platos, por si se encuentran los platos mostrandose.
      const containerDish = document.getElementById("dish-list");

      //Si el contenedor existe ya con elementos, lo limpiamos.
      if(containerDish) {
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
  showAllergenMenu(allergens){
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
    container.classList.add("dropdown-menu","submenu","submenu-left");
    
    container.id = "allergens-menu";
    //Recorremos los alergenos recibidos por nuestro modelo y creamos un contador, con el objeto de crear separadores en las opciones de alérgenos.
    let contador = 0;
    for (const allergen of allergens) {
        container.insertAdjacentHTML("beforeend",
        `<li><a class="dropdown-item" href="#" data-allergen="${allergen.name}">${allergen.name}</a></li>
        `);

        const allergen_array = Array.from(allergens);
       
        if (contador < allergen_array.length - 1) {
          container.insertAdjacentHTML("beforeend", `<hr class="dropdown-divider">`);
          contador++;
        }
    }
    
    //Agregamos el elemento ul al menú de opciones.
    this.options.append(li);
    li.append(container);
    
  }

  //Método que se ve a encargar de mostrar en el menú de opciones, los menús de nuestra pagina. Sigue el mismo procedimiento que el anterior método.
  showMenus(menus){ 
    const li = document.createElement("li");

    li.insertAdjacentHTML(
      "beforeend",
      `<a class="dropdown-item " href="#" id="dropdownMenus"
      aria-expanded="false"><i class="fa-solid fa-arrow-left"></i> Menus</a>`
    );

    const container = document.createElement("ul");
    container.classList.add("dropdown-menu","submenu","submenu-left");
    container.id = "menus-menu";

    let contador = 0;
    for (const menu of menus) {
        container.insertAdjacentHTML("beforeend",
        `<li><a class="dropdown-item" href="#" data-menu="${menu.name}">${menu.name}</a></li>`);

        const menus_array = Array.from(menus);
       
        if (contador < menus_array.length - 1) {
          container.insertAdjacentHTML("beforeend", `<hr class="dropdown-divider">`);
          contador++;
        }
    }

    this.options.append(li);
    li.append(container);
  }

  /*Método que se va a encargar de mostrar en el menú de opciones los restaurantes registrados en el manager. Siguer el mismo procedimientos que el método anterior.*/
  showRestaurantsMenu(restaurants){
    const li = document.createElement("li");

    li.insertAdjacentHTML(
      "beforeend",
      `<a class="dropdown-item " href="#" id="dropdownMenus"
      aria-expanded="false"><i class="fa-solid fa-arrow-left"></i> Restaurantes</a>`
    );

    const container = document.createElement("ul");
    container.classList.add("dropdown-menu","submenu","submenu-left");
    container.id = "menus-restaurant";

    let contador = 0;
    for (const restaurant of restaurants) {
        container.insertAdjacentHTML("beforeend",
        `<li><a class="dropdown-item" href="#" data-restaurant="${restaurant.name}">${restaurant.name}</a></li>`);

        const restaurants_array = Array.from(restaurants);
       
        if (contador < restaurants_array.length - 1) {
          container.insertAdjacentHTML("beforeend", `<hr class="dropdown-divider">`);
          contador++;
        }
    }

    this.options.append(li);
    li.append(container);
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



}



//Exportamos la clase RestaurantView.
export default RestaurantView;
