let totalData; //총 데이터 수
let dataPerPage; //한 페이지에 나타낼 글 수
let pageCount = 2; //페이징에 나타낼 페이지 수
let globalCurrentPage = 1; //현재 페이지
let source = null;




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

  totalPage = Math.ceil(totalData / dataPerPage); //총 페이지 수

  if (totalPage < pageCount) {
    pageCount = totalPage;
  }

  let pageGroup = Math.ceil(currentPage / pageCount); // 페이지 그룹
  let last = pageGroup * pageCount; //화면에 보여질 마지막 페이지 번호

  if (last > totalPage) {
    last = totalPage;
  }

  let first = last - (pageCount - 1); //화면에 보여질 첫번째 페이지 번호
  let next = last + 1;
  let prev = first - 1;

  let pageHtml = "";

  if (prev > 0) {
    pageHtml += "<li onclick='fnMove('#tbl_wrap')'><a  id='prev'> 이전 </a></li>";
  }

  //페이징 번호 표시 
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


  //페이징 번호 클릭 이벤트 
  $("#pagingul li a").click(function () {
    let $id = $(this).attr("id");
    selectedPage = $(this).text();

    if ($id == "next") selectedPage = next;
    if ($id == "prev") selectedPage = prev;

    //전역변수에 선택한 페이지 번호를 담는다...
    globalCurrentPage = selectedPage;
    //페이징 표시 재호출
    paging(totalData, dataPerPage, pageCount, selectedPage);
    //글 목록 표시 재호출
    displayData(selectedPage, dataPerPage);
  });
}


//현재 페이지(currentPage)와 페이지당 글 개수(dataPerPage) 반영
function displayData(currentPage, dataPerPage) {

  let chartHtml = "";

  //Number로 변환하지 않으면 아래에서 +를 할 경우 스트링 결합이 되어버림.. 
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
  } //dataList는 임의의 데이터임.. 각 소스에 맞게 변수를 넣어주면 됨...
  $("#dataTableBody").html(chartHtml);
}


function getLocation(lat, lng) {

  navigator.geolocation.getCurrentPosition(function (pos) {
    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;
    lat = latitude;
    lng = longitude;

  });

}



$(function () {

  

  let selector = 1;
  menuSelect(1);

  dataPerPage = $("#dataPerPage").val();


  $('#menu_bar_selector2').click(function () {



    //	위도: 34.6936, 경도: 135.502
    //lat=34.67&lng=135.52
    $.ajax({
      url: 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=ed29f000ddf09f94&lat=34.67&lng=135.52&range=5&order=4&format=jsonp&callback=callback',
      type: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).done(function (data) {

      source = data.results.shop;

      //----paging---------------
      totalData = source.length;
      console.log(totalData);

      //글 목록 표시 호출 (테이블 생성)
      displayData(1, dataPerPage);

      //페이징 표시 호출
      paging(totalData, dataPerPage, pageCount, 1);







      console.log(source);



    }).fail(function (data) {
      console.log("error");
    });

  });


  $('#btn_search').click(function () {



    //	위도: 34.6936, 경도: 135.502
    //lat=34.67&lng=135.52
    $.ajax({
      url: 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=ed29f000ddf09f94&lat=34.67&lng=135.52&range=5&order=4&format=jsonp&callback=callback',
      type: 'GET',
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).done(function (data) {

      source = data.results.shop;

      //----paging---------------
      totalData = source.length;
      console.log(totalData);

      //글 목록 표시 호출 (테이블 생성)
      displayData(1, dataPerPage);

      //페이징 표시 호출
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


  $("window").scroll(function(){
    $("#select_wrap").css('color',red);
  });



  $("#dataPerPage").change(function () {
    dataPerPage = $("#dataPerPage").val();
    //전역 변수에 담긴 globalCurrent 값을 이용하여 페이지 이동없이 글 표시개수 변경 
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

