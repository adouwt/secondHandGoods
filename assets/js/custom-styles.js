$(function(){
	//注册时么有选中同意按钮，不给点击
	$(".regist_checked").change(function(){
    	$(this).parents(".checkbox").next("button").toggleClass("disabled");
	});

	$("#goods-submit").click(function() {

		//发布商品表单内容
		var userGoodsSort    		= $("#user-goods-sort").val();
		var userGoodsName    		= $("#user-goods-name").val();
		var userGoodsUseTime 		= $("#user-goods-usetime").val();
		var userGoodsaddText 		= $("#user-goods-addText").val();
		var userChangeTar   		= $("#user-change-target").val();
		var userName   				= $("#user-name").val();
		var userPhone      			= $("#user-phone").val();
		var username       			= $("#username").val();
		var userGoodsPrice          = $("#user-goods-price").val();

		$.post("/goodsSubmit",{
			"username" 				: username,
			"userGoodsSort" 		: userGoodsSort,
			"userGoodsPrice" 		: userGoodsPrice,
			"userGoodsName" 		: userGoodsName,
			"userGoodsUseTime"   	: userGoodsUseTime,
			"userGoodsaddText"   	: userGoodsaddText,
			"userChangeTar" 		: userChangeTar,
			"userName" 				: userName,
			"userPhone" 			: userPhone,
		},function(result) {
			if(result=="1"){
				$(".right_board_categories_sort").html(userGoodsSort);
				$(".right_board_categories_name").html(userGoodsName);
				$(".right_board_categories_target").html(userChangeTar);
				$(".right_board_categories_price").html(userGoodsPrice);
				$(".right_board_categories_usetime").html(userGoodsUseTime);
				$(".right_board_categories_people").html(userGoodsSort);
				$(".right_board_categories_tel").html(userPhone);
				$(".product_details_addText").html(userGoodsaddText);
			}
			
			setTimeout(function () {
				window.location = "/";
			},3000);

			alert("1s后，跳回主主页，查看你发布的宝贝");
			//前几个事预览数据，登录后可查看所有
		})
	})









})

