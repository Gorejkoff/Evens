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