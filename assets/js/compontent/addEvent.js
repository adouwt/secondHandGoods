$(document).on("click", "#event-submit", function(){
    common.errArr= [];
    // 获取图片的base64的代码
    //后端的formindable 无法接受数组，因此暂时分开数组 单个传输给后端
    var imgBase64    = $("#preview img");
    var imgBase64Arr = [];
    imgBase64.each(function (i) {
      imgBase64Arr.push($(this).attr("src"));
    })
    
    var username            = $("#username").html().replace(" ", "");
    var userImgOne          = imgBase64Arr[0];
    var userImgTwo          = imgBase64Arr[1];
    var userImgThree        = imgBase64Arr[2];
    var userImgFore         = imgBase64Arr[3];

    var eventTitle          = $("#event-title");
    var eventAddress        = $("#event-address");
    var eventPeople         = $("#event-people");
    var eventTime           = $("#event-time");
    var eventContent        = $("#event-content");

    common.isNothing(eventTitle);
    common.isNothing(eventAddress);
    common.isNothing(eventPeople);
    common.isNothing(eventTime);
    common.isNothing(eventContent);


    if(imgBase64Arr.length>=4 && common.errArr.length<=0) {

      //发布商品表单内容
      var eventTitle     = eventTitle.val().replace(" ","");
      var eventAddress   = eventAddress.val().replace(" ","");
      var eventPeople   = eventPeople.val().replace(" ","");
      var eventTime   = eventTime.val().replace(" ","");
      var eventContent   = eventContent.val().replace(" ","");

      $.post("/event/submit",{
        "eventTitle"          : eventTitle,
        "eventAddress"        : eventAddress,
        "eventPeople"         : eventPeople,
        "eventTime"           : eventTime,
        "eventContent"        : eventContent,
        "publicTime"          : common.FormatDate(new Date()),
        "userImgOne"          : userImgOne,
        "userImgTwo"          : userImgTwo,
        "userImgThree"        : userImgThree,
        "userImgFore"         : userImgFore,
      },function(result) {
        if(result=="1"){

        }

        setTimeout(function () {
          window.location = "/event/list?page=0";
        },1000);

        alert("1s后，跳回校园大事件，查看你发布的内容");//改成模态框 在模态框上倒计时
        // 前几个事预览数据，登录后可查看所有
      })
    } else {
      $(".error-img-file").fadeIn();
      return false;
    }

    return false;
})
