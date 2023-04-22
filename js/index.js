function isSmartPhone(){
// UserAgentからのスマホ判定
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
        window.location.href = "sorry.html";
    }
}

window.addEventListener("load", function(){
    isSmartPhone();
});