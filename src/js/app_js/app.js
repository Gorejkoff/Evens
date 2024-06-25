"use strict"
// маркировка PC || MOBILE
const isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i) },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i) },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i) },
   any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
   }
};
const isPC = !isMobile.any();
if (isPC) { document.body.classList.add('_pc') } else { document.body.classList.add('_touch') };

const MENU_TABS = document.querySelectorAll('.js-menu-tab');
const MENU_CONTENT = document.querySelector('.js-menu-tab-content');
const MENU_LIST = document.querySelectorAll('.js-menu-tab-content li');
const HEADER_LINKS = document.querySelector('.js-header-links');
const VIEW = document.querySelector('.view');

// медиазапрос
const MIN768 = window.matchMedia('(min-width: 768px)');
const MIN1024 = window.matchMedia('(min-width: 1024px)');

// запись высоты header, header-nav для адаптации отступов
const HEADER = document.getElementById('header');
const HEADER_NAV = document.getElementById('header_nav');
let headerHeight;
let headerHeightNav;
function setDataHeightHeader() {
   requestAnimationFrame(() => {
      headerHeight = HEADER.offsetHeight
      headerHeightNav = HEADER_NAV.offsetHeight
      document.body.style.setProperty('--height-header', headerHeight + 'px');
      document.body.style.setProperty('--height-header-nav', headerHeightNav + 'px');
   })
};
if (HEADER) { setDataHeightHeader() }

// для адаптива блока с брэндами товара в каталоге
const brandBody = document.getElementById('brand-body');
if (brandBody) {
   brandBody.children.length > 12 && document.getElementById('brand').classList.add('card-hidden');
}

// анализ прокрутки для адаптива меню
let ignoreHeaderHight;
/* === СОБЫТИЕ СКРОЛЛА === */
window.addEventListener('scroll', (event) => {
   scrollHeaderHight();
   if (scrollY > headerHeight && MIN1024.matches) {
      moveListMenu();
   } else {
      resetMoveListMenu();
      if (document.querySelector('.js-index') && MIN1024.matches) closeCatalogNav();
   }
});
function scrollHeaderHight() {
   if (scrollY > headerHeight) {
      ignoreHeaderHight = headerHeight;
      document.body.style.setProperty('--ignore-header-hight', ignoreHeaderHight + 'px');
   } else {
      document.body.style.setProperty('--ignore-header-hight', 0 + 'px');
   }
}
scrollHeaderHight();

function moveListMenu() {
   HEADER_NAV.classList.add('page-scroll')
   MENU_LIST.forEach((e) => HEADER_LINKS.append(e))
}
function resetMoveListMenu() {
   // HEADER_NAV.classList.remove('open-search');
   HEADER_NAV.classList.remove('page-scroll');
   MENU_LIST.forEach((e) => MENU_CONTENT.append(e))
}
/* === СОБЫТИЕ ИЗМЕНЕНИЯ ШИРИНЫ ЭКРАНА === */
window.addEventListener('resize', () => {
   if (HEADER && HEADER_NAV) { setDataHeightHeader() };
})

