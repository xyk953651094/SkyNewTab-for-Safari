import {
    authorBtn,
    clientId,
    downloadBtns,
    gotoBtns,
    mask,
    searchInput,
    unsplashImage,
    unsplashUrl
} from "./publicConstants.js";
import {getMessage} from "./publicFunctions.js";

layui.use(["layer"], function(){
    let $ = layui.jquery;
    let layer = layui.layer;

    // 下载按钮点击事件
    downloadBtns.on("click", function () {
        if (unsplashImage !== null) {
            $.ajax({
                headers: {"Authorization": "Client-ID " + clientId},
                url: unsplashImage.links.download_location,
                type: "GET",
                data: {"client_id": clientId},
                success: function (result) {
                    window.open(result.url + unsplashUrl);
                },
                error: function () {
                    let errorInfo = getMessage("getImageError");
                    layer.msg(errorInfo);
                }
            });
        }
        else {
            let errorInfo = getMessage("getImageError");
            layer.msg(errorInfo);
        }
    });

    // 跳转按钮点击事件
    gotoBtns.on("click", function () {
        if (unsplashImage !== null) {
            window.open(unsplashImage.links.html + unsplashUrl);
        }
        else {
            let errorInfo = getMessage("getImageError");
            layer.msg(errorInfo);
        }
    });

    // 搜索框事件
    searchInput.on("focus", function () {  // 搜索框获取焦点事件，开启遮罩层
        mask.removeClass("layui-anim layui-anim-fadeout");
        mask.addClass("layui-anim layui-anim-fadein");
        mask.css({"display": "block"});
    }).on("blur", function () {  // 搜索框失去焦点事件，关闭遮罩层
        mask.removeClass("layui-anim layui-anim-fadein");
        mask.addClass("layui-anim layui-anim-fadeout");
    }).on("keydown", function (e) {  // 搜索框搜索事件
        if (e.keyCode === 13) {
            let searchText = $("#searchInput").val();
            if(searchText.length === 0) {
                window.location.href = "https://cn.bing.com/search?q=" + searchText;
            }
            else {
                if(window.navigator.userAgent.indexOf("Chrome") > -1) {  // Chrome
                    let queryInfo = {
                        disposition: "CURRENT_TAB",
                        text: searchText,
                    }
                    chrome.search.query(queryInfo)
                }
                else {  // other browser
                    window.location.href = "https://cn.bing.com/search?q=" + searchText;
                }
            }
        }
    });
    searchInput.attr("placeholder", getMessage("searchPlaceholder"));

    // 作者按钮事件
    authorBtn.on("click", function () {
        if (unsplashImage !== null) {
            window.open(unsplashImage.user.links.html + unsplashUrl);
        }
        else {
            let errorInfo = getMessage("getImageError");
            layer.msg(errorInfo);
        }
    })
});
