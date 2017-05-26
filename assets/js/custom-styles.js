$(function(){
	//注册时么有选中同意按钮，不给点击
	$(".regist_checked").change(function(){
    	$(this).parents(".checkbox").next("button").toggleClass("disabled");
	});

	// 图片上传的处理

	var params = {
          fileInput: $("#fileImage").get(0),
          dragDrop: $("#fileDragArea").get(0),
          upButton: $("#fileSubmit").get(0),
          url: $("#uploadForm").attr("action"),
          filter: function(files) {
            var arrFiles = [];
              for (var i = 0, file; file = files[i]; i++) {
	            if (file.type.indexOf("image") == 0) {
	                if (file.size >= 512000) {
	                  alert('您这张"'+ file.name +'"图片大小过大，应小于500k');  
	            	} else {
	                 	arrFiles.push(file);  
	                }     
	            } else {
	                alert('文件"' + file.name + '"不是图片。');  
	            }
            }
            return arrFiles;
          },
          onSelect: function(files) {
            var html = '', i = 0;
            $("#preview").html('<div class="upload_loading"></div>');
            var funAppendImage = function() {
              file = files[i];
              if (file) {
                var reader = new FileReader()
                reader.onload = function(e) {
                  html = html + '<div id="uploadList_'+ i +'" class="upload_append_list"><p><strong>' + file.name + '</strong>'+ 
                    '<a href="javascript:" class="upload_delete" title="删除" data-index="'+ i +'">删除</a><br />' +
                    '<img id="uploadImage_' + i + '" src="' + e.target.result + '" class="upload_image" /></p>'+ 
                    '<span id="uploadProgress_' + i + '" class="upload_progress"></span>' +
                  '</div>';
                  
                  i++;
                  funAppendImage();
                }
                reader.readAsDataURL(file);
              } else {
                $("#preview").html(html);
                if (html) {
                  //删除方法
                  $(".upload_delete").click(function() {
                    ZXXFILE.funDeleteFile(files[parseInt($(this).attr("data-index"))]);
                    return false; 
                  });
                  //提交按钮显示
                  $("#fileSubmit").show();  
                } else {
                  //提交按钮隐藏
                  $("#fileSubmit").hide();  
                }
              }
            };
            funAppendImage();   
          },
          onDelete: function(file) {
            $("#uploadList_" + file.index).fadeOut();
          },
          onDragOver: function() {
            $(this).addClass("upload_drag_hover");
          },
          onDragLeave: function() {
            $(this).removeClass("upload_drag_hover");
          },
          onProgress: function(file, loaded, total) {
            var eleProgress = $("#uploadProgress_" + file.index), percent = (loaded / total * 100).toFixed(2) + '%';
            eleProgress.show().html(percent);
          },
          onSuccess: function(file, response) {
            // $("#uploadInf").append("<p>上传成功，图片地址是：" + response + "</p>");
            $("#uploadInf").append("<p>上传成功</p>");
          },
          onFailure: function(file) {
            $("#uploadInf").append("<p>图片" + file.name + "上传失败！</p>");  
            $("#uploadImage_" + file.index).css("opacity", 0.2);
          },
          onComplete: function() {
            //提交按钮隐藏
            $("#fileSubmit").hide();
            //file控件value置空
            $("#fileImage").val("");
            $("#uploadInf").append("<p>当前图片全部上传完毕，可继续添加上传。</p>");
          }
        };
      ZXXFILE = $.extend(ZXXFILE, params);
      ZXXFILE.init();

	$("#goods-submit").click(function() {

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

    if(imgBase64Arr.length>4) {
      
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
  			"userImgOne" 			: userImgOne,
  			"userImgTwo" 			: userImgTwo,
  			"userImgThree" 			: userImgThree,
  			"userImgFore" 			: userImgFore,
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









})

