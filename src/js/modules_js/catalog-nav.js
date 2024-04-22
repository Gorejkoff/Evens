// открывает вкладки в меню каталога
const CATALOG_CONTENT = document.querySelectorAll('.js-catalog-nav-content');

if (isPC) {
   document.addEventListener('mouseover', (event) => { runTabCatalogNav(event) })
} else {
   document.addEventListener('click', (event) => { runTabCatalogNav(event) })
}

function runTabCatalogNav(event) {
   if (event.target.closest('.js-catalog-nav-button')) {
      openTabCatalogNav(event);
   } else if (!event.target.closest('.js-catalog-nav-body')) {
      closeTabCatalogNav();
   }
}

function closeTabCatalogNav() {
   //  body.classList.remove('wide');
   CATALOG_CONTENT.forEach((e) => {
      e.classList.remove('open');
   })
}

function openTabCatalogNav(event) {
   const body = event.target.closest('.js-catalog-nav-body');
   const number = event.target.closest('.js-catalog-nav-button').dataset.number;
   //  body.classList.add('wide');
   CATALOG_CONTENT.forEach((e) => {
      if (e.dataset.number == number) {
         e.classList.add('open');
      } else {
         e.classList.remove('open');
      }

   })
}