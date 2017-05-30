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

    formVertify ();

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
      $(".error-img-file").fadeIn();
      return false;     
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

    isNothing($("#user-goods-sort"));
    isNothing($("#user-goods-name"));
    isNothing($("#user-phone"))
    isPhone($("#user-phone"));   
    isNothing($("#user-goods-price"));
    isNothing($("#user-goods-usetime"));
    isNothing($("#user-name"));

    if(imgBase64Arr.length>=4) {
      
      //发布商品表单内容
      var userGoodsSort       = $("#user-goods-sort").val();
      var userGoodsName       = $("#user-goods-name").val();
      var userGoodsUseTime    = $("#user-goods-usetime").val();
      var userGoodsaddText    = $("#user-goods-addText").val();
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
        "userName"            : userName,
        "publicTime"          : FormatDate(new Date()),
        "userImgOne"          : userImgOne,
        "userImgTwo"          : userImgTwo,
        "userImgThree"        : userImgThree,
        "userImgFore"         : userImgFore,
      },function(result) {
        if(result=="1"){
          
        }
        
        setTimeout(function () {
          window.location = "/sale";
        },1000);

        alert("1s后，跳回商品变卖页，查看你发布的宝贝");//改成模态框 在模态框上倒计时
        // 前几个事预览数据，登录后可查看所有
      })
    } else {
      $(".error-img-file").fadeIn();
      return false;  
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

    isNothing($("#user-goods-sort"));
    isNothing($("#user-goods-name"));
    isNothing($("#user-phone"))
    isPhone($("#user-phone"));   
    isNothing($("#user-name"));

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
        "userGoodsName"       : userGoodsName,
        "userGoodsaddText"    : userGoodsaddText,
        "userName"            : userName,
        "publicTime"          : FormatDate(new Date()),
        "userPhone"           : userPhone,
        "userImgOne"          : userImgOne,
        "userImgTwo"          : userImgTwo,
        "userImgThree"        : userImgThree,
        "userImgFore"         : userImgFore,
      },function(result) {
        if(result=="1"){
          
        }
        
        setTimeout(function () {
          window.location = "/send";
        },1000);

        alert("1s后，跳回商品变卖页，查看你发布的宝贝");//改成模态框 在模态框上倒计时
        // 前几个事预览数据，登录后可查看所有
      })
    } else {
      $(".error-img-file").fadeIn();
      return false;  
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

    isNothing($("#user-goods-sort"));
    isNothing($("#user-goods-name"));
    isNothing($("#user-phone"))
    isPhone($("#user-phone"));   
    isNothing($("#user-name"));

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
        "userGoodsName"       : userGoodsName,
        "userGoodsaddText"    : userGoodsaddText,
        "userName"            : userName,
        "publicTime"          : FormatDate(new Date()),
        "userPhone"           : userPhone,
        "userImgOne"          : userImgOne,
        "userImgTwo"          : userImgTwo,
        "userImgThree"        : userImgThree,
        "userImgFore"         : userImgFore,
      },function(result) {
        if(result=="1"){
          
        }
        
        setTimeout(function () {
          window.location = "/donate";
        },1000);

        alert("1s后，跳回商品捐赠页，查看你发布的宝贝");//改成模态框 在模态框上倒计时
        // 前几个事预览数据，登录后可查看所有
      })
    } else {
      $(".error-img-file").fadeIn();
      return false;  
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
        // console.log(result);
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

  //表单验证
  function isNothing (dom) {
    var domValue = dom.val();
    if(domValue.length<1) {
      dom.addClass("error-border").parent("div").next(".error-msg").addClass("error-fadeIn");
      return false;
    }
  }

  // 当填写表单的取消红色标记
  $(document).on('propertychange input', '.form-good-submit input', function() {
    $(this).removeClass('error-border')
    .parent("div").next(".error-msg").removeClass("error-fadeIn");
    $(this).removeClass('error-border')
    .parent("div").next().next(".error-msg-formate").removeClass("error-fadeIn");
  });
  
   $("#fileImage").click(function () {
      $(".error-img-file").fadeOut();    
   })
  //电话号码的验证
  function isPhone(dom) {
    var domValue = dom.val();
    if(domValue.length>1 && !(/^1[34578]\d{9}$/.test(domValue))){ 
        dom.addClass("error-border").parent("div").next().next(".error-msg-formate").addClass("error-fadeIn"); 
        return false; 
    } 
  }

  //所有页面提交的时候，表单数值的验证
  function formVertify () {
    isNothing($("#user-goods-sort"));
    isNothing($("#user-goods-name"));
    isNothing($("#user-change-target"));
    isNothing($("#user-phone"))
    isPhone($("#user-phone"));   
    isNothing($("#user-goods-price"));
    isNothing($("#user-goods-usetime"));
    isNothing($("#user-name"));
  }

  //分页条获得分页数字
  function getPage(page) {
    var window_href   = location.pathname;
    var newWindowHref =  window_href + "?page=" + page;
    window.location = newWindowHref;
  }

  // 给分页条追加active
  function addActive () {
    var window_href = window.location.href;
    window_href = window_href.split("=");
    var pageNumber = parseInt(window_href[1])+1;
    $(".pagination li a:contains(" + pageNumber +")").addClass("active");
  }
  

  //分页查询

  //捐赠 分页条的Ajax
  $.get("/donateNumberAmount", function (result) {
      var amount = parseInt(result);
      //总页数
      pageamount = Math.ceil(amount /2);//返回的是 与它相近的大1数值 
      for (var i = 0; i < pageamount; i++) {
        $(".pagination").append("<li ><a href='javascript:void(0);'>" +(i+1)+ "</a></li>");
      }
      addActive();
      //监听
      $(".pagination li").click(function () {
          var page = $(this).index();
          getPage(page);
          $(this).addClass("active").siblings().removeClass("active");
      });
  })

})

