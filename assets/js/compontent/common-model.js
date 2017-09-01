
$(document).on("click", ".contact-send-instance", function(){
    common.errArr=[];
    var commonParent = $(this).parents(".current-model");
    var contactMsg       = commonParent.find(".contact-msgs").val();
    var currentUser      = commonParent.find(".send-hide-msg").attr("data-username");
    var currentGoodsname = commonParent.find(".send-hide-msg").attr("data-goodsname");
    var currentselectWay = commonParent.find(".send-hide-msg").attr("data-selectway");
    var currentNickname  = commonParent.find(".send-hide-msg").attr("data-nickname");
    var currentuserId    = commonParent.find(".send-hide-msg").attr("data-uid");
    var currentGoodsnameId = commonParent.attr("id");
    var msgSendTime      = common.FormatDate(new Date());
    if(!currentUser) {
        alert("登录后才能联系")
        $("#"+currentGoodsnameId).removeClass("in");
        $("#myModalLogin").addClass("in").fadeIn();
        return;
    }

    common.isNothing($(".contact-msgs"));
    if(contactMsg.length<=0) {
        $('.error-msg').fadeIn();
    }
   
    if(common.errArr.length<=0) {
        $.post("/doContact",{
            "kind" : currentselectWay,
            "itemID" : currentGoodsnameId,
            "targetid" : currentuserId,
            "msg" : contactMsg
        }, function(result){
            if(result == "1") {
                alert("您的消息已经发送给他，请静候佳音！");
                window.location.reload();
            } else {
                console.log("联系失败，稍后尝试")
            }
        })
    }

})
