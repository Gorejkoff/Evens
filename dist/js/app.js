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
let functionView = viewBlock;
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
   if (scrollY > headerHeight && MIN768.matches) {
      moveListMenu();
   } else {
      resetMoveListMenu();
      if (document.querySelector('.js-index') && MIN768.matches) closeCatalogNav();
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
   } else if (!MIN768.matches && !event.target.closest('.menu-mobile__container') && !event.target.closest('#catalog_nav_wrapper')) {
      closeMenuMobile();
   }
   /* открывает catalog-nav */
   if (event.target.closest('.js-open-catalog-nav') || (MIN768.matches && event.target.closest('#burger'))) {
      openCatalogNav();
   } else if (MIN768.matches && !event.target.closest('.js-catalog-nav-body') && !event.target.closest('#catalog_nav_wrapper')) {
      closeCatalogNav();
   }

   // открывает поле поиска в меню после скролла и мобилка
   if (event.target.closest('.button-search-open')) {
      HEADER_NAV.classList.add('open-search')
   } else if (!event.target.closest('.header-nav__search') && !event.target.closest('.search-result')) {
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
      viewButtonGrid();
      functionView = viewGrid;
      MIN768.matches && functionView();
   };
   if (VIEW && event.target.closest('.js-view-block')) {
      viewButtonBlock();
      functionView = viewBlock;
      MIN768.matches && functionView();
   };
   if (event.target.closest('.sort__apply')) {
      functionView();
   }
   // отмена перехода по ссылке
   if (event.target.closest('.card .button__compare') ||
      event.target.closest('.card .button__favourites') ||
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
function viewButtonBlock() {
   document.querySelector('.js-view-grid').classList.remove('active');
   document.querySelector('.js-view-block').classList.add('active');
}
function viewBlock() {
   document.querySelector('.js-change-view').classList.remove('view-grid');
   document.querySelector('.js-change-view').classList.add('view-block');
}
function viewButtonGrid() {
   document.querySelector('.js-view-block').classList.remove('active');
   document.querySelector('.js-view-grid').classList.add('active');
}
function viewGrid() {
   document.querySelector('.js-change-view').classList.remove('view-block');
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
   document.querySelectorAll('.catalog-nav-wrapper.open').forEach((e => { e.classList.remove('open') }))
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



const ACCOUND_FORM_ELEMENT = document.querySelector('.accound__form');
const ACCOUND_FORM = document.forms.personal_data;
console.log(ACCOUND_FORM);
function accessForm(boolean) {
   for (let f of ACCOUND_FORM) { f.disabled = boolean };
   if (!boolean) {
      document.querySelector('.accound__data-button').style.display = "block";
      ACCOUND_FORM[0].focus();
      ACCOUND_FORM_ELEMENT.classList.add('active');
   }
   if (boolean) document.querySelector('.accound__data-button').style.display = "";
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
         if (listChildren[z].dataset.n > e.dataset.n) {
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
   if (e.classList.contains(n.slice(1))) { return e }
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

// вариант открытия с ховером на ПК
/* if (isPC) {
   document.addEventListener('mouseover', (event) => { runTabCatalogNav(event) })
} else {
   document.addEventListener('click', (event) => { runTabCatalogNav(event) })
} */
// вариант открытия только кликом
document.addEventListener('click', (event) => { runTabCatalogNav(event) })

function runTabCatalogNav(event) {
   if (event.target.closest('.js-catalog-nav-button')) {
      openTabCatalogNav(event);
   } else if (!event.target.closest('.js-catalog-nav-body')) {
      closeTabCatalogNav();
   }
}

function closeTabCatalogNav() {
   CATALOG_CONTENT.forEach((e) => {
      e.classList.remove('open');
   })
}

function openTabCatalogNav(event) {
   const number = event.target.closest('.js-catalog-nav-button').dataset.number;
   CATALOG_CONTENT.forEach((e) => {
      if (!e.classList.contains('open') && e.dataset.number == number) {
         e.classList.add('open');
      } else {
         e.classList.remove('open');
      }
   })
}
const COMPARE_BODY = document.querySelector('.compare__body');
const COMPARE_CARD = document.querySelector('.compare__card');
const COMPARE_HEADER = document.querySelector('.compare__description-header');
const COMPARE_VALUE = document.querySelectorAll('.compare__description-value');
const IMITATION_SCROLLBAR_CARD = document.getElementById('scroll-card');
const IMITATION_SCROLLBAR_VALUE = document.getElementById('scroll-value');

if (COMPARE_BODY && COMPARE_CARD && COMPARE_VALUE.length > 0) {
   let reverse = false;
   let mouseX;
   let mouseStartX;
   let mouseDown = false;
   let startPosition;

   COMPARE_BODY.ondragstart = function () { return false };

   isPC && COMPARE_BODY.addEventListener('mousedown', startScroll);
   isPC && COMPARE_BODY.addEventListener('mousemove', mouseMove);
   isPC && document.addEventListener('mouseup', stoptScroll);
   !isPC && COMPARE_BODY.addEventListener('touchstart', startScroll);
   !isPC && COMPARE_BODY.addEventListener('touchmove', mouseMove);
   !isPC && document.addEventListener('touchend', stoptScroll);

   function mouseMove(event) {
      if (mouseDown || !isPC) {
         isPC ? mouseX = event.clientX : mouseX = event.changedTouches[0].clientX;
         let offset = calcOffset();
         COMPARE_CARD.scrollTo(calcPath(COMPARE_CARD) * offset, 0);
         COMPARE_VALUE.forEach((e) => { e.scrollTo(calcPath(e) * offset, 0) });
         COMPARE_HEADER.scrollTo(calcPath(COMPARE_HEADER) * offset, 0);
         IMITATION_SCROLLBAR_CARD.style.setProperty('--offset-scroll', calcPathScrollBar(IMITATION_SCROLLBAR_CARD) * offset + 'px');
         IMITATION_SCROLLBAR_VALUE.style.setProperty('--offset-scroll', calcPathScrollBar(IMITATION_SCROLLBAR_VALUE) * offset + 'px');
      }
   };

   function startScroll(event) {
      event.target.closest('.imitation-scrollbar') ? reverse = true : reverse = false;
      mouseDown = true;

      isPC ? mouseStartX = event.clientX : mouseStartX = event.changedTouches[0].clientX;
      startPosition = COMPARE_VALUE[0].scrollLeft;
   }

   function scrollBarHidden(element) {
      if (calcPath(element) <= 0) {
         IMITATION_SCROLLBAR_CARD.style.display = "none";
         IMITATION_SCROLLBAR_VALUE.style.display = "none";
      } else {
         IMITATION_SCROLLBAR_CARD.style.display = "";
         IMITATION_SCROLLBAR_VALUE.style.display = "";
      }
   }

   function stoptScroll() { mouseDown = false };

   function calcOffset() {
      let x;
      if (reverse) {
         x = (startPosition + mouseX - mouseStartX) / calcPath(COMPARE_VALUE[0]);
      } else {
         x = (startPosition + mouseStartX - mouseX) / calcPath(COMPARE_VALUE[0]);
      }
      if (x > 1) { x = 1 } else if (x < 0) { x = 0 };
      return x;
   };

   function calcPath(e) { return e.scrollWidth - e.clientWidth };

   function setWidthScrollThumb(element, scrollBlock) {
      let widthThumb = Math.pow(scrollBlock.clientWidth, 2) / scrollBlock.scrollWidth;
      element.style.setProperty('--width-scroll', widthThumb + 'px');
   }
   function calcPathScrollBar(element) {
      return element.scrollWidth - element.querySelector('span').scrollWidth;
   }

   function initScroll() {
      setWidthScrollThumb(IMITATION_SCROLLBAR_CARD, COMPARE_CARD);
      setWidthScrollThumb(IMITATION_SCROLLBAR_VALUE, COMPARE_VALUE[0]);
      scrollBarHidden(COMPARE_CARD);
   }
   initScroll();
   window.addEventListener('resize', () => { initScroll() })
}
if (document.querySelector('.filter')) {
   if (document.querySelector('.filter__price-inputs')) {
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
   }
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
      if (!parent.querySelector('.js-filter__block')) return;
      if (parent.classList.contains('js-category-open')) {
         setTimeout(() => { parent.querySelector('.js-filter__block').style.overflowY = "auto" }, 300)
      } else {
         parent.querySelector('.js-filter__block').style.overflowY = "";
      }
   }
}    

if (document.getElementById('contacts-map')) {
   ymaps.ready(init);
   function init() {
      var myMap = new ymaps.Map("contacts-map", {
         center: [55.844334, 37.383633],
         controls: [],
         zoom: 17
      });
      var myPlacemark = new ymaps.Placemark([55.844334, 37.383633], {}, {
         iconLayout: 'default#imageWithContent',
         iconImageHref: './img/svg/icon_point.svg',
         iconImageSize: [60, 73],
         iconImageOffset: [-30, -73]
      });
      myMap.geoObjects.add(myPlacemark);
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
// открывает окно найденного в поиске (для примера)
const SEARCH_INPUT = document.querySelector('#search-nav');
const SEARCH_RESULT = document.querySelector('.search-result');
SEARCH_INPUT.addEventListener('focus', () => SEARCH_RESULT.style.display = "block");
document.addEventListener('click', (event) => {
   if (!event.target.closest('.search-result') && !event.target.closest('#search-nav')) {
      SEARCH_RESULT.style.display = "none"
   }
})
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
      this.externalFunction && this.externalFunction(event);
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
         this.closeAll();
      }
   }
   examinationHover = (event) => {
      if (event.target.closest('.js-tab-body')) {
         this.tabsList.forEach((element) => {
            element == event.target.closest('.js-tab-body') ? this.open(element) : this.close(element);
         });
      } else {
         this.closeAll();
      }
   }
   open = (element) => {
      if (element.querySelector('.js-tab-content')) {
         element.querySelector('.js-tab-content').style.height = this.getSize(element) + 'px';
         element.classList.add('active');
      }
   };
   close = (element) => {
      if (element.querySelector('.js-tab-content')) {
         element.querySelector('.js-tab-content').style.height = '';
         element.classList.remove('active');
      }
   };
   closeAll = () => { this.tabsList.forEach(element => this.close(element)); }
   adjustment = () => {
      this.tabsList.forEach((e) => e.classList.contains('active') && this.open(e));
      this.externalFunctionResize && this.externalFunctionResize()
   };
   getSize = (element) => { return element.querySelector('.js-tab-content-inner').clientHeight };
   resize = () => window.addEventListener('resize', this.adjustment);
}

/* Подменя текста, показать выбранный вариант */
const BUTTON_TEXT = document.getElementById('sort-button-text');
function showSelection(event) {
   if (event.target.closest('.js-sort-value')) {
      BUTTON_TEXT.innerHTML = event.target.closest('.js-sort-value').querySelector('.sort__value-text').innerHTML;
   }
   if (event.target.closest('.sort__tab-header .button-close') || event.target.closest('.sort__apply')) {
      this.closeAll();
   }
}

if (document.querySelector('.js-sort')) {
   let sortTab = new TabsOpen({
      name: '.js-sort',
      hover: true,
      closeAllTabs: true,
      closeClickContent: false,
      externalFunction: showSelection
   }).init();
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

if (document.querySelector('.js-orders-tabs')) {
   new TabsSwitching('.js-orders-tabs', '.js-orders-button', '.js-orders-tab').init();
}