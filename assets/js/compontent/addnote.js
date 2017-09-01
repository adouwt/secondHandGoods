$(document).on("click", "#note-submit", function(){
    common.errArr= [];
    // 获取图片的base64的代码
    //后端的formindable 无法接受数组，因此暂时分开数组 单个传输给后端
    var imgBase64    = $("#preview img");
    var imgBase64Arr = [];
    imgBase64.each(function (i) {
      imgBase64Arr.push($(this).attr("src"));
    })
    var username            = $("#username").html().replace(" ", "");
    var noteTitle           = $("#note-title")
    var noteContent         = $("#note-addText")

    common.isNothing(noteTitle);
    common.isNothing(noteContent);

    if(common.errArr.length<=0) { 

      //发布商品表单内容
      var noteTitle     = noteTitle.val().replace(" ","");
      var noteContent   = noteContent.val().replace(" ","");

      $.post("/note/submit",{
        "username"            : username,
        "noteTitle"           : noteTitle,
        "noteContent"         : noteContent
      },function(result) {
        if(result=="1"){

        }

        setTimeout(function () {
          window.location = "/note/list?page=0";
        },1000);

        alert("1s后，跳回帖子页，查看你发布的内容");//改成模态框 在模态框上倒计时
        // 前几个事预览数据，登录后可查看所有
      })
    } else {
      $(".error-img-file").fadeIn();
      return false;
    }

    return false;
})
