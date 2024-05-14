const SEARCH_INPUT = document.querySelector('#search-nav');
const SEARCH_RESULT = document.querySelector('.search-result');
SEARCH_INPUT.addEventListener('focus', () => SEARCH_RESULT.style.display = "block");
