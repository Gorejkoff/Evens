const ACCOUND_FORM = document.forms.personal_data;
function accessForm(boolean) {
   for (let f of ACCOUND_FORM) { f.disabled = boolean };
   if (!boolean) {
      document.querySelector('.accound__data-button').style.display = "block";
      ACCOUND_FORM[0].focus();
   }
   if (boolean) document.querySelector('.accound__data-button').style.display = "";
}

