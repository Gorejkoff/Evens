// открывает окно найденного в поиске (для примера)
const SEARCH_INPUT = document.querySelector('#search-nav');
const SEARCH_RESULT = document.querySelector('.search-result');
SEARCH_INPUT.addEventListener('focus', () => SEARCH_RESULT.style.display = "block");
document.addEventListener('click', (event) => {
   if (!event.target.closest('.search-result') && !event.target.closest('#search-nav')) {
      SEARCH_RESULT.style.display = "none"
   }
})