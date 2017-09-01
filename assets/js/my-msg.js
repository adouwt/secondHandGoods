$(document).on('click', "#revise-userpassword", function() {
	$(this).hide();
	$('.revise-userpassword-area').slideDown();
})

$(document).on('click', "#save-my-msg", function() {

  var pwdArea    = $('.revise-userpassword-area').is(':visible');
  var nickName   = $("#usernickname").val();
  var username   = $("#userName").val();
  var userAvatar = $("#imghead").attr("src");
  console.log(userAvatar)
	if(pwdArea == true){
		var newPwd = $("#new-pwd").val();
		var oldPwd = $("#old-pwd").val();

		if(newPwd){
			if(newPwd.length<6 || newPwd.length> 8) {
				$('.true-pwd-msg').fadeIn();
				if(!oldPwd) {
					$('.old-msg').fadeIn();
				}
			}else if(!oldPwd) {
				$('.old-msg').fadeIn();
			}
		}
		$.post("/reviseMyMsg",{
				"username": username,
				"nickName" : nickName,
				"oldPwd" : oldPwd,
				"newPwd" : newPwd,
				"useravatar": userAvatar
			},function(result){
        if(result=="1"){					
          alert("修改成功")				
          window.location.reload()
				}else if(result=="-5"){
          alert("服务器错误")
				}
				else if(result=="4"){
					$('.old-msg').fadeIn();
				}
		})
	} else {
		$.post("/addNickName",{
				"username"      : username,
				"nickName" 		: nickName,
				"useravatar"    :userAvatar
			},function(result){
        if(result=="1"){	
        alert("修改成功")				
          window.location.reload()
				}else if(result=="-5"){
          alert("服务器错误")
				}
				else if(result=="-2"){
					// $('.old-msg').fadeIn();
				}
		})
	}

	

	
})


$(document).on('propertychange input', '.form-good-submit input', function() {
  $(this).removeClass('error-border')
  .parent("div").next(".old-msg").fadeOut();
  $(this).removeClass('error-border')
  .parent("div").next(".true-pwd-msg").fadeOut();
});

