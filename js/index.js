let totalData; //全データの数
let dataPerPage; //一ページに表す掲示物
let pageCount = 2; //一ページに表すページの数
let globalCurrentPage = 1; //現在のページ
let source = null;
let mode = 1;



function modeChange(){
  if(mode == 1){
    $("#dark_img").attr("src", "img/moon.png");
    $("body").css("background-color","#1e1f21");
    $(".tbl_name").css("color", "rgb(204, 210, 210)");
    mode = 2;
  }else if(mode ==2){
    $("#dark_img").attr("src", "img/sun.png");
    $("body").css("background-color","rgb(204, 210, 210)");
    $(".tbl_name").css("color", "black");
    mode = 1;
  }
}

var last_scrollTop = 0;
 
    $(window).scroll(function () {
        var tmp = $(this).scrollTop();
        if (tmp > last_scrollTop) {
            $("#select_wrap").css('visibility','hidden');
            $("#select_call").css('visibility','visible');
        } else {
          $("#select_wrap").css('visibility','hidden');
          $("#select_call").css('visibility','visible');
        }
        last_scrollTop = tmp;
    });


function menuSelect(selector) {
  $("#menu_bar_selector" + selector).css("color", "black");
}
function menuUnSelect(selector) {
  $("#menu_bar_selector" + selector).css("color", "darkgray");
}

function setVisible(a){
  if( a.length > 0 ){
      var stdPos = $(window).scrollTop() + $(window).height() - ($(window).height() / 3);
      if( stdPos >  a.offset().top ){
          a.addClass('on');
      }
  }
}



  







function paging(totalData, dataPerPage, pageCount, currentPage) {
  console.log("currentPage : " + currentPage);

  totalPage = Math.ceil(totalData / dataPerPage); //全データの数

  if (totalPage < pageCount) {
    pageCount = totalPage;
  }

  let pageGroup = Math.ceil(currentPage / pageCount); // ページグループ
  let last = pageGroup * pageCount; //画面に見せる最後のページの番号

  if (last > totalPage) {
    last = totalPage;
  }

  let first = last - (pageCount - 1); //画面に見せる最初のページの番号
  let next = last + 1;
  let prev = first - 1;

  let pageHtml = "";

  if (prev > 0) {
    pageHtml += "<li onclick='fnMove('#tbl_wrap')'><a  id='prev'> 이전 </a></li>";
  }

  //ページの番号
  for (var i = first; i <= last; i++) {
    if (currentPage == i) {
      pageHtml +=
        "<li onclick='fnMove('#tbl_wrap')' class='on'><a  id='" + i + "'>" + i + "</a></li>";
    } else {
      pageHtml += "<li onclick='fnMove('#tbl_wrap')'><a  id='" + i + "'>" + i + "</a></li>";
    }
  }

  if (last < totalPage) {
    pageHtml += "<li  onclick='fnMove('#tbl_wrap')'><a  id='next'> 다음 </a></li>";
  }

  $("#pagingul").html(pageHtml);
  let displayCount = "";
  displayCount = "현재 1 - " + totalPage + " 페이지 / " + totalData + "건";
  $("#displayCount").text(displayCount);


  //ページ番号クリックイベント
  $("#pagingul li a").click(function () {
    let $id = $(this).attr("id");
    selectedPage = $(this).text();

    if ($id == "next") selectedPage = next;
    if ($id == "prev") selectedPage = prev;

    //選んだページ番号
    globalCurrentPage = selectedPage;
    //ページ表示 また呼ぶ
    paging(totalData, dataPerPage, pageCount, selectedPage);
    //掲示物 表示 また呼ぶ
    displayData(selectedPage, dataPerPage);
  });
}


//現在ページ(currentPage)とページごとを掲示物(dataPerPage)反映
function displayData(currentPage, dataPerPage) {

  let chartHtml = "";

  //Numberに変換しないと 下で +する場合 文字(String)になる.. 
  currentPage = Number(currentPage);
  dataPerPage = Number(dataPerPage);

  for (
    var i = (currentPage - 1) * dataPerPage;
    i < (currentPage - 1) * dataPerPage + dataPerPage;
    i++
  ) {

    chartHtml +=
      "<div class='data_tbl'><div><div  class='logo' id ='logo" + i + "'>" +
      "<img src='" + source[i].photo.pc.l + "'>" +
      "</div></div>" +
      "<div><div class='tbl_name' id ='name" + i + "'>" +
      source[i].name +
      "</div></div><div><div class='tbl_access' class='tbl_access'>" +
      source[i].access +
      "</div></div></div>";

    $("#name" + i).click(function () {

      console.log('성공');

    });
  } 
  $("#dataTableBody").html(chartHtml);
}



function getLocation(lat, lng) {
  
 
  navigator.geolocation.getCurrentPosition(function (pos) {
  var latitude = pos.coords.latitude;
   var longitude = pos.coords.longitude;
    lat = latitude;
    lng = longitude;
    console.log(lat);
    console.log(lng);
    return lat, lng;
   
  });

}






