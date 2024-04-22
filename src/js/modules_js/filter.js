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
