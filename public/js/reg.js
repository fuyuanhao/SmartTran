// 关于 用户 的事件
(function () {
    var userBox = document.getElementById("userBox");

    userBox.onclick = function () {
        document.querySelector(".container>.formLogin").style.display = "block";
        document.querySelector(".mapCon").style.filter = "blur(6px)";
    };
})();

// 关于 登录注册 的事件
(function () {
    var mapCon = document.querySelector(".mapCon");
    var formReg = document.querySelector(".formReg");
    var formLogin = document.querySelector(".formLogin");
    var loginFinish = formLogin.querySelector("ul>li.finish>button");
    var loginReg = formLogin.querySelector("ul>li.other>a:first-child");
    var loginQuit = formLogin.querySelector("ul>li.other>a:last-child");
    var regFinish = formReg.querySelector("ul>li.finish>button");
    var regLogin = formReg.querySelector("ul>li.other>a:first-child");
    var regQuit = formReg.querySelector("ul>li.other>a:last-child");

    // TODO 登录
    loginFinish.onclick = function () {};
    // TODO 马上注册
    loginReg.onclick = () => {
        formLogin.style.display = "none";
        formReg.style.display = "block";
    };
    formLogin.style.display = "none";
    formReg.style.display = "block";
    // TODO 不想注册
    loginQuit.onclick = () => {
        formLogin.style.display = "none";
        mapCon.style.filter = "";
    };
    // TODO 完成注册
    regFinish.onclick = function () {};
    // TODO 马上登录
    regLogin.onclick = () => {
        formReg.style.display = "none";
        formLogin.style.display = "block";
    };
    // TODO 不想登录
    regQuit.onclick = () => {
        formReg.style.display = "none";
        mapCon.style.filter = "";
    };

    // function quit() {
    //     this.parentElement.parentElement.parentElement.style.display = "none";
    //     document.querySelector(".mapCon").style.filter = "";
    //     return false;
    // }
})();