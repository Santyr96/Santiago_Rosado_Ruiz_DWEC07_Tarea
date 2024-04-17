function showFeedBack(input, valid, message) {
  const validClass = valid ? "is-valid" : "is-invalid";
  const messageDiv = valid
    ? input.parentElement.querySelector("div.valid-feedback")
    : input.parentElement.querySelector("div.invalid-feedback");
  for (const div of input.parentElement.getElementsByTagName("div")) {
    div.classList.remove("d-block");
  }
  messageDiv.classList.remove("d-none");
  messageDiv.classList.add("d-block");
  input.classList.remove("is-valid");
  input.classList.remove("is-invalid");
  input.classList.add(validClass);
  if (message) {
    messageDiv.innerHTML = message;
  }
}
function defaultCheckElement(event) {
  this.value = this.value.trim();
  if (!this.checkValidity()) {
    showFeedBack(this, false);
  } else {
    showFeedBack(this, true);
  }
}

function newDishValidation(handler) {
 const form = document.forms.fNewDish;
 form.setAttribute('novalidate','');
 form.addEventListener('submit', function (event){
    let isValid = true;
    let firstInvalidElement = null;

    this.npDescription.value = this.npDescription.value.trim();
    showFeedBack(this.npDescription, true);

    this.npIngredients.value = this.npIngredients.value.trim();
    showFeedBack(this.npIngredients, true);

    if(!this.npName.checkValidity()){
        isValid = false;
        showFeedBack(this.npName, false);
        firstInvalidElement = this.npName;
    } else{
        showFeedBack(this.npName, true);
    }

    if(!this.npUrl.checkValidity()){
        isValid = false;
        showFeedBack(this.npUrl, false);
        firstInvalidElement = this.npUrl;
    } else{
        showFeedBack(this.npUrl, true);
    }
    
    if(!this.npCategories.checkValidity()){
        isValid = false;
        showFeedBack(this.npCategories, false);
        firstInvalidElement = this.npCategories;
    }else{
        showFeedBack(this.npCategories, true);
    }
    

    if(!this.npAllergen.checkValidity()){
        isValid = false;
        showFeedBack(this.npAllergen, false);
        firstInvalidElement = this.npAllergen;
    } else{
        showFeedBack(this.npAllergen, true);
    }

    if(!isValid){
        firstInvalidElement.focus();
    } else{
        const categories = [...this.npCategories.selectedOptions].map((option) => option.value);
        const allergens = [...this.npAllergen.selectedOptions].map((option) => option.value);
        handler(
            this.npName.value,
            this.npDescription.value,
            this.npUrl.value,
            this.npIngredients.value,
            categories, 
            allergens,
        );
    }
    event.preventDefault();
    event.stopPropagation();

    form.addEventListener('reset', (function (event) {
        for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
          div.classList.remove('d-block');
          div.classList.add('d-none');
        }
        for (const input of this.querySelectorAll('input')) {
          input.classList.remove('is-valid');
          input.classList.remove('is-invalid');
        }
        this.npName.focus();
      }));
    
      form.npName.addEventListener('change', defaultCheckElement);
      form.npIngredients.addEventListener('change', defaultCheckElement);
      form.npDescription.addEventListener('change', defaultCheckElement);
      form.npUrl.addEventListener('change', defaultCheckElement);
      form.npCategories.addEventListener('change', defaultCheckElement);
      form.npAllergen.addEventListener('change', defaultCheckElement);

 });


}

export { newDishValidation };
