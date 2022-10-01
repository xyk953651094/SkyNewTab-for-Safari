layui.use(['layer'], function(){
    let $ = layui.jquery;
    let layer = layui.layer;

    let layoutAdmin = $('#layoutAdmin');              //
    let greetBtn = $('#greetBtn');                    // 问候按钮
    let weatherBtn = $('#weatherBtn')                 // 天气按钮
    let downloadBtnHeader = $('#downloadBtnHeader');  // 顶部下载按钮，桌面端时显示
    let gotoBtnHeader = $('#gotoBtnHeader');          // 顶部跳转按钮，桌面端时显示
    let mask = $('#mask');                            // 遮罩层
    let searchInput = $('#searchInput');              // 搜索框
    let layuiFooterRow = $('#layuiFooterRow');
    let authorBtn = $('#authorBtn');                  // 作者按钮，桌面端时显示
    let createTimeBtn = $('#createTimeBtn');          // 创作时间按钮，桌面端时显示
    let downloadBtnFooter = $('#downloadBtnFooter');  // 底部下载按钮，移动端时显示
    let gotoBtnFooter = $('#gotoBtnFooter');          // 底部跳转按钮，移动端时显示
    let downloadBtns = $('#downloadBtnHeader, #downloadBtnFooter');  // 下载按钮集合
    let gotoBtns = $('#gotoBtnHeader, #gotoBtnFooter');              // 跳转按钮集合

    let device = getDevice();  // 获取当前设备类型
    let clientId = 'ntHZZmwZUkhiLBMvwqqzmOG29nyXSCXlX7x_i-qhVHM';
    let unsplashUrl = "?utm_source=SkyNewTab&utm_medium=referral";   // Unsplash API规范
    let unsplashImage = null;  // 默认


    // 下载按钮点击事件
    downloadBtns.on('click', function () {
        if (unsplashImage !== null) {
            $.ajax({
                headers: {'Authorization': "Client-ID " + clientId},
                url: unsplashImage.links.download_location,
                type: 'GET',
                data: {'client_id': clientId},
                success: function (result) {
                    window.open(result.url + unsplashUrl);
                },
                error: function (err) {
                    let errorInfo = getMessage('getImageError');
                    layer.msg(errorInfo);
                }
            });
        }
        else {
            let errorInfo = getMessage('getImageError');
            layer.msg(errorInfo);
        }
    });

    // 跳转按钮点击事件
    gotoBtns.on('click', function () {
        if (unsplashImage !== null) {
            window.open(unsplashImage.links.html + unsplashUrl);
        }
        else {
            let errorInfo = getMessage('getImageError');
            layer.msg(errorInfo);
        }
    });

    // 搜索框事件
    searchInput.on('focus', function () {  // 搜索框获取焦点事件，开启遮罩层
        mask.removeClass('layui-anim layui-anim-fadeout');
        mask.addClass('layui-anim layui-anim-fadein');
        mask.css({
            'display': 'block',
        });
    }).on('blur', function () {  // 搜索框失去焦点事件，关闭遮罩层
        mask.removeClass('layui-anim layui-anim-fadein');
        mask.addClass('layui-anim layui-anim-fadeout');
    }).on('keydown', function (e) {  // 搜索框搜索事件
        if (e.keyCode === 13) {
            let searchText = $('#searchInput').val();
            if(searchText.length === 0) {
                window.location.href = 'https://cn.bing.com/search?q=' + searchText;
            }
            else {
                if(window.navigator.userAgent.indexOf('Chrome') > -1) {  // Chrome
                    let queryInfo = {
                        disposition: 'CURRENT_TAB',
                        text: searchText,
                    }
                    chrome.search.query(queryInfo)
                }
                else {  // other browser
                    window.location.href = 'https://cn.bing.com/search?q=' + searchText;
                }
            }
        }
    });
    searchInput.attr('placeholder', getMessage('searchPlaceholder'));

    // 作者按钮点击事件
    authorBtn.on('click', function () {
        if (unsplashImage !== null) {
            window.open(unsplashImage.user.links.html + unsplashUrl);
        }
        else {
            let errorInfo = getMessage('getImageError');
            layer.msg(errorInfo);
        }
    })

    // 问候语
    function setGreet() {
        let {greetContent, greetIcon} = getGreet();
        greetBtn.html('<i class="iconfont ' + greetIcon + '"> ' + greetContent + '</i>');

        // 获取节气
        let parameters = {
            'app_id': 'cicgheqakgmpjclo',
            'app_secret': 'RVlRVjZTYXVqeHB3WCtQUG5lM0h0UT09',
        };
        $.ajax({
            url: 'https://www.mxnzp.com/api/holiday/single/' + getDateTime(),
            type: 'GET',
            data: parameters,
            success: function (result) {
                if(result.code === 1){
                    let solarTerms = result.data.solarTerms;
                    if(result.data.solarTerms.indexOf('后') === -1) {
                        solarTerms = '今日' + solarTerms;
                    }
                    greetBtn.html('<i class="layui-anim layui-anim-fadein iconfont ' + greetIcon + '"> ' + greetContent + '｜' + solarTerms + '</i>')
                }
                else{}
            },
            error: function (err) {}
        });
    }

    // 获取天气
    function setWeather() {
        $.ajax({
            url: 'https://v2.jinrishici.com/info',
            type: 'GET',
            success: function (result) {
                if (result.status === 'success' && result.data.weatherData !==null) {
                    let weatherData = result.data.weatherData;
                    weatherBtn.html('<i class="layui-anim layui-anim-fadein iconfont"> ' + weatherData.weather + '｜' + weatherData.temperature + '°C</i>');
                    weatherBtn.css('display', 'inline-block');  // 请求成功再显示
                }
                else {}
            },
            error: function (err) {}
        });
    }

    // 请求unsplash图片前显示随机颜色主题
    function setColorTheme() {
        let hour = new Date().getHours();
        let theme = lightThemeArray;
        if( 18 < hour || hour < 6) {
            theme = darkThemeArray;
        }
        let randomNum = Math.floor(Math.random() * theme.length);  // 随机选择一种主题

        let frostedGlass = $('.frostedGlass')
        $('body').css('background-color', theme[randomNum].bodyBackgroundColor);
        frostedGlass.css('color', getFontColor(theme[randomNum].frostedGlassBackgroundColor));
        frostedGlass.css('background-color', theme[randomNum].frostedGlassBackgroundColor);
    }

    // 请求unsplash图片
    function setUnsplashImg() {
        let orientation = 'landscape';
        if(device === 'iPhone' || device === 'Android') {
            orientation = 'portrait';  // 竖屏请求竖屏图片
        }
        $.ajax({
            url: 'https://api.unsplash.com/photos/random?',
            headers: {
                'Authorization': "Client-ID " + clientId,
            },
            type: 'GET',
            data: {
                'client_id': clientId,
                'orientation': orientation,
                'content_filter': 'high',
                'topics': 'bo8jQKTaE0Y,6sMVjTLSkeQ,bDo48cUhwnY,xHxYTMHLgOc,iUIsnVtjB0Y,R_Fyn-Gwtlw,Fzo3zuOHN6w'
            },
            timeout: 10000,
            success: function (result) {
                unsplashImage = result;  // 更新 unsplashImage 的数据为最新请求图片
                setBackgroundImage(unsplashImage);
            },
            error: function () {
                if (unsplashImage !== null) {
                    setBackgroundImage(unsplashImage);  // 使用上次请求的图片
                }
                else {
                    unsplashImage = defaultImage;  // 使用默认图片
                    setBackgroundImage(unsplashImage);
                }
            },
            cancel: function () {
                if (unsplashImage !== null) {
                    setBackgroundImage(unsplashImage);  // 使用上次请求的图片
                }
                else {
                    unsplashImage = defaultImage;  // 使用默认图片
                    setBackgroundImage(unsplashImage);
                }
            }
        });
    }

    // 图片加载完成后再设置背景图片
    function setBackgroundImage(imageData){
        let img = new Image();
        img.src = imageData.urls.regular;

        // 图片加载完成前显示BlurHash效果
        // blurHash(imageData, layoutAdmin);

        // 动画过渡主题颜色
        $('.frostedGlass').animate({
            color: getFontColor(getThemeColor(imageData.color)),
            backgroundColor: getThemeColor(imageData.color)
        }, 500);
        $('body').animate({backgroundColor: imageData.color}, 500);

        // 显示按钮
        if(device === 'iPhone' || device === 'Android') {  // 小屏显示底部按钮
            downloadBtnFooter.css('display', 'inline-block');
            gotoBtnFooter.css('display', 'inline-block');
            layuiFooterRow.removeClass('rowRight');
            layuiFooterRow.addClass('rowLeft');
        }
        else {
            downloadBtnHeader.css('display', 'inline-block');
            gotoBtnHeader.css('display', 'inline-block');
            authorBtn.css('display', 'inline-block');
            createTimeBtn.css('display', 'inline-block');

            authorBtn.html('<i class="iconfont icon-camera">' + ' by ' + imageData.user.name +  ' on Unsplash' + '</i>');
            authorBtn.attr('title', imageData.user.links.html + unsplashUrl);
            createTimeBtn.html('<i class="iconfont icon-calendar">' + ' ' + imageData.created_at.split('T')[0] + '</i>');
        }
        downloadBtns.attr('title', imageData.links.download_location + unsplashUrl);
        gotoBtns.attr('title', imageData.links.html + unsplashUrl);

        // 图片加载完成时
        img.onload = () =>  {
            layoutAdmin.append(img);
            img.className = 'backgroundImage layui-anim layui-anim-fadein'

            // 设置动态效果
            setTimeout(function(){
                img.style.transform = 'scale(1.05)';
                img.style.transition = '5s';
            }, 100 );  // 假如时间设为0（立即执行）会无法执行
            setTimeout(function(){
                imageDynamicEffect(img);
            }, 5000);
        }
    }

    setGreet();       // 显示问候语
    setWeather();     // 设置天气
    setColorTheme();  // 设置随机颜色主题
    setUnsplashImg(); // 显示unsplash背景图片
});
