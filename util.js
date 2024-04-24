/**
 * Desarrollo de Aplicaciones Web
 * Módulo: Desarrollo Web en Entorno Servidor
 * Autor: Santiago Rosado Ruiz
 * Unidad 7: Programación AJAX en JavaScript.
 * 
 * Archivo con las funciones genéricas que se utilizarán en diferentes
 * partes de la aplicación.
 */

//Función que se encarga de la creación de una cookie.
function setCookie(cname, cvalue, exdays) {
    //Creamos una variable que almacene la fecha actual.
    const d = new Date();
    //Le sumamos los días que queremos que dure la cookie.
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    //Con la funcion toUTCString() convertimos la fecha a un formato legible.
    const expires = "expires=" + d.toUTCString();
    //Con la funcion document.cookie creamos la cookie.
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//Función que se encarga de recuperar la cookie.
function getCookie(cname) {
    //Creamos una variable que almacene la cookie.
    const re = new
    RegExp(`(?:(?:^|.*;\\s*)${cname}\\s*\\=\\s*([^;]*).*$)|^.*$`);
    return document.cookie.replace(re, '$1');
}

//Exportamos las funciones.
export { setCookie, getCookie };