/* ==== СОБЫТИЯ КЛИКА ==== */
document.addEventListener('click', (event) => {

   /* открывает вкладки в пунктах меню header */
   if (!isPC && event.target.closest('.js-menu-tab-button')) {
      if (event.target.closest('.js-menu-tab').classList.contains('active')) {
         MENU_TABS.forEach((e) => { closeTabs(e) });
         return;
      }
      openTab(event.target.closest('.js-menu-tab-button'))
   }
   /* закрывает вкладки в пунктах меню header */
   if (!isPC && event.target.closest('.js-menu-tab')) {
      let element = event.target.closest('.js-menu-tab');
      MENU_TABS.forEach((e) => { if (element !== e) { closeTabs(e) } })
   } else {
      MENU_TABS.forEach((e) => { closeTabs(e) })
   }
   /* открывает меню в mobile */
   if (!MIN768.matches && event.target.closest('#burger')) {
      document.body.classList.add('burger-active');
   }
   /* закрывает меню в mobile */
   if (event.target.closest('#closeMenu')) {
      closeMenuMobile();
   }
   /* открывает catalog-nav */
   if (event.target.closest('.js-open-catalog-nav') || (MIN768.matches && event.target.closest('#burger'))) {
      openCatalogNav();
   } else if (MIN768.matches && !event.target.closest('.js-catalog-nav-body') && !event.target.closest('#catalog_nav_wrapper')) {
      closeCatalogNav();
   }

   // меню, кнопка закрыть, закрывает все открытые вкладки
   if (event.target.closest('.js-nav-close')) {
      document.querySelectorAll('.open').forEach((e) => e.classList.remove('open'));
      closeMenuMobile();
   }
   // открывает поле поиска в меню после скролла и мобилка
   if (event.target.closest('.header-nav__button-search')) {
      HEADER_NAV.classList.add('open-search')
   } else if (!event.target.closest('.header-nav__search') || event.target.closest('.header-nav__search-back')) {
      // закрывает поле поиска в меню после скролла и в мобильном варианте
      HEADER_NAV.classList.remove('open-search')
   }
   // уменьшить количесво товара в корзине
   if (event.target.closest('.basket__dicrement')) {
      const input = event.target.closest('.basket__quantity').querySelector('input');
      input.value = Number(input.value) - 1;
      validationQuantityBasket(input);
   }
   // увеличить количесво товара в корзине
   if (event.target.closest('.basket__increment')) {
      const input = event.target.closest('.basket__quantity').querySelector('input');
      input.value = Number(input.value) + 1;
   }
   // открывает полсый список бредов в каталоге
   if (event.target.closest('#brand-more')) {
      document.getElementById('brand').classList.remove('card-hidden');
   }
   // смена текста на странице входа в ЛК
   if (event.target.closest('.js-log-button')) {
      document.querySelector('.js-log-email').style.display = 'none';
      document.querySelector('.js-log-name').style.display = 'block';
   }
   // смена текста на странице входа в ЛК
   if (event.target.closest('.js-name-button')) {
      document.querySelector('.js-log-name').style.display = 'none';
      document.querySelector('.js-log-code').style.display = 'block';
   }
   // едактировать форму в ЛК
   if (event.target.closest('.js-save-init')) {
      accessForm(false);
   }
   // открывает вкладку товаров в "мои змказы"
   if (event.target.closest('.accound__orders-open')) {
      event.target.closest('.accound__orders-shell').classList.toggle('active');
   }

   // увеличение картинки слайдера 'about us'
   if (event.target.closest('.js-scale-img')) {
      let src = event.target.closest('img').getAttribute('src');
      document.body.insertAdjacentHTML(
         'beforeend',
         `<div class="show-image">
            <div class="show-image__container">
               <div class="show-image__image_body">
                  <div class="show-image__close">
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 15L15 1M15 15L1 1" stroke="#9604CF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                  <img src="${src}" alt="картинка">
               </div>
            </div>
         </div>`
      );
   }
   if (event.target.closest('.show-image__close')) {
      event.target.closest('.show-image').remove();
   }
   // переключение вида списка товаров на странице search
   if (VIEW && event.target.closest('.js-view-grid')) {
      viewGrid()
   };
   if (VIEW && event.target.closest('.js-view-block')) {
      viewBlock()
   };
   if (event.target.closest('.button__compare') ||
      event.target.closest('.button__favourites') ||
      event.target.closest('.card__button button')) {
      event.preventDefault();
   }
   //открывает модальное окно слайдера в карточке товара
   if (event.target.closest('.swiper-gallery')) {
      document.body.classList.add('gallery-madal-open');
   }
   if (event.target.closest('.product-gallery__modal-buttons .button-close') || !event.target.closest('.product-gallery__modal-wrapper')) {
      document.body.classList.remove('gallery-madal-open');
   }
})

/* === СОБЫТИЕ МЫШЬ НАД ЭЛЕМЕНТОМ === */
document.body.addEventListener('mouseover', (event) => {
   /* открывает вкладки в пунктах меню header hover */
   if (isPC && event.target.closest('.js-menu-tab-button')) {
      openTab(event.target.closest('.js-menu-tab-button'))
   }
   /* закрывает вкладки в пунктах меню header hover */
   if (isPC && !event.target.closest('.js-menu-tab-button') && !event.target.closest('.js-menu-tab-body')) {
      MENU_TABS.forEach((e) => { closeTabs(e) })
   }
})

// переключение вида списка товаров на странице search
function viewBlock() {
   document.querySelector('.js-view-grid').classList.remove('active');
   document.querySelector('.js-change-view').classList.remove('view-grid');
   document.querySelector('.js-view-block').classList.add('active');
   document.querySelector('.js-change-view').classList.add('view-block');
}
function viewGrid() {
   document.querySelector('.js-view-block').classList.remove('active');
   document.querySelector('.js-change-view').classList.remove('view-block');
   document.querySelector('.js-view-grid').classList.add('active');
   document.querySelector('.js-change-view').classList.add('view-grid');
}


// проверка количесва товара в корзине
const QUANTITY_BASKET = document.querySelectorAll('.basket__quantity input');
QUANTITY_BASKET.forEach((e) => {
   e.addEventListener('input', () => validationQuantityBasket(e))
})

function closeMenuMobile() {
   document.body.classList.remove('burger-active');
   document.body.classList.remove('catalog-nav-open');
}

function closeTabs(element) {
   let body = element.querySelector('.js-menu-tab-body');
   element.classList.remove('active');
   body.style.height = '';
}

function openTab(element) {
   let parent = element.closest('.js-menu-tab');
   let body = parent.querySelector('.js-menu-tab-body');
   let height = parent.querySelector('.js-menu-tab-content').offsetHeight;
   parent.classList.add('active');
   body.style.height = height + 'px';
}

function openCatalogNav() {
   document.querySelector('#catalog_nav_wrapper').classList.toggle('open');
   document.body.classList.add('catalog-nav-open');
}

function closeCatalogNav() {
   document.querySelector('#catalog_nav_wrapper').classList.remove('open');
   document.body.classList.remove('catalog-nav-open');
}
function validationQuantityBasket(e) {
   if (e.value < 1) { e.value = 1; }
}

// переход фокуса при вводе кода
const INPUTS_CODE = document.querySelectorAll('.enter-code__inputs input');
if (INPUTS_CODE.length > 0) {
   INPUTS_CODE.forEach((e, i) => {
      e.addEventListener('input', () => {
         if (e.value.length > 1) { e.value = e.value.slice(0, 1) }
         if (e.value.length == 1 && INPUTS_CODE.length > i + 1) { INPUTS_CODE[i + 1].focus() }

      })
   })
}

