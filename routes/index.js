/*
 * 生成一个路由实例来捕获主页的GET请求；
 * 导出整个路由，并在app.js中通过app.use('/', indexRouter)中加载；
 * 其实是可以直接在app.js中写的，这里是把路由分离了出来；
 * 当访问主页时，就会调用res.render('index', { title: 'Express' });
 * 渲染index.ejs模板并显示到浏览器；
 * 这里省去文件后缀，在一定程度上提供了方便，并不过度关注使用哪个模板，模板更改后，也只需调整一处设置。
 */

let express = require('express');
let router = express.Router();
let db = require('./pgHelper.js');

router.get('/', function(req, res) {
    db.keepLogin(req, res);
    res.render('index.ejs', { title: '光谷智慧交通',test: res.locals.islogin, promptinfo: ''});
});

router.route('/login')
    .get(function(req, res) {
        db.keepLogin(req, res);
        res.render('login.ejs', { title: 'Log In' ,test:res.locals.islogin, promptinfo: ' '});
    })
    .post(db.login);

router.get('/logout', function(req, res) {
      res.clearCookie('islogin');
      req.session.destroy();
      res.redirect('/');
});

router.route('/reg')
    .get(function(req,res){
      res.render('reg.ejs',{title:'Sign Up', promptinfo: ' '});
    })
    .post(db.register);

router.get('/notice', db.check_notice);

module.exports = router;