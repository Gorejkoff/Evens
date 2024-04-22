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
// перемещение блоков при адаптиве по данным атрибута 
// data-da=".class,3,768" 
// класс родителя куда перемещать
// порядковый номер в родительском блоке куда перемещается начиная с 0 как индексы массива
// ширина экрана min-width
// два перемещения: data-da=".class,3,768,.class2,1,1024"
const ARRAY_DATA_DA = document.querySelectorAll('[data-da]');
ARRAY_DATA_DA.forEach(function (e) {
   const dataArray = e.dataset.da.split(',');
   const addressMove = searchDestination(e, dataArray[0]);
   const addressMoveSecond = dataArray[3] && searchDestination(e, dataArray[3]);
   const addressParent = e.parentElement;
   const listChildren = addressParent.children;
   const mediaQuery = window.matchMedia(`(min-width: ${dataArray[2]}px)`);
   const mediaQuerySecond = dataArray[5] && window.matchMedia(`(min-width: ${dataArray[5]}px)`);
   for (let i = 0; i < listChildren.length; i++) { !listChildren[i].dataset.n && listChildren[i].setAttribute('data-n', `${i}`) };
   mediaQuery.matches && startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   if (mediaQuerySecond && mediaQuerySecond.matches) moving(e, dataArray[4], addressMoveSecond);
   mediaQuery.addEventListener('change', () => { startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) });
   if (mediaQuerySecond) mediaQuerySecond.addEventListener('change', () => {
      if (mediaQuerySecond.matches) { moving(e, dataArray[4], addressMoveSecond); return; };
      startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   });
});

function startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) {
   if (mediaQuery.matches) { moving(e, dataArray[1], addressMove); return; }
   if (listChildren.length > 0) {
      for (let z = 0; z < listChildren.length; z++) {
         if (listChildren[z].dataset.n >= e.dataset.n) {
            listChildren[z].before(e);
            break;
         } else if (z == listChildren.length - 1) {
            addressParent.append(e);
         }
      }
      return;
   }
   addressParent.prepend(e);
};

function searchDestination(e, n) {
   if (e.parentElement.querySelector(n)) { return e.parentElement.querySelector(n) };
   return searchDestination(e.parentElement, n);
}

