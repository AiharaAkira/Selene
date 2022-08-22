// Hide Header on on scroll down



$(document).ready(function () {
	$(".btn_menu_open").click(function () {
		$("#mask").fadeIn(100);
		$(".slide_menu").show().animate({ right: "0" });
	});
	$("#mask, .btn_menu_close").click(function () {
		$("#mask").fadeOut(100);
		$(".slide_menu").hide().animate({ right: "0" });
	});
});
