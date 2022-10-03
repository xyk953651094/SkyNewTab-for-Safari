// 根据图片背景颜色获取元素反色效果
import {device} from "./publicConstants.js";

export function getThemeColor(color) {
    color = '0x' + color.replace('#', '');
    let newColor = '000000' + (0xFFFFFF - color).toString(16);
    return '#' + newColor.substring(newColor.length-6, newColor.length);
}

// 根据图片背景颜色改变字体颜色效果
export function getFontColor(color) {
    let rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    let r = parseInt(rgb[1], 16);
    let g = parseInt(rgb[2], 16);
    let b = parseInt(rgb[3], 16);
    let gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
    if (gray > 128) {
        return '#000000';
    } else {
        return '#ffffff';
    }
}

// 判断设备型号
export function getDevice() {
    let ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > -1) { return 'iPhone' }
    else if(ua.indexOf('iPad') > -1) { return 'iPad' }
    else if(ua.indexOf('Android') > -1) { return 'Android' }
    else { return '' }
}

// 获取日期时间
export function getDateTime() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if (month < 10) { month = '0' + month }
    if (day < 10) { day = '0' + day }
    return year.toString() + month.toString() + day.toString();
}

// 获取问候
export function getGreet() {
    let now = new Date();
    let hour = now.getHours();
    let greetContent, greetIcon;
    if (hour >= 6 && hour < 11) {
        greetContent = getMessage('greetMorning');
        greetIcon = 'icon-sunrise';
    } else if (hour >= 11 && hour < 14) {
        greetContent = getMessage('greetNoon');
        greetIcon = 'icon-sun_max';
    } else if (hour >= 14 && hour < 17) {
        greetContent = getMessage('greetAfternoon');
        greetIcon = 'icon-sunset';
    } else if (hour >= 17 && hour < 20) {
        greetContent = getMessage('greetEvening');
        greetIcon = 'icon-sunset';
    } else if (hour >= 20 && hour < 24) {
        greetContent = getMessage('greetNight');
        greetIcon = 'icon-moon_stars';
    } else {
        greetContent = getMessage('greetDawn');
        greetIcon = 'icon-moon_stars';
    }
    return {greetContent, greetIcon};
}

// 节气
export function getSolarTerms(year,month,day){
    // month = month-1;
    let sTermInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
    let solarTerm = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
    let solarTerms = "";

    //　此方法可以获取该日期处于某节气
    while (solarTerms===""){
        let tmp1 = new Date((31556925974.7*(year-1900)+sTermInfo[month*2+1]*60000)+Date.UTC(1900,0,6,2,5));
        let tmp2 = tmp1.getUTCDate();
        if (tmp2===day) solarTerms = solarTerm[month*2+1];
        tmp1 = new Date((31556925974.7*(year-1900)+sTermInfo[month*2]*60000)+Date.UTC(1900,0,6,2,5));
        tmp2= tmp1.getUTCDate(); if (tmp2===day) solarTerms = solarTerm[month*2];
        if(day>1){
            day=day-1;
        }else {
            month=month-1;
            if(month<0){
                year=year-1; month=11;
            }
            day=31;
        }
    }
    return solarTerms;
}

// 获取节日
// function getHolidays(year,month,day){
//     month = month + 1;
//
//     // 农历节日
//     if(lunarInfo.lMonth === 1 && lunarInfo.lday === 1)  { return "春节"}
//     else if(lunarInfo.lMonth === 1 && lunarInfo.lday === 15) { return "元宵节"}
//     else if(lunarInfo.lMonth === 1 && lunarInfo.lday === 15) { return "清明节"}
//     else if(lunarInfo.lMonth === 5 && lunarInfo.lday === 5)  { return "端午节"}
//     else if(lunarInfo.lMonth === 7 && lunarInfo.lday === 7)  { return "七夕节"}
//     else if(lunarInfo.lMonth === 7 && lunarInfo.lday === 15) { return "中元节"}
//     else if(lunarInfo.lMonth === 8 && lunarInfo.lday === 15) { return "中秋节"}
//     else if(lunarInfo.lMonth === 9 && lunarInfo.lday === 9)  { return "重阳节"}
//     else if(lunarInfo.lMonth === 12 && lunarInfo.lday === 30)  { return "除夕节"}
//     // 阳历节日
//     else if(month === 1 && day === 1)  { return "元旦节"}
//     else if(month === 3 && day === 8)  { return "妇女节"}
//     else if(month === 3 && day === 12) { return "植树节"}
//     else if(month === 4 && day === 4)  { return "寒食节"}
//     else if(month === 4 && day === 5)  { return "清明节"}
//     else if(month === 5 && day === 1)  { return "劳动节"}
//     else if(month === 5 && day === 4)  { return "青年节"}
//     else if(month === 6 && day === 1)  { return "儿童节"}
//     else if(month === 7 && day === 1)  { return "建党节"}
//     else if(month === 8 && day === 1)  { return "建军节"}
//     else if(month === 9 && day === 10) { return "教师节"}
//     else if(month === 10 && day === 1) { return "国庆节"}
//     else { return ""}
// }

