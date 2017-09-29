$(function() {

  var ua = navigator.userAgent;
  var sessionId = util.getSearch()['sessionId'] || '';
  var terminal = util.getSearch()['terminal'];
  var clear = util.getSearch()['clear'];
  var amId = util.getSearch()['am_id'] || '';
  var approach = util.getSearch()['approach'] || '';
  var approach2 = util.getSearch()['approach2'] || '';
  var approach3 = util.getSearch()['approach3'] || '';
  var shareInitPeople = util.getSearch()['userInitMsg'] || '';//获取镑客大使的手机号码
  var version = util.getSearch()['version'] || '';
  var isFromApp = false;
  if(terminal == 4 || terminal == 5 || window.WebViewJavascriptBridge) {
    isFromApp = true;
  }
  if(clear){
    localStorage.removeItem('jwt');
  }

  var isWeiXin = /micromessenger/.test(ua.toLowerCase());
  var tokenId = localStorage.getItem('tongdun_token');
  var clickSwitch = false;
  
  var newShare_link = window.location.href.replace('sessionId', 'instead1').replace('terminal','instead2').replace('version','instead3');
  if (isWeiXin) {
    wxShare();
  }


  var share_title = "金鸡一声吼 全民喜抖擞"; 
  var share_desc = "存管签署，鸡年安心投资！B轮揭晓，诺诺邀您共同见证！这个发财的链接您不点吗？"; //分享描述
  var share_link = newShare_link; //分享链接
  var share_icon = HOST + '/nono/spring2017/images/share-icon.jpg'; 
  
  var bridge = new Bridge();
  var gameSwitch = false;

  var toastr = {
    active: false,
    info: function(msg) {
      var _this = this;
      if (_this.active) {
        return;
      }
      _this.active = true;
      vm.toastrInfo = msg;
      setTimeout(function() {
        vm.toastrInfo = '';
        _this.active = false;
      }, 2000);
    }
  };

  var vm = new Vue({
    el: 'html',
    data: {
      toastrInfo: '',
      errorMessage:'',
      jumpDot:1,
      getOnePrize: undefined,
      isAnim:false,
      initFinshed: false,
      msgError:false,
      endActivity:0,
      bodyPop:true,
      // userJwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTg5NDU2ODEsImlhdCI6MTQ4MzA2MzA1OSwiZXhwIjoxNDgzMDY0ODU5fQ.KwK-qjfsHUBJYuSSOLk-Xv6-itAiVu5k7XzQtfegTtk',//判别用户是否登录 如果没有登录的话是undefined
      userJwt:undefined,
      userJwtRefresh:undefined,
      shaiziShowIndex: true,
      userState: 'new',
      isFromAppTrue: isFromApp,
      current: 1,
      isChose: false,
      isChose2:false,
      isOutShare: false,
      gloablIndex: 0,//默认时第一个开始闪亮的
      role: 0,
      isLogin: false,
      noSpoilList: false,//无奖品时的展示
      mySpoil: false,//获得的奖品开关
      getMyList: false,
      // new5:false,
      noTime:false,
      playCount:0,
      myInvestCount:0,
      userInfoMobile:undefined,
      countdown: {
        initTime:61,
        time: 61,
      },
      register:{
        show:false,
        captcha:undefined,
        getTel:undefined,
        getCap:undefined,
        getNum:undefined,
        sendAgain:false,
        isCurrentCap:false,
        currentInput:true,
        text:'立即查看点数',
      },
  
      gameArr:[
        {id:0,src:'images/01.png',bling:false,isChangeColor:1},
        {id:1,src:'images/02.png',bling:false,isChangeColor:1},
        {id:2,src:'images/03.png',bling:false,isChangeColor:1},
        {id:3,src:'images/04.png',bling:false,isChangeColor:1},
        {id:4,src:'images/05.png',bling:false,isChangeColor:1},
        {id:5,src:'images/06.png',bling:false,isChangeColor:1},
        {id:6,src:'images/07.png',bling:false,isChangeColor:1},
        {id:7,src:'images/08.png',bling:false,isChangeColor:1},
        {id:8,src:'images/09.png',bling:false,isChangeColor:1},
        {id:9,src:'images/10.png',bling:false,isChangeColor:1},
        {id:10,src:'images/11.png',bling:false,isChangeColor:1},
        {id:11,src:'images/05.png',bling:false,isChangeColor:1},
        {id:12,src:'images/13.png',bling:false,isChangeColor:1},
        {id:13,src:'images/14.png',bling:false,isChangeColor:1},
        {id:14,src:'images/15.png',bling:false,isChangeColor:1},
        {id:15,src:'images/05.png',bling:false,isChangeColor:1},
        {id:16,src:'images/17.png',bling:false,isChangeColor:1},
        {id:17,src:'images/09.png',bling:false,isChangeColor:1},
        {id:18,src:'images/19.png',bling:false,isChangeColor:1},
        {id:19,src:'images/20.png',bling:false,isChangeColor:1},
        {id:20,src:'images/05.png',bling:false,isChangeColor:1},
        {id:21,src:'images/22.png',bling:false,isChangeColor:1},
        {id:22,src:'images/23.png',bling:false,isChangeColor:1},
        {id:23,src:'images/500.png',bling:false,isChangeColor:1},
        {id:24,src:'images/25.png',bling:false,isChangeColor:1},
      ],
      winnerList:[],
      newYear: [],
      envoyList: [],
      inviteList: [],
      spoilArr: [],
    },

    methods: {
      getInitData:function(){
        var self = this;

        self.gameArr[self.gloablIndex].bling = true;
        if(sessionId){
          $.ajax({
            url:HOST + '/feserver/common/jwt/'+sessionId,
            success:function(res){
              if(res.succeed && res.data){
                vm.userJwt = res.data.jwt;
              }
              // 查询剩余次数
              vm.reviewLeaveTime('init');
              //获取登录用户的投资额
              vm.getInvest(vm.userJwt);
              // 获取登录用户的手机号绑定分享的镑客大使
              vm.getUserInfo();
              

            }
          });
        }
      },
      getModInfo: function(){
        // 各模块信息
        $.ajax({
          url: HOST + '/feserver/activity/nono-spring/plans',
          type: 'GET',
          success:function(res){
            vm.initFinshed = true;
            if(res.succeed && res.data){
                vm.newYear.push(res.data.xinke);
                vm.newYear.push(res.data.yueyuesheng);
                vm.newYear.push(1);
                vm.newYear.push(res.data.tiexin3);
                vm.newYear.push(res.data.tiexin6);
                vm.newYear.push(res.data.tiexin12);
            }
          }
        });
      },
      getBangInfo: function(){
        // 镑客大使
        $.ajax({
          url: HOST + '/feserver/activity/nono-spring/envoy',
          type: 'GET',
          success:function(res){
            vm.initFinshed = true;
            if(res.succeed && res.data){
              vm.envoyList = res.data.investRanking;//豪气榜
              vm.inviteList = res.data.inviteRanking;//人气榜
            }
            
          }
        });
      },
     
      initPop: function(){
        var self = this;
        // 将各个弹框需要初始化
        self.role = 0;
        self.isChose = false;
        self.isChose2 = false;
        self.isOutShare = false;//分享
        self.noSpoilList = false;//您的奖品在等待
        self.mySpoil = false;//摇完骰子获得的奖品
        self.getMyList = false;//奖品列表
        self.register.show = false;//注册页面
        self.noTime = false;//么有游戏次数的提示
        // self.new5 = false;//新用户5元现金的提示
        self.register.captcha = '';
        self.register.getTel = '';
        self.register.getCap = '';
        self.register.getNum = '';
        self.register.sendAgain = false;
        self.register.isCurrentCap = false;
        self.register.currentInput = true;
      
      },
      getInvest:function(jwtValue){
        //获取当前用户的投资额信息
        $.ajax({
          url: HOST + '/feserver/activity/nono-spring/annual',
          type: 'GET',
          headers: {jwt:jwtValue},
          success:function(res){
            if(res.succeed && res.data){
              vm.myInvestCount = res.data.amount;
            }
          },
        });
      },
      
      goCash: function () {
        if(!isFromApp){
          window.location.href = 'https://m.nonobank.com/nono/land-page/download.html';
        }
        
      },
      refreshJwt: function(userJwtRefreshed){
        var self = this;
        var userJwtR = !self.userJwtRefresh?userJwtRefreshed:self.userJwtRefresh; 
        $.ajax({
          url: HOST + '/feserver/common/refresh-jwt/'+userJwtR,
          type: 'get',
          success: function(res){
            self.userJwt = res.data.jwt;
            //如果不在app内并且有缓存的话就去请求初始化的数据
            if(getJwt){
              vm.getInvest(self.userJwt);
              // 查询剩余次数
              vm.reviewLeaveTime('init');
            }
          }
        })
      },
      
      jumpType:function(num){
        var self = this;
        var y = 0;
        var time = setInterval(function(){
          y++;
          var cur = self.gloablIndex + y;
          if(y === num){//最后需要加当前全局index改变
            self.gloablIndex += num; 
            // 闪闪的效果
            self.gameArr[self.gloablIndex].isChangeColor = 2;
            setTimeout(function(){
              self.gameArr[self.gloablIndex].isChangeColor = 3;
              setTimeout(function(){
                self.gameArr[self.gloablIndex].isChangeColor = 1;
              },150);
            },150);
            
             setTimeout(function(){
              gameSwitch = false;// 放开点击
              //鞭炮播放
              if(self.gloablIndex == 4 || self.gloablIndex == 11 || self.gloablIndex == 15 || self.gloablIndex == 20){//鞭炮播放
                var audio = document.getElementById("bang_music");
                audio.play();
                self.gameArr[self.gloablIndex].isChangeColor = 1;
                return;
              }
              vm.initPop();
              self.isChose = true;
              self.mySpoil = true;//获得了什么奖品
             },350);
             
          }
          if(y>num){
            return;
          }
          $('.t').removeClass('active');
          if(cur > 24){
            cur = 24;
          }
         $('.t').eq(cur).addClass('active');
        },800);
      },
      hidePop: function (argument) {
        var self = this;
        gameSwitch = false;//点过猛层的关闭之后可以再次点击游戏
        if(!self.userJwt || self.playCount == 0){
          self.shaiziShowIndex = true;
        }
        self.isChose = false;
        self.isChose2 = false;
      },
      startGame: function (argument) {
        var audio = document.getElementById("bang_music");//ios9之后的safia浏览器需要load一下才可以播放
        audio.load();
        _czc.push(["_trackEvent", "落地页", "点击", "骰子", "", ""]);
        var self = this;
        $('.hand-move').removeClass('rota');
        $.ajax({
          url: HOST + '/feserver/activity/nono-spring/activity-date',
          type:'GET',
          success:function(res){
            if(res.succeed && res.data){
              if(res.data.sysDate > res.data.endDate){
                self.endActivity = 1;
                toastr.info('活动已经结束啦');
                return;
              }
              if(res.data.sysDate < res.data.startDate){
                self.endActivity = 2;
                toastr.info('活动还未开始哦');
                return;
              }
              if(gameSwitch){
                return;
              }
              self.isAnim = true;
              gameSwitch = true;
              self.shaiziShowIndex = false;//立体骰子消失
              setTimeout(function(){
                // self.userJwt = '3434443';
                // 开始判断了啊 
                if(!self.userJwt){// app内和外没有登录的时候都需要登录页面
                    vm.initPop();
                    self.isAnim = false;
                    self.isChose = true;
                    self.register.show = true;//注册页面打开
                    $.ajax({
                      url: HOST + '/feserver/common/captcha', 
                      type: 'GET',
                      dataType: 'json',
                      success: function(res) {
                        if(res.succeed && res.data){
                          self.register.captUuid = res.data.uuid;
                          self.register.captcha = res.data.captcha;
                        }
                      }
                    })
                  
                }else{
                  vm.reviewLeaveTime();
                }
              },1500);
            }else{
              toastr.info('服务器君已离家出走！');
            }
            
          },
          error:function(){
            toastr.info('服务器君已离家出走！');
          }
        })
        
      },
       // 查看当前剩余次数
      reviewLeaveTime: function(type){
        var self = this;
        $.ajax({
            url: HOST + '/feserver/activity/nono-spring/raffle-times',
            type: 'GET',
            headers: {jwt:self.userJwt},
            success: function(res){
              if(!res.succeed){
                self.isAnim = false;
                toastr.info(res.errorMessage);
                return;
              }
              self.gameArr[self.gloablIndex].bling = false;//拿到正确的步数后将之前的点亮去掉
              self.playCount = res.data.raffleTimes;
              self.gloablIndex = res.data.currentStep;
              self.gameArr[self.gloablIndex].bling = true;
              if(type == 'init')return;//因为初始化的查询不需要调成功之后的查看点数所以return
              if(self.playCount == 0){
                self.isAnim = false;
                vm.initPop();
                self.isChose = true;
                self.noTime = true;
                return;
              }
              self.playCount--;
              if(self.playCount < 0){
                self.playCount = 0;
              }
              vm.seeDotTime(self.userJwt);
            },
            error:function(){
              self.isAnim = false;
              gameSwitch = false;// 放开点击
              toastr.info('网络异常，请稍候再试吧！');
            }
          })
      },
      // 立即查看点数
      seeDotTime:function(jwtValue){
        var self = this;
        $.ajax({
          url: HOST + '/feserver/activity/nono-spring/raffle',
          data: {
            step: self.gloablIndex,
          },
          type: 'POST',
          dataType: 'json',
          headers:{jwt:jwtValue},
          success: function(res){
            if(res.errorCode == '7010103'){//无可用点数
              self.isAnim = false;
                vm.initPop();
                self.isChose = true;
                self.noTime = true;
                self.shaiziShowIndex = true;
                return;
            }
            if(!res.succeed){
              self.isAnim = false;
              toastr.info(res.errorMessage);
              return;
            }
            vm.getOnePrize = res. data.prize;
            self.isAnim = false;
            if(!isNaN(res.data.raffleStep)){
              self.jumpDot = res.data.raffleStep;
            }
            setTimeout(function(){
              vm.jumpType(self.jumpDot);
            },300);
          },
          error:function(){
            self.isAnim = false;
            gameSwitch = false;// 放开点击
            toastr.info('网络异常，请稍候再试吧！');
          }
        })
      },
      loseBlur: function(){
         var _this = this;
        if (!_this.register.getTel) {
          toastr.info('请先输入手机号');
          return false;
        }
        if (!/^1\d{10}/.test(_this.register.getTel)) {
          toastr.info('手机号码格式不正确');
          return false;
        }
        var req = /1[345789]\d{9}$/;
        if(!req.test(_this.register.getTel)){
          toastr.info('手机号不合法');
          return false;
        }
        vm.checkUser();
      },
      // 检查是否是新用户
      checkUser: function(num){
        var _this = this;
        var params = {
          type: "mobile",
          value: _this.register.getTel
        };
        $.ajax({
            url: HOST + '/feserver/common/check/'+'mobile'+'/'+_this.register.getTel, 
            dataType: 'json',
            success: function(res) {
              if(res.data.exists === 1){
                _this.userState = 'old';
              }
              if(num == 1){//验证码发送失败之后再次发送一遍验证码
                vm.sendMsgAgain();
              }
            }
          });
      },
      sendMsgAgain:function(){
        var self = this;
        var params = {
          mobile: self.register.getTel,
          captcha: self.register.getCap,  
          uuid: self.register.captUuid,
          tokenId: tokenId,
          codeType: self.userState == 'old'?1:0,
        };
        self.register.sendAgain = false;
        // 发送短信验证码用
        $.ajax({
          url: HOST + '/feserver/user/v-code',
          type: 'post',
          data: params,
          dataType: 'json',
          success: function(res){
            if(!res.succeed){
              self.msgError = true;
              setTimeout(function(){
                toastr.info(res.errorMessage);
              },2000);
              return;
            }
            // 显示手机验证码
            self.register.isCurrentCap = true;
            startCountDown();
            function startCountDown() {
                self.countdown.time--;
                if (self.countdown.time >= 0) {
                  self.register.sendAgain = false;
                  setTimeout(startCountDown, 1000);
                } else {
                  self.register.sendAgain = true;
                  self.countdown.time = self.countdown.initTime;
                }
            }
          },
          error:function(){
              toastr.info('网络异常，请稍候再试吧！');
            }
        })
      },
      validateSafeCode: function() {
        var self = this;
        if (!/^1\d{10}/.test(self.register.getTel)) {
          toastr.info('手机号码格式不正确');
          return false;
        }
        if (!self.register.getCap) {
          toastr.info('请输入验证码');
          return;
        }
        var sendData = {
          captcha: self.register.getCap,  
          uuid: self.register.captUuid,
        };

        $.ajax({
          url: HOST + '/feserver/common/captcha/verify',
          type: 'get',
          data: sendData,
          dataType: 'json',
          success:function(res){
            if(!res.data.valid){
              setTimeout(function(){
                toastr.info('请输入正确的验证码');
              },2000);
            }else{
              vm.sendMsgAgain();
            }
          },
          error:function(){
              toastr.info('网络异常，请稍候再试吧！');
            }
        })

      },

      // 立即查看点数
      submitCount: function(){
        var self = this;
        if (!self.register.getTel) {
          toastr.info('请输入手机号');
          return false;
        }
        if (!/^1\d{10}/.test(self.register.getTel)) {
          toastr.info('手机号码格式不正确');
          return false;
        }
        if (!self.register.getCap) {
          toastr.info('请输入验证码');
          return;
        }
        if (!self.register.getNum) {
          toastr.info('请输入短信验证码');
          return;
        }
        if(clickSwitch)return;
        if(!clickSwitch){
           _czc.push(["_trackEvent", "落地页", "点击", "登录", "", ""]);
           self.register.text = '查看中...',
          clickSwitch = true;
          // 老用户登录校验 
          if(self.userState == 'old'){
            var params = {
              loginType: 1,
              username: self.register.getTel,
              tokenId: tokenId,
              vcode: self.register.getNum,
              uuid: self.register.captUuid,
              captcha: self.register.getCap
            };
            $.ajax({
              url: HOST + '/feserver/user/login',
              type: 'post',
              data: params,
              dataType: 'json',
              success:function(res){
                self.register.text = '立即查看点数',
                clickSwitch = false;//防止点击两次
                if(!res.succeed){
                  toastr.info(res.errorMessage);
                  return;
                }else{//登录成功
                  vm.isChose = false;
                  vm.register.show = false;
                  self.userJwt = res.data.jwt;
                  self.userJwtRefresh = res.data.refresh;
                  if(!isFromApp){
                    localStorage.setItem('jwt',res.data.refresh);
                  }
                  if(share_link.indexOf('userInitMsg') == -1){
                    share_link = share_link + '&userInitMsg='+self.register.getTel;//再app内弹框注册或者登录之后的分享也要带上镑客信息
                  }else{
                    var num = share_link.indexOf('userInitMsg');
                    share_link = share_link.substring(0,num);
                    share_link = share_link + 'userInitMsg='+self.register.getTel;//再app内弹框注册或者登录之后的分享也要带上镑客信息
                    // alert('登录成功德链接：'+share_link);
                    if (isWeiXin) {
                       wxShare();
                    }
                  }
                  vm.reviewLeaveTime();
                  vm.getInvest(self.userJwt);
                  // vm.seeDotTime(self.userJwt);
                }
              },
              error:function(){
                 self.register.text = '立即查看点数',
                clickSwitch = false;//防止点击两次
                toastr.info('网络繁忙，请稍后再试！');
                return;
              }
            })
          }else{//新用户注册接口
            var _par = {
              vcode: self.register.getNum,
              uuid: self.register.captUuid,
              captcha: self.register.getCap,
              mobile: self.register.getTel,
              tokenId: tokenId,
              landingPage: window.location.url,
              inviteMobile: shareInitPeople,
              amId: amId,
              approach: approach,
              approach2: approach2,
              approach3: approach3,
            };
            $.ajax({
              url: HOST + '/feserver/user/register',
              type: 'post',
              data: _par,
              dataType: 'json',
              success:function(res){
                self.register.text = '立即查看点数',
                clickSwitch = false;//防止点击两次
                if(!res.succeed){
                  toastr.info(res.errorMessage);
                  return;
                }else{//注册成功
                  vm.isChose = false;
                  vm.register.show = false;
                  self.userJwt = res.data.jwt;
                  self.userJwtRefresh = res.data.refresh;
                  if(!isFromApp){
                    localStorage.setItem('jwt',res.data.refresh);
                  }
                  if(share_link.indexOf('userInitMsg') == -1){
                    share_link = share_link + '&userInitMsg='+self.register.getTel;//再app内弹框注册或者登录之后的分享也要带上镑客信息
                  }else{
                    var num = share_link.indexOf('userInitMsg');
                    share_link = share_link.substring(0,num);
                    share_link = share_link + 'userInitMsg='+self.register.getTel;//再app内弹框注册或者登录之后的分享也要带上镑客信息
                    if (isWeiXin) {
                       wxShare();
                    }
                  }
                  vm.reviewLeaveTime();
                  vm.getInvest(self.userJwt);
                }
              },
              error:function(){
                self.register.text = '立即查看点数',
                clickSwitch = false;//防止点击两次
                toastr.info('网络繁忙，请稍后再试！');
              }
            })
          }
        }
      },
      goAppSet: function(item,index){

        var title,type = 1;
        switch(parseInt(index)){
          case 0:
            title = '新客专享';
            break;
          case 1:
            title = '月月升';
            type = 6;
            break;
          case 2:
            title = '诺诺盈';
            break;
          case 3:
            title = '贴心3月';
            break;
          case 4:
            title = '贴心6月';
            break;
          case 5:
            title = '贴心12月';
            break;
        };
        _czc.push(["_trackEvent", "落地页", "点击", title, "", ""]);

        if(isFromApp){
          if(version >= '5.0.0'){
            type = item.scope;
          }
          if(version < '5.0.0' && (index == 2 || (index == 1 && terminal == 4)) ) {//诺诺盈的老版本和ios的月月升是跳到首页
              bridge.send({
               type: 'pageSwitch', 
               data: {
                  name: 'index' 
                }
              });
              return;
          }

          if(index == 2){//新版本的和老版本的其它都是跳到诺诺盈的列表
            bridge.send({
             type: 'pageSwitch',  
             data: {
                name: 'nny',
             }
            });
          return;
          }
          bridge.send({
           type: 'productDetail',  
           data: {
              fp_id: item.id,
              fp_title: item.title,
              fp_type: type
           }
          });
        }
      },
      checkMyList: function(){
        var self = this;
        $.ajax({
          url: HOST + '/feserver/activity/nono-spring/raffle-prizes',
          headers: {jwt:self.userJwt},
          type: 'GET',
          success: function(res){
            if(!res.succeed){
              toastr.info(res.errorMessage);
              return;
            }
            self.initPop();
            self.isChose = true;
            if(res.data && res.data.length > 0){
              self.getMyList = true;//有奖品显示奖品列表
              vm.spoilArr = res.data;
            }else{
              self.noSpoilList = true;
            }
          },
          error:function(){
              toastr.info('网络异常，请稍候再试吧！');
            }
        })
      },
      // 查看奖品时
      seeList: function (){
        var self = this;
        _czc.push(["_trackEvent", "落地页", "点击", "我的奖品", "", ""]);
        if(vm.userJwt){
          vm.checkMyList();
        }else{
          if(isFromApp){
             bridge.send({
              type: 'login',
              url: window.location.href
            });
          }else{
            vm.initPop();
            self.isChose = true;
            self.noSpoilList = true;
          }
        }
        
      },
      changeTab: function (type){
        var self = this;
        self.current = type;
        vm.getTop20(type);

      },
      getTop20:function(type){
        if(type == 1){
          _czc.push(["_trackEvent", "落地页", "点击", "年化排行榜-第一个tab", "", ""]);
        }else{
          _czc.push(["_trackEvent", "落地页", "点击", "年化排行榜-第二个tab", "", ""]);
        }
        var self = this;
        //聚豪榜
        $.ajax({
          url: HOST + '/feserver/activity/nono-spring/ranking',
          type: 'GET',
          data: {period:type},
          success:function(res){
            if(res.succeed && res.data){
              vm.winnerList = res.data;
            }
          }
        });
      },
      showRole: function (type){
        var self = this;
        self.initPop();
        self.isChose2 = true;
        if(type == 1){
          self.role = 1;
          return;
        }
        type == 2?self.role=2:self.role=3;
      },
      // 查看投资额
      seeInvestMent: function (){
        if(isFromApp && !vm.userJwt){
          bridge.send({
              type: 'login',
              url: window.location.href
            });
        }
        
      },
      startDownLoad: function (){
        if(!isFromApp){
          
          _czc.push(["_trackEvent", "落地页", "点击", "打开app", "", ""]);
          window.location.href = 'https://m.nonobank.com/nono/land-page/download.html';
        }
      },

      // 去投资
      goInvest: function(){
        if(isFromApp){
            //去app首页
            bridge.send({
             type: 'pageSwitch',  
             data: {
                name: 'index' 
              }
            });
            return;
        }
        window.location.href = 'https://m.nonobank.com/nono/land-page/download.html';
      },
      
      share: function(type) {
        if(type == 1){
          _czc.push(["_trackEvent", "落地页", "点击", "分享（邀好友一起赚）", "", ""]);
        }
        var self = this;
        if(isFromApp){
          if(self.userJwt){
            var shareData = {
              'share_title': share_title,
              'share_desc': share_desc,
              'share_url': share_link,
              'share_icon': share_icon,
            };
            bridge.send({
              type: 'share',
              data: shareData
            },shareSuccess);
          }else{
            bridge.send({
                type: 'login',
                url: window.location.href
              });
          }
          return;
        }
        vm.initPop();
        setTimeout(function(){
          self.isChose = true;
          self.isOutShare = true;
        },400);
        
      },

      goDownload: function() {
        _czc.push(["_trackEvent", "落地页", "点击", "下载app", "", ""]);
        window.location.href = 'https://m.nonobank.com/nono/land-page/download.html';
      },
      //获取用户基本信息
      getUserInfo:function(){
        var self = this;
        $.ajax({
          url: HOST + '/feserver/user/info',
          type:'GET',
          headers: {jwt:self.userJwt},
          success:function(res){
            if(res.succeed && res.data){
              self.userInfoMobile = res.data.mobile;
              share_link = share_link + '&userInitMsg='+self.userInfoMobile;//分享带上分享人的信息
            }
            
          }
        })
      },
      
    }
  });

  vm.getInitData();
  vm.getTop20(1);
  //5分钟后刷新聚豪榜
  setTimeout(function(){
    vm.getTop20(1);
  },300000);
  var getJwt = localStorage.getItem('jwt');
  if(getJwt !== null && !isFromApp){
    vm.refreshJwt(getJwt);
  }
  //各模块信息
  vm.getModInfo();
  // 镑客大使排行榜
  vm.getBangInfo();
  //输入无效的手机号码之后要去监听
  vm.$watch('register.getTel', function(newVal, oldVal) {
    if (newVal != oldVal && newVal && newVal.length == 11 && vm.msgError) {
      vm.checkUser(1);
    }
  });
  vm.$watch('register.getCap', function(newVal, oldVal) {
    if (newVal != oldVal && newVal && newVal.length == 4) {
      toastr.info('请耐心等待短信验证码哦！');
      vm.validateSafeCode();
    }
  });
  vm.$watch('register.getNum', function(newVal, oldVal) {
      if (newVal != oldVal && newVal && newVal.length == 6) {
        vm.register.currentInput = false;//显示查看点数按钮
    }
  });
  vm.$watch('isChose', function(newVal, oldVal) {
    if (newVal) {
      vm.bodyPop = false;//禁止body滚动
    }else{
      vm.bodyPop = true;
    }
  });
  // 短信验证码粘贴是事件
  vm.$watch('register.isCurrentCap', function(newVal, oldVal) {
      if (newVal) {
        var pasteEle = document.getElementById('numberPh');
        pasteEle.addEventListener("paste", function (event){
          var elm = document.getElementById('numberPh');
          var elmLength = elm.innerHTML.length;
          if(elm.setSelectionRange) {
              elm.setSelectionRange(elmLength, elmLength);
              elm.focus();
          }
          if ( event.clipboardData || event.originalEvent ) {
              var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
              if ( clipboardData.items ) {
                  //for chrome
                  setTimeout(function () {
                  vm.$watch('register.getNum', function(newVal, oldVal) {
                    if(newVal != oldVal && newVal && newVal.length == 6) {
                      vm.register.currentInput = false;//显示查看点数按钮
                    }
                  });

                  }, 10);
              } 
          }
        });
      }
    });
    
  // 弹框开始时禁止页面滚动
  document.addEventListener("touchmove",function(e){
  if(vm.isChose && !vm.getMyList){
    e.preventDefault();
    e.stopPropagation();
    }
  },false);

  function wxShare() {
    var href = window.location.href;
    $.ajax({
      url: HOST + '/feserver/wechat/signature',
      type: 'POST',
      dataType: 'json',
      data: {
        url: href,
        type: /m.nonobank.com/.test(HOST) ? 'nonobank' : 'congcong'
      },
      success: function(res) {
        if (res.errcode) {
          return;
        }

        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.appId, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名，见附录1
          jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.error(function(res) {
        });

        wx.ready(function() {
          // alert(share_link);
          //朋友圈
          wx.onMenuShareTimeline({
            title: share_title, // 分享标题
            desc: share_desc, // 分享描述
            link: share_link, // 分享链接
            imgUrl: share_icon, // 分享图标
            success: function() {

              // 用户确认分享后执行的回调函数
              // shareSuccess();
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });
          //好友
          wx.onMenuShareAppMessage({
            title: share_title, // 分享标题
            desc: share_desc, // 分享描述
            link: share_link, // 分享链接
            imgUrl: share_icon, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
              // alert(share_link)// 用户确认分享后执行的回调函数
              // shareSuccess();
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });
          //QQ
          wx.onMenuShareQQ({
            title: share_title, // 分享标题
            desc: share_desc, // 分享描述
            link: share_link, // 分享链接
            imgUrl: share_icon, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
              // alert(1)// 用户确认分享后执行的回调函数
            },
            cancel: function() {
            }
          });
          //空间
          wx.onMenuShareQZone({
            title: share_title, // 分享标题
            desc: share_desc, // 分享描述
            link: share_link, // 分享链接
            imgUrl: share_icon, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
              // alert(1)// 用户确认分享后执行的回调函数
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });

        });
      },
      error: function(res) {}
    });
  }
  function shareSuccess() {
     $.ajax({
      url: HOST + '/feserver/activity/nono-spring/raffle-times',
      type: 'POST',
      headers: {jwt:vm.userJwt},
      success:function(res){
        vm.reviewLeaveTime('init');
      }
     })
  }
})