$(function () {

  

  let lat;
  let lng;
  getLocation(lat, lng);


  console.log(lat);
  console.log(lng);
  let selector = 1;
  menuSelect(1);

  dataPerPage = $("#dataPerPage").val();


  $('#menu_bar_selector2').click(function () {



    
    //example)  lat=34.67&lng=135.52
    $.ajax({
      url: 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=ed29f000ddf09f94&lat='+lat+'&lng='+lng+'&range=5&order=4&format=jsonp&callback=callback',
      type: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).done(function (data) {

      source = data.results.shop;

      //----paging---------------
      totalData = source.length;
      console.log(totalData);

      //目録を呼ぶ (テーブル生成)
      displayData(1, dataPerPage);

      //ページを呼ぶ
      paging(totalData, dataPerPage, pageCount, 1);







      console.log(source);
     


    }).fail(function (data) {
      console.log("error");
    });

  });

  $('#select_call_img').click(function(){
    
    $("#select_call").css('visibility','hidden');
    $("#select_wrap").css('visibility','visible');

  });


  $('#btn_search').click(function () {



   
    //lat=34.67&lng=135.52
    $.ajax({
      url: 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=ed29f000ddf09f94&lat=34.6936&lng=135.52&range=5&order=4&format=jsonp&callback=callback',
      type: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).done(function (data) {

      source = data.results.shop;

      //----paging---------------
      totalData = source.length;
      console.log(totalData);

      //目録を呼ぶ (テーブル生成)
      displayData(1, dataPerPage);

      //ページを呼ぶ
      paging(totalData, dataPerPage, pageCount, 1);







      console.log(source);



    }).fail(function (data) {
      console.log("error");
    });

  });



 
    




  $("#dataTableBody").unbind().on('mouseover',function () {

    
    $.each(source, function (i, shop) {
    $("#name" + i).unbind().on('click',function () {

        $("#dataTableBody_deatil").empty();
        $("#dataTableBody_deatil").append("<div class='detail_tbl detail_td'><div id='img_det" + i + "'></div></div>");
        $('#img_det' + i).append("<img src='" + shop.photo.pc.l + "'>");
        $("#dataTableBody_deatil").append("<div class='detail_tbl detail_td_name'><div  id='name_det" + i + "'></div>");
        $('#name_det' + i).text(shop.name);
        $("#dataTableBody_deatil").append("<div class='detail_td' id='address_det" + i + "'></div>");
        $('#address_det' + i).text(shop.address);
        $("#dataTableBody_deatil").append("<div class='open_det detail_td' id='open_det" + i + "'></div>");
        $('#open_det' + i).text(shop.open);
        $('.selene_guide').empty();
        $('#map-container').css("visibility", "visible");







        let map;

        const uluru = { lat: shop.lat, lng: shop.lng };

        function initMap(){


          map = new google.maps.Map(document.getElementById("map"), {
            center: uluru,
            zoom: 16,
          });
          
          const marker = new google.maps.Marker({
            position: uluru,
            map: map,
          });

        }

        


        window.initMap = initMap();



      });

      $("#logo" + i).unbind().click(function () {
        $("#dataTableBody_deatil").empty();
        $("#dataTableBody_deatil").append("<div class='detail_tbl'><div id='img_det" + i + "'></div></div>");
        $('#img_det' + i).append("<img src='" + shop.photo.pc.l + "'>");
        $("#dataTableBody_deatil").append("<div class='detail_tbl detail_td_name'><div id='name_det'></div>");
        $('#name_det').text(shop.name);
        $("#dataTableBody_deatil").append("<div class='detail_td' id='address_det" + i + "'></div>");
        $('#address_det' + i).text(shop.address);
        $("#dataTableBody_deatil").append("<div class='open_det detail_td' id='open_det" + i + "'></div>");
        $('#open_det' + i).text(shop.open);
        $('.selene_guide').empty();
        $('#map-container').css("visibility", "visible");

        let map;

        const uluru = { lat: shop.lat, lng: shop.lng };

        function initMap(){


          map = new google.maps.Map(document.getElementById("map"), {
            center: uluru,
            zoom: 16,
          });

        }

      


        const marker = new google.maps.Marker({
          position: uluru,
          map: map,
        });

        window.initMap = initMap();

      });


    });
  });






  $("#dataPerPage").change(function () {
    dataPerPage = $("#dataPerPage").val();
    // globalCurrent をりようして ページ 移動なしで 掲示物の数変更 
    paging(totalData, dataPerPage, pageCount, globalCurrentPage);
    displayData(globalCurrentPage, dataPerPage);
  });




  $("#dataTableBody").click(function () {
    var offset = $('#detail_wrap').offset();
    $('html, body').animate({ scrollTop: offset.top }, 400);
  });




  $("#menu_bar_selector1").click(function () {
    selector = 1;
    menuSelect(1);
    menuUnSelect(2);
    menuUnSelect(3);
    menuUnSelect(4);

    var offset = $('#first_wrap').offset();
    $('html, body').animate({ scrollTop: offset.top }, 400);




  });

  $("#menu_bar_selector2").click(function () {
    selector = 2;
    menuSelect(2);
    menuUnSelect(1);
    menuUnSelect(3);
    menuUnSelect(4);

    var offset = $('#tbl_wrap').offset();
    $('html, body').animate({ scrollTop: offset.top }, 400);




  });



  $("#menu_bar_selector3").click(function () {
    selector = 3;
    menuSelect(3);
    menuUnSelect(1);
    menuUnSelect(2);
    menuUnSelect(4);

    var offset = $('#detail_wrap').offset();
    $('html, body').animate({ scrollTop: offset.top }, 400);




  });

  $("#menu_bar_selector4").click(function () {
    selector = 4;
    menuSelect(4);
    menuUnSelect(2);
    menuUnSelect(3);
    menuUnSelect(1);

    var offset = $('#map').offset();
    $('html, body').animate({ scrollTop: offset.top }, 400);




  });

  $("#dark_btn").click(function(){
    modeChange();
  });

  $("#detail_back_img").click(function () {
    selector = 2;
    menuSelect(2);
    menuUnSelect(1);
    menuUnSelect(3);
    menuUnSelect(4);

    var offset = $('#tbl_wrap').offset();
    $('html, body').animate({ scrollTop: offset.top }, 400);


  });

  



});

