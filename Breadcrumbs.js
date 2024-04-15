/**Grado de Desarrollo de Aplicaciones Web.
 * DWEC - Unidad 5.
 * Alumno: Santiago Rosado Ruiz.
 * UT05 Práctica 5: Gestión de restaurantes - DOM y MVC.
 */

"use strict";
/*Clase encargada de gestionar las migas de pan. */
class Breadcrumbs {
  /**Constructor de la clase Breadcrumbs. Inicializa las migas de pan vacías y el elemento DOM de las migas. */
  constructor() {
    this.crumbs = []; // Array para almacenar las migas de pan.
    this.nav_bread = document.getElementById("nav_bread"); // Elemento del DOM para mostrar las migas de pan
  }

  // Método para añadir una nueva miga de pan
  addCrumb(...anchors) {
    for (const anchor of anchors) {
      this.crumbs.push(anchor);
    }

    this.render(); // Renderiza las migas de pan actualizadas
  }


  //Método para eliminar todas las migas de pan.
  removeAllCrumbs() {
    this.crumbs = [];
    this.render(); // Renderiza las migas de pan vacías.
  }

  // Método para renderizar las migas de pan en el DOM.
  render() {
    // Limpia el contenido anterior.
    this.nav_bread.replaceChildren();
    const ol = document.createElement("ol");
    ol.classList.add("breadcrumb");
    if (this.nav_bread.children.length === 0) {
      this.nav_bread.append(ol);
    }

    this.crumbs.forEach((anchor, index) => {
      if (index === this.crumbs.length - 1) {
        // Último elemento, marcado como activo, sin enlace.
        ol.insertAdjacentHTML(
          "beforeend",
          `<li class="breadcrumb-item active" " aria-current="page">${anchor}</li>`
        );
      } else {
        ol.insertAdjacentHTML(
          "beforeend",
          `<li class="breadcrumb-item"><a href="#" data-bread="${anchor}">${anchor}</a></li>`
        );
      }
    });

    // Añade la miga de pan al contenedor.
    this.nav_bread.append(ol);
  }
}

export default Breadcrumbs;
