let totalData; //총 데이터 수
let dataPerPage; //한 페이지에 나타낼 글 수
let pageCount = 2; //페이징에 나타낼 페이지 수
let globalCurrentPage=1; //현재 페이지
let source = null;

function paging(totalData, dataPerPage, pageCount, currentPage) {
    console.log("currentPage : " + currentPage);
  
    totalPage = Math.ceil(totalData / dataPerPage); //총 페이지 수
    
    if(totalPage<pageCount){
      pageCount=totalPage;
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
      pageHtml += "<li><a href='#' id='prev'> 이전 </a></li>";
    }
  
   //페이징 번호 표시 
    for (var i = first; i <= last; i++) {
      if (currentPage == i) {
        pageHtml +=
          "<li class='on'><a href='#' id='" + i + "'>" + i + "</a></li>";
      } else {
        pageHtml += "<li><a href='#' id='" + i + "'>" + i + "</a></li>";
      }
    }
  
    if (last < totalPage) {
      pageHtml += "<li><a href='#' id='next'> 다음 </a></li>";
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
        "<tr><td id ='name"+ i +"'>"+
        source[i].name +
        "</td><td>" +
        source[i].access +
        "</td><td id ='logo" +i+"'>"+
        "<img src='"+source[i].logo_image +"'>"+
        "</td></tr>";

        $("#name"+i).click(function(){

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

    

    dataPerPage = $("#dataPerPage").val();


    $('#btn_search').click(function () {
       
        

        

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

  $("#dataTableBody").click(function(){

    $.each(source, function(i, shop){

      $("#name"+i).click(function(){
        $("#dataTableBody_deatil").empty();
        $("#dataTableBody_deatil").append("<tr><td id='name_det" + i + "'></td></tr>");
        $('#name_det' + i).text(shop.name);
        $("#dataTableBody_deatil").append("<tr><td id='address_det" + i + "'></td></tr>");
        $('#address_det' + i).text(shop.address);
        $("#dataTableBody_deatil").append("<tr><td id='img_det" + i + "'></td></tr>");
        $('#img_det' + i).append("<img src='"+shop.photo.pc.m+"'>");
        $("#dataTableBody_deatil").append("<tr><td id='open_det" + i + "'></td></tr>");
        $('#open_det' + i).text(shop.open);
      });

      $("#logo"+i).click(function(){
        $("#dataTableBody_deatil").empty();
        $("#dataTableBody_deatil").append("<tr><td id='name_det" + i + "'></td></tr>");
        $('#name_det' + i).text(shop.name);
        $("#dataTableBody_deatil").append("<tr><td id='address_det" + i + "'></td></tr>");
        $('#address_det' + i).text(shop.address);
        $("#dataTableBody_deatil").append("<tr><td id='img_det" + i + "'></td></tr>");
        $('#img_det' + i).append("<img src='"+shop.photo.pc.m+"'>");
        $("#dataTableBody_deatil").append("<tr><td id='open_det" + i + "'></td></tr>");
        $('#open_det' + i).text(shop.open);
      });
      

    });
  });



    $("#dataPerPage").change(function () {
        dataPerPage = $("#dataPerPage").val();
        //전역 변수에 담긴 globalCurrent 값을 이용하여 페이지 이동없이 글 표시개수 변경 
        paging(totalData, dataPerPage, pageCount, globalCurrentPage);
        displayData(globalCurrentPage, dataPerPage);
     });



});

