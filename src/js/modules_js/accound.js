
const ACCOUND_FORM_ELEMENT = document.querySelector('.accound__form');
const ACCOUND_FORM = document.forms.personal_data;
console.log(ACCOUND_FORM);
function accessForm(boolean) {
   for (let f of ACCOUND_FORM) { f.disabled = boolean };
   if (!boolean) {
      document.querySelector('.accound__data-button').style.display = "block";
      ACCOUND_FORM[0].focus();
      ACCOUND_FORM_ELEMENT.classList.add('active')
   }
   if (boolean) document.querySelector('.accound__data-button').style.display = "";
}