function moving(e, order, addressMove) {
   if (order == "first") { addressMove.prepend(e); return; };
   if (order == "last") { addressMove.append(e); return; };
   if (addressMove.children[order]) { addressMove.children[order].before(e); return; }
   addressMove.append(e);
}



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
if (document.querySelector('.filter')) {

   // двойной ползунок
   const INPUT_MAX = document.getElementById('price-max');
   const INPUT_MIN = document.getElementById('price-min');
   const SPIN_MAX = document.getElementById('spin-max');
   const SPIN_MIN = document.getElementById('spin-min');
   const PRICE_RANGE = document.getElementById('price-range');
   const MAX_VALUE = Number(INPUT_MAX.max);
   const MIN_VALUE = Number(INPUT_MIN.min);
   let mouseX;
   let spinMove = false;
   let spinWidth = SPIN_MAX.offsetWidth;
   let rangeStart = PRICE_RANGE.getBoundingClientRect().left;
   let rangeWidth = PRICE_RANGE.offsetWidth - spinWidth;
   let maxRange = MAX_VALUE - MIN_VALUE;

   (function () {
      INPUT_MAX.value = INPUT_MAX.max;
      INPUT_MIN.value = INPUT_MAX.min;
      SPIN_MAX.ondragstart = function () { return false };
      SPIN_MIN.ondragstart = function () { return false };
      setGradient();
   })();

   isPC && document.addEventListener('mousemove', mousemove);
   isPC && SPIN_MAX.addEventListener('mousedown', startEvent);
   isPC && SPIN_MIN.addEventListener('mousedown', startEvent);
   isPC && document.addEventListener('mouseup', andEvent);
   !isPC && document.addEventListener('touchmove', mousemove);
   !isPC && SPIN_MAX.addEventListener('touchstart', startEvent);
   !isPC && SPIN_MIN.addEventListener('touchstart', startEvent);
   !isPC && document.addEventListener('touchend', andEvent);

   INPUT_MAX.addEventListener('change', () => {
      validationInput(INPUT_MAX);
      setRange(INPUT_MAX, SPIN_MAX);
   });
   INPUT_MIN.addEventListener('change', () => {
      validationInput(INPUT_MIN);
      setRange(INPUT_MIN, SPIN_MIN);
   });

   function startEvent(event) {
      !MIN1024.matches && getProperties();
      !isPC ? mouseX = event.changedTouches[0].clientX : false;
      if (event.target.closest('#spin-max')) {
         spinMove = true;
         SPIN_MAX.style.zIndex = 2;
         SPIN_MIN.style.zIndex = 1;
         moveRange(SPIN_MAX, INPUT_MAX)
      }
      if (event.target.closest('#spin-min')) {
         spinMove = true;
         SPIN_MIN.style.zIndex = 2;
         SPIN_MAX.style.zIndex = 1;
         moveRange(SPIN_MIN, INPUT_MIN)
      }
   }

   function andEvent() { spinMove = false };
   function mousemove(event) { isPC ? mouseX = event.clientX : mouseX = event.changedTouches[0].clientX };

   function validationInput(input) {
      const val = input.value;
      if (val < MIN_VALUE) input.value = MIN_VALUE;
      if (val > MAX_VALUE) input.value = MAX_VALUE;
      if (INPUT_MAX == input && Number(INPUT_MAX.value) < Number(INPUT_MIN.value)) { input.value = INPUT_MIN.value };
      if (INPUT_MIN == input && Number(INPUT_MIN.value) > Number(INPUT_MAX.value)) { input.value = INPUT_MAX.value };
   }

   function setRange(imput, spin) {
      let offsetSpin = (imput.value - MIN_VALUE) / maxRange;
      spin.style.left = offsetSpin * rangeWidth + 'px';
      setGradient();
   }

   function setGradient() {
      PRICE_RANGE.style.setProperty('--minGradient', ((INPUT_MIN.value - MIN_VALUE) / maxRange * 100).toFixed(1) + '%');
      PRICE_RANGE.style.setProperty('--maxGradient', ((INPUT_MAX.value - MIN_VALUE) / maxRange * 100).toFixed(1) + '%');
   }

   function moveRange(spin, input) {
      if (!spinMove) return;
      let offsetLeft = mouseX - rangeStart - spinWidth / 2;
      if (offsetLeft < 0) { offsetLeft = 0 };
      if (offsetLeft > rangeWidth) { offsetLeft = rangeWidth };
      let value = Number((MIN_VALUE + offsetLeft / rangeWidth * maxRange).toFixed());
      if (INPUT_MAX == input && value < Number(INPUT_MIN.value)) { value = INPUT_MIN.value };
      if (INPUT_MIN == input && value > Number(INPUT_MAX.value)) { value = INPUT_MAX.value };
      input.value = value;
      setRange(input, spin);
      requestAnimationFrame(() => moveRange(spin, input))
   }

   function getProperties() {
      spinWidth = SPIN_MAX.offsetWidth;
      rangeStart = PRICE_RANGE.getBoundingClientRect().left;
      rangeWidth = PRICE_RANGE.offsetWidth - spinWidth;
      maxRange = MAX_VALUE - MIN_VALUE;
      setRange(INPUT_MAX, SPIN_MAX);
      setRange(INPUT_MIN, SPIN_MIN);
   }

   window.addEventListener('resize', () => {
      getProperties();
      MIN1024.matches && closeFilterMobile();
   })

   // открывает вкладки фильтра
   document.addEventListener('click', (event) => {
      if (event.target.closest('.js-filter-open')) {
         openFilterCategory(event.target.closest('.js-filter-open'))
      }
      // открывает фильтр в mobile
      if (event.target.closest('.filter__open') && !MIN1024.matches) {
         openFilterMobile()
      }
      // закрывает фильтр в mobile
      if (event.target.closest('.filter__close') && !MIN1024.matches) {
         closeFilterMobile()
      }
   })

   function openFilterMobile() {
      document.querySelector('.filter').classList.add('filter-open');
      document.body.classList.add('body-overflow');
   }

   function closeFilterMobile() {
      document.querySelector('.filter').classList.remove('filter-open');
      document.body.classList.remove('body-overflow');
   }

   function openFilterCategory(element) {
      const parent = element.closest('.js-filter-category');
      parent.classList.toggle('js-category-open');
      if (parent.classList.contains('js-category-open')) {
         setTimeout(() => { parent.querySelector('.js-filter__block').style.overflowY = "auto" }, 300)
      } else {
         parent.querySelector('.js-filter__block').style.overflowY = "";
      }
   }
}    