// BlurHash
export function blurHash(imageData, container) {
    let hash = imageData.blur_hash;
    let width = parseInt(imageData.width);
    let height = parseInt(imageData.height);

    blurhash
        .decodePromise(hash, width, height)
        .then(blurhashImgData => {
            // as canvas element
            const canvas = blurhash.drawImageDataOnNewCanvas(
                blurhashImgData,
                width,
                height
            );
            canvas.className = 'backgroundCanvas layui-anim layui-anim-fadein';
            container.append(canvas);

            // as image object with onload callback
            const imgObject = blurhash.getImageDataAsImage(
                blurhashImgData,
                width,
                height,
                (event, imgObject) => {
                    container.append(imgObject);
                }
            );

            // as image object with promise
            return blurhash.getImageDataAsImageWithOnloadPromise(
                blurhashImgData,
                width,
                height
            );
        })
    // .then(imgObject => {
    //     container.append(imgObject);
    // });
}

// Android端与桌面端壁纸动态效果
export function imageDynamicEffect(element) {
    if (device === "Android") {
        if (window.addEventListener) {
            window.addEventListener("deviceorientation", function (event) {
                console.log(event.alpha, event.beta, event.gamma);
            });
        }
    } else {  // 桌面端
        window.addEventListener("mousemove", function (e) {
            let mouseX = e.screenX;
            let mouseY = e.screenY;
            let screenWidth = document.body.clientWidth;
            let screenHeight = document.body.clientHeight;
            let screenMidWidth = screenWidth / 2;
            let screenMidHeight = screenHeight / 2;
            let relatedX = mouseX - screenMidWidth;   // 大于0则在屏幕右边，小于0则在屏幕左边
            let relatedY = mouseY - screenMidHeight;  // 大于0则在屏幕下边，小于0则在屏幕上边
            let relatedXRatio = relatedX / screenMidWidth;
            let relatedYRatio = relatedY / screenMidHeight;

            if (element instanceof HTMLElement) {
                element.style.transition = "0.3s";
                let skewX = (relatedXRatio / 10).toFixed(2);       // 调整精度
                let rotateX = (-relatedYRatio / 2).toFixed(2);     // 调整精度
                let rotateY = (relatedXRatio / 2).toFixed(2);      // 调整精度
                let translateX = (-relatedXRatio / 2).toFixed(2);  // 调整精度
                let translateY = (-relatedYRatio / 2).toFixed(2);  // 调整精度
                element.style.transform = "scale(1.05, 1.05) " +
                    "skew(" + skewX + "deg)" +
                    "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) " +
                    "translate(" + translateX + "%, " + translateY + "%)";
            }
        });
    }
}

// iOS端壁纸动态效果
export function iOSImageDynamicEffect (element) {
    DeviceOrientationEvent.requestPermission().then(function (status) {
        alert("3");
        if (status === "granted" && window.addEventListener) {
            window.addEventListener("deviceorientation", function (event) {
                // console.log(event.alpha, event.beta, event.gamma);
                let rotateX = (event.beta / 10).toFixed(2);       // 调整精度
                let rotateY = (-event.gamma / 10).toFixed(2);     // 调整精度
                let translateX = (-event.gamma / 10).toFixed(2);  // 调整精度
                let translateY = (event.beta / 10).toFixed(2);    // 调整精度

                element.style.transition = "0.3s";
                element.style.transform = "scale(1.05, 1.05) " +
                    // "rotateX(" + rotateY + "deg) rotateY(" + rotateX + "deg) " +
                    "translate(" + translateX + "%, " + translateY + "%)";
            });
        } else {
            alert("已拒绝权限");
        }
    }).catch(function (err) {
        alert("Error: " + err);
    })
}

// 国际化
export function getMessage(messageName) {
    return chrome.i18n.getMessage(messageName);
}
