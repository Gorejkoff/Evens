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
         iconImageHref: '../../img/svg/icon_point.svg',
         iconImageSize: [60, 73],
         iconImageOffset: [-30, -73]
      });
      myMap.geoObjects.add(myPlacemark);
   }
}