/* открывает, закрывает модальные окна. */
/*
добавить классы
js-modal-hidden - родительский контейнер модального окна который скрывается и показывается, задать стили скрытия
js-modal-visible - задать стили открытия
js-modal-close - кнопка закрытия модального окна находится внутри js-modal-hidde
кнопка открытия, любая:
js-modal-open - кнопка открытия модального окна
data-modal_open="id" - id модального окна
если надо что бы окно закрывалось при клике на пустое место (фон), добавляется атрибут js-modal-stop-close.
js-modal-stop-close - атрибут указывает на поле, при клике на которое не должно происходить закрытие окна, 
т.е. контейнер контента, при этом внешний родительский контейнет помечается атрибутом js-modal-close.
допускается дополнительно кнопка закрытия внутри js-modal-stop-close.
*/
document.addEventListener('click', (event) => {
   if (event.target.closest('.js-modal-open')) { openModal(event) }
   if (event.target.closest('.js-modal-close')) { testModalStopClose(event) }
})
function openModal(event) {
   let modalElement = event.target.closest('.js-modal-open').dataset.modal_open;
   if (typeof modalElement !== "undefined" && document.querySelector(`#${modalElement}`)) {
      document.querySelector(`#${modalElement}`).classList.add('js-modal-visible');
      document.body.classList.add('body-overflow')
   }
}
function testModalStopClose(event) {
   if (event.target.closest('.js-modal-stop-close') &&
      event.target.closest('.js-modal-close') !==
      event.target.closest('.js-modal-stop-close').querySelector('.js-modal-close')) {
      return
   }
   closeModal(event);
}
function closeModal(event) {
   event.target.closest('.js-modal-hidden').classList.remove('js-modal-visible');
   if (!document.querySelector('.js-modal-visible')) {
      document.body.classList.remove('body-overflow');
   }
}
// табы с выбором опции
class TabsOpen {
   constructor(options) {
      this.pc = document.body.classList.contains('_pc'); // true если dasktop, иначе false. Работает в связке с isMobile
      this.parentTabs = document.querySelector(options.name);
      this.tabsList = this.parentTabs.querySelectorAll('.js-tab-body');
      this.hover = options.hover == false ? false : true; // реакция табов на hover
      this.closeAllTabs = options.closeAllTabs == true ? true : false; // закрывать все табы
      this.closeClickContent = options.closeClickContent == true ? true : false; // закрыть при клике в области контента таба
      this.externalFunction = options.externalFunction; // внешняя функция для события click
      this.externalFunctionResize = options.externalFunctionResize; // внешняя функция для события resize
   }
   init = () => {
      document.body.addEventListener('click', this.examinationClick);
      this.hover && this.pc && document.body.addEventListener('mouseover', this.examinationHover);
      this.resize();
   };
   examinationClick = (event) => {
      this.externalFunction && this.externalFunction(event,);
      if (this.hover && this.pc) return;
      let eventElement = this.closeClickContent ? event.target.closest('.js-tab-body') : event.target.closest('.js-tab-button');
      if (eventElement && event.target.closest('.js-tab-body').classList.contains('active')) {
         this.close(event.target.closest('.js-tab-body'));
         return;
      }
      if (eventElement && !this.closeAllTabs) {
         this.open(event.target.closest('.js-tab-body'));
         return;
      }
      if (eventElement) {
         this.tabsList.forEach((element) => {
            element == event.target.closest('.js-tab-body') ? this.open(element) : this.close(element);
         });
         return;
      }
      if (!event.target.closest('.js-tab-content') && this.closeAllTabs) {
         this.tabsList.forEach(element => this.close(element));
      }
   }
   examinationHover = (event) => {
      if (event.target.closest('.js-tab-body')) {
         this.tabsList.forEach((element) => {
            element == event.target.closest('.js-tab-body') ? this.open(element) : this.close(element);
         });
      } else {
         this.tabsList.forEach(element => this.close(element));
      }
   }
   open = (element) => {
      element.querySelector('.js-tab-content').style.height = this.getSize(element) + 'px';
      element.classList.add('active');
   };
   close = (element) => {
      element.querySelector('.js-tab-content').style.height = '';
      element.classList.remove('active');
   };
   adjustment = () => {
      this.tabsList.forEach((e) => e.classList.contains('active') && this.open(e));
      this.externalFunctionResize && this.externalFunctionResize()
   };
   getSize = (element) => { return element.querySelector('.js-tab-content-inner').clientHeight };
   resize = () => window.addEventListener('resize', this.adjustment);
}

if (document.querySelector('.sort')) {
   let tebSort = new TabsOpen({
      name: '.sort',
      hover: true,
      closeAllTabs: true,
      closeClickContent: true,
      externalFunction: showSelection
   }).init();
}

/* Подменя текста, показать выбранный вариант */
const BUTTON_TEXT = document.getElementById('sort-button-text');
function showSelection(event) {
   if (event.target.closest('.js-sort-value')) {
      BUTTON_TEXT.innerHTML = event.target.closest('.js-sort-value span').innerHTML;
   }
}
class TabsSwitching {
   constructor(body__buttons, button, tab, execute) {
      this.name_button = button;
      this.body__buttons = document.querySelector(body__buttons);
      this.button = document.querySelectorAll(button);
      this.tab = document.querySelectorAll(tab);
      this.execute = execute;
   }
   init = () => {
      this.body__buttons.addEventListener('click', (event) => {
         if (event.target.closest(this.name_button)) {
            let n = event.target.closest(this.name_button).dataset.button;
            this.button.forEach((e) => { e.classList.toggle('active', e.dataset.button == n) });
            if (this.tab.length > 0) { this.tab.forEach((e) => { e.classList.toggle('active', e.dataset.tab == n) }) }
            if (this.execute) { this.execute() };
         }
      })
   }
}

if (document.querySelector('.js-product-tabs')) {
   new TabsSwitching('.js-product-tabs', '.js-product-button', '.js-product-tab').init();
}

if (document.querySelector('.js-transfer-tabs')) {
   new TabsSwitching('.js-transfer-tabs', '.js-transfer-button', '.js-transfer-tab').init();
}

if (document.querySelector('.js-method')) {
   new TabsSwitching('.js-method', '.js-method-button', '.js-method-tab').init();
}