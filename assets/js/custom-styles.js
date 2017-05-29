$(function(){

  //时间格式化

  function FormatDate (strTime) {
    var date = new Date(strTime);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate() + "-" +date.getHours() + "-" +date.getMinutes();
  }


	//注册时么有选中同意按钮，不给点击
	$(".regist_checked").change(function(){
    	$(this).parents(".checkbox").next("button").toggleClass("disabled");
	});

  //暂时每个页面的单独提交，看看以后有么有办法，同意提交，后台再做区分
  // 交换商品

	$("#exchangeGoods-submit").click(function() {

		// 获取图片的base64的代码
        //后端的formindable 无法接受数组，因此暂时分开数组 单个传输给后端
		var imgBase64    = $("#preview img");
		var imgBase64Arr = [];
		imgBase64.each(function (i) {
			imgBase64Arr.push($(this).attr("src"));
		})

		var userImgOne   = imgBase64Arr[0];
		var userImgTwo   = imgBase64Arr[1];
		var userImgThree = imgBase64Arr[2];
		var userImgFore  = imgBase64Arr[3];

    if(imgBase64Arr.length>=4) {
      
  		//发布商品表单内容
  		var userGoodsSort    		= $("#user-goods-sort").val();
  		var userGoodsName    		= $("#user-goods-name").val();
  		var userGoodsUseTime 		= $("#user-goods-usetime").val();
  		var userGoodsaddText 		= $("#user-goods-addText").val();
  		var userChangeTar   		= $("#user-change-target").val();
  		var userName   				  = $("#user-name").val();
  		var userPhone      			= $("#user-phone").val();
  		var username       			= $("#username").val();
      var userGoodsPrice      = $("#user-goods-price").val();
      var selectWay           = $("#user-selectway").val();

  		$.post("/exchangeGoodsSubmit",{
        "username"            : username,
  			"selectWay" 				  : selectWay,
  			"userGoodsSort" 		  : userGoodsSort,
  			"userGoodsPrice" 		  : userGoodsPrice,
  			"userGoodsName" 		  : userGoodsName,
  			"userGoodsUseTime"   	: userGoodsUseTime,
  			"userGoodsaddText"   	: userGoodsaddText,
  			"userChangeTar" 		  : userChangeTar,
        "userName"            : userName,
  			"publicTime" 				  : FormatDate(new Date()),
  			"userPhone" 			    : userPhone,
  			"userImgOne" 			    : userImgOne,
  			"userImgTwo" 			    : userImgTwo,
  			"userImgThree" 			  : userImgThree,
  			"userImgFore" 			  : userImgFore,
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
  			},1000);

  			alert("1s后，跳回主主页，查看你发布的宝贝");//改成模态框 在模态框上倒计时
  			// 前几个事预览数据，登录后可查看所有
  		})
    } else {
      alert("请选择四张不同的图片");
      window.history.go(0);
    }

		return false;
	})

  //变卖
  $("#saleGoods-submit").click(function() {

    // 获取图片的base64的代码
        //后端的formindable 无法接受数组，因此暂时分开数组 单个传输给后端
    var imgBase64    = $("#preview img");
    var imgBase64Arr = [];
    imgBase64.each(function (i) {
      imgBase64Arr.push($(this).attr("src"));
    })

    var userImgOne   = imgBase64Arr[0];
    var userImgTwo   = imgBase64Arr[1];
    var userImgThree = imgBase64Arr[2];
    var userImgFore  = imgBase64Arr[3];

    if(imgBase64Arr.length>=4) {
      
      //发布商品表单内容
      var userGoodsSort       = $("#user-goods-sort").val();
      var userGoodsName       = $("#user-goods-name").val();
      var userGoodsUseTime    = $("#user-goods-usetime").val();
      var userGoodsaddText    = $("#user-goods-addText").val();
      var userChangeTar       = $("#user-change-target").val();
      var userName            = $("#user-name").val();
      var userPhone           = $("#user-phone").val();
      var username            = $("#username").val();
      var userGoodsPrice      = $("#user-goods-price").val();
      var selectWay           = $("#user-selectway").val();

      $.post("/saleGoodsSubmit",{
        "username"            : username,
        "selectWay"           : selectWay,
        "userGoodsSort"       : userGoodsSort,
        "userGoodsPrice"      : userGoodsPrice,
        "userGoodsName"       : userGoodsName,
        "userGoodsUseTime"    : userGoodsUseTime,
        "userGoodsaddText"    : userGoodsaddText,
        "userChangeTar"       : userChangeTar,
        "userName"            : userName,
        "publicTime"          : FormatDate(new Date()),
        "userImgOne"          : userImgOne,
        "userImgTwo"          : userImgTwo,
        "userImgThree"        : userImgThree,
        "userImgFore"         : userImgFore,
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
          window.location = "/sale";
        },1000);

        alert("1s后，跳回商品变卖页，查看你发布的宝贝");//改成模态框 在模态框上倒计时
        // 前几个事预览数据，登录后可查看所有
      })
    } else {
      alert("请选择四张不同的图片");
      window.history.go(0);
    }

    return false;
  })

  //赠送
  $("#sendGoods-submit").click(function() {

    // 获取图片的base64的代码
        //后端的formindable 无法接受数组，因此暂时分开数组 单个传输给后端
    var imgBase64    = $("#preview img");
    var imgBase64Arr = [];
    imgBase64.each(function (i) {
      imgBase64Arr.push($(this).attr("src"));
    })

    var userImgOne   = imgBase64Arr[0];
    var userImgTwo   = imgBase64Arr[1];
    var userImgThree = imgBase64Arr[2];
    var userImgFore  = imgBase64Arr[3];

    if(imgBase64Arr.length>=4) {
      
      //发布商品表单内容
      var userGoodsSort       = $("#user-goods-sort").val();
      var userGoodsName       = $("#user-goods-name").val();
      var userGoodsUseTime    = $("#user-goods-usetime").val();
      var userGoodsaddText    = $("#user-goods-addText").val();
      var userChangeTar       = $("#user-change-target").val();
      var userName            = $("#user-name").val();
      var userPhone           = $("#user-phone").val();
      var username            = $("#username").val();
      var userGoodsPrice      = $("#user-goods-price").val();
      var selectWay           = $("#user-selectway").val();

      $.post("/sendGoodsSubmit",{
        "username"            : username,
        "selectWay"           : selectWay,
        "userGoodsSort"       : userGoodsSort,
        "userGoodsPrice"      : userGoodsPrice,
        "userGoodsName"       : userGoodsName,
        "userGoodsUseTime"    : userGoodsUseTime,
        "userGoodsaddText"    : userGoodsaddText,
        "userChangeTar"       : userChangeTar,
        "userName"            : userName,
        "publicTime"          : FormatDate(new Date()),
        "userPhone"           : userPhone,
        "userImgOne"          : userImgOne,
        "userImgTwo"          : userImgTwo,
        "userImgThree"        : userImgThree,
        "userImgFore"         : userImgFore,
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
          window.location = "/send";
        },1000);

        alert("1s后，跳回商品变卖页，查看你发布的宝贝");//改成模态框 在模态框上倒计时
        // 前几个事预览数据，登录后可查看所有
      })
    } else {
      alert("请选择四张不同的图片");
      window.history.go(0);
    }

    return false;
  })

  //捐献
  $("#donateGoods-submit").click(function() {

    // 获取图片的base64的代码
        //后端的formindable 无法接受数组，因此暂时分开数组 单个传输给后端
    var imgBase64    = $("#preview img");
    var imgBase64Arr = [];
    imgBase64.each(function (i) {
      imgBase64Arr.push($(this).attr("src"));
    })

    var userImgOne   = imgBase64Arr[0];
    var userImgTwo   = imgBase64Arr[1];
    var userImgThree = imgBase64Arr[2];
    var userImgFore  = imgBase64Arr[3];

    if(imgBase64Arr.length>=4) {
      
      //发布商品表单内容
      var userGoodsSort       = $("#user-goods-sort").val();
      var userGoodsName       = $("#user-goods-name").val();
      var userGoodsUseTime    = $("#user-goods-usetime").val();
      var userGoodsaddText    = $("#user-goods-addText").val();
      var userChangeTar       = $("#user-change-target").val();
      var userName            = $("#user-name").val();
      var userPhone           = $("#user-phone").val();
      var username            = $("#username").val();
      var userGoodsPrice      = $("#user-goods-price").val();
      var selectWay           = $("#user-selectway").val();

      $.post("/donateGoodsSubmit",{
        "username"            : username,
        "selectWay"           : selectWay,
        "userGoodsSort"       : userGoodsSort,
        "userGoodsPrice"      : userGoodsPrice,
        "userGoodsName"       : userGoodsName,
        "userGoodsUseTime"    : userGoodsUseTime,
        "userGoodsaddText"    : userGoodsaddText,
        "userChangeTar"       : userChangeTar,
        "userName"            : userName,
        "publicTime"          : FormatDate(new Date()),
        "userPhone"           : userPhone,
        "userImgOne"          : userImgOne,
        "userImgTwo"          : userImgTwo,
        "userImgThree"        : userImgThree,
        "userImgFore"         : userImgFore,
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
          window.location = "/donate";
        },1000);

        alert("1s后，跳回商品捐赠页，查看你发布的宝贝");//改成模态框 在模态框上倒计时
        // 前几个事预览数据，登录后可查看所有
      })
    } else {
      alert("请选择四张不同的图片");
      window.history.go(0);
    }

    return false;
  })

  //搜索框
  $("#search-goods").click(function (argument) {
    var searchGoodContents = $("#search-exchange-goods").val();

    if(searchGoodContents.length>0) {
      $.post("/search-sql",{
        "search-goods-contents": searchGoodContents
      },function (result) {
        console.log(result);
        if (result == "1") {
          console.log("查询成功");
        }
      })
    }
  })







  //路由的不同，做菜单的高亮显示

  var window_href = location.pathname;
  var href_a  = $(".left_colum").find("a");
      href_a.each(function(){
        if(window_href == $(this).attr("href")) {
           $(this).addClass("active");
        }
      })

})

