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

// анализ прокрутки для адаптива меню
let ignoreHeaderHight;
/* === СОБЫТИЕ СКРОЛЛА === */
window.addEventListener('scroll', (event) => {
   scrollHeaderHight();
   if (scrollY > headerHeight && MIN1024.matches) {
      moveListMenu();
   } else {
      resetMoveListMenu();
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
   HEADER_NAV.classList.remove('open-search');
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
   } else if (MIN768.matches && !event.target.closest('.js-catalog-nav-body')) {
      closeCatalogNav();
   }
   // меню, кнопка назад
   if (event.target.closest('.js-nav-back')) {
      event.target.closest('.open').classList.remove('open');
   }
   // меню, кнопка закрыть, закрывает все открытые вкладки
   if (event.target.closest('.js-nav-close')) {
      document.querySelectorAll('.open').forEach((e) => e.classList.remove('open'));
      closeMenuMobile();
   }
   // открывает поле поиска в меню после скролла
   if (event.target.closest('.header-nav__button-search')) {
      HEADER_NAV.classList.add('open-search')
   }
   // закрывает поле поиска в меню после скролла и в мобильном варианте
   if (!event.target.closest('#header_nav') || event.target.closest('.header-nav__search-back')) {
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

// проверка количесва товара в корзине
const QUANTITY_BASKET = document.querySelectorAll('.basket__quantity input');
QUANTITY_BASKET.forEach((e) => {
   e.addEventListener('input', () => validationQuantityBasket(e))
})

function closeMenuMobile() {
   document.body.classList.remove('burger-active');
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
   document.querySelector('#catalog_nav_wrapper').classList.toggle('open')
}

function closeCatalogNav() {
   document.querySelector('#catalog_nav_wrapper').classList.remove('open')
}
function validationQuantityBasket(e) {
   if (e.value < 1) { e.value = 1; }
}