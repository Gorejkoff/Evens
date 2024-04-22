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