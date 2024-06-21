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

if (document.querySelector('.js-sort')) {
   let tebSort = new TabsOpen({
      name: '.js-sort',
      hover: true,
      closeAllTabs: true,
      closeClickContent: false,
      externalFunction: showSelection
   }).init();
}

/* Подменя текста, показать выбранный вариант */
const BUTTON_TEXT = document.getElementById('sort-button-text');
function showSelection(event) {
   if (event.target.closest('.js-sort-value')) {
      BUTTON_TEXT.innerHTML = event.target.closest('.js-sort-value').querySelector('.sort__value-text').innerHTML;
   }
   if (event.target.closest('.sort__tab-header .button-close')) {
      this.closeAll();
   }
}


if (document.querySelector('.js-catalog-nav')) {
   let tebSort = new TabsOpen({
      name: '.js-catalog-nav',
      hover: true,
      closeAllTabs: false,
      closeClickContent: false,
   }).init();
}