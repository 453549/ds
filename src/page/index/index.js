require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('util/swiper/swiper-4.3.3.min.css');
var swiper = require('util/swiper/swiper-4.3.3.min');
var _mm = require('util/mm.js');
var templateIndex = require('./swiper.string');
// $(function(){
  $(document).ready(function () {
    //渲染轮播图
    var Swiperhtml = _mm.renderHtml(templateIndex);
    $('.swiper-container').html(Swiperhtml);
    //启动轮播图
    var mySwiper = new swiper('.swiper-container',{
       loop : true, //循环
       pagination: { //分页的点
          el: '.swiper-pagination'
       },
       // autoplay:true, //自动切换
       navigation: { //点击左右键切换
         nextEl: '.swiper-button-next',
         prevEl: '.swiper-button-prev',
       }
    });
  });
// })
