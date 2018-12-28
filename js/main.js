/**
 * @author:洪泽权
 * @timer:2018-12-12
 * @email:625594687@qq.com
 * @version:2.0
 * @title:前端工程师个人网站
 * @note:
 */
;
(function(window, document, $) {
	var isfirst=true; //用来判断是否是第一次加载
      //存储模块数据
  var navArr=[{name:'#banner', scrollTop:0, }, {name:'#aboutMe', scrollTop:0, }, {name:'#mySkills', scrollTop:0, }, {name:'#myPortfolio', scrollTop:0, }, {name:'#message', scrollTop:0, } ];
  // 案例demo组
  var demoArr=[
      {
        name:'swws',
        imgUrl:[
          'https://image.sumaotong.com/258com/20181218/cd39dcbcbf12e59c630ccb0d94c10b20.png',
          'https://image.sumaotong.com/258com/20181218/ca966f6197296766365bdab075b37665.png',
          'https://image.sumaotong.com/258com/20181218/cd39dcbcbf12e59c630ccb0d94c10b20.png',
        ]
      },
      {
        name:'smt',
        imgUrl:[
          'https://image.sumaotong.com/258com/20181218/bc32c268ac34d70e463a6dd998f5fc93.png',
          'https://image.sumaotong.com/258com/20181218/db74894d06af7e065198a2f4efad0270.png',
          'https://image.sumaotong.com/258com/20181218/636a7fb2d5380cb127a9b73c23d766a5.png',
        ]
      }
    ];
    var mySwiper;

    window.utils = {
        /**s
         * 获得浏览器参数信息
         * width 浏览器宽度
         * height 浏览器高度
         * userAgent 因项目原因考虑，定义大于870尺寸为pc端,反之移动端
         * ie 如果是ie的话，为ie的版本号
         * limit 针对ie低版本进行兼容样式设置
         * navTop 用于计算导航菜单交互距离
         * 使用方法window.utils.getWindowInfo()
         */
        getWindowInfo: function() {
            var info = {
                width: window.innerWidth,
                height: window.innerHeight,
                userAgent: window.innerWidth > 870 ? 'pc' : 'm',
                ie: this.IEVersion(),
                limit: 7 >= this.IEVersion() > 10 ? true : false,
                navTop:$('#aboutMe').offset().top-60,
            };
            return info;
        },
        /**
         * 判断是否是IE浏览器，包括Edge浏览器
         */
        IEVersion: function() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE浏览器
            var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 7) {
                    return "7";
                } else if (fIEVersion == 8) {
                    return "8";
                } else if (fIEVersion == 9) {
                    return "9";
                } else if (fIEVersion == 10) {
                    return "10";
                } else if (fIEVersion == 11) {
                    return "11";
                } else {
                    return "0"
                } //IE版本过低
            } else if (isEdge) {
                return "Edge";
            } else {
                return "-1"; //非IE
            }
        },
    }
    ///////////////////////////////////////部分原型的扩展js结束//////////////////////////////////////

    $.extend({
        /**
         * 初始化
         */
        init: function() {
        	prin(); //打印
        	initCanvas(); //粒子效果
        	setBannerHeight(); //初始化banner高度

        },
        /**
         * 页面滚动到指定位置js
         */
        goTop:function(obj){
        	if(obj){
        		var top=$(obj).offset().top-60;
        		$('body,html').stop(true, true).animate({ scrollTop: top }, 300);
        	}else{
        		$('body,html').stop(true, true).animate({ scrollTop: 0 }, 300);
        	}
        },
        /**
         * 查看案例
         */
         demo:function(obj){
          var type=$(obj).attr('data-type');
          /**
          *  查看界面Swiper弹窗
          */
            mySwiper= new Swiper ('#portfolioBanner .swiper-container', {
                // loop: true,
                // autoHeight: true, //高度随内容变化
                paginationType : 'fraction',
                // 如果需要前进后退按钮
                nextButton: '#portfolioBanner .swiper-button-next',
                prevButton: '#portfolioBanner .swiper-button-prev',
                onSlideChangeEnd: function(swiper){ 
                     mySwiper.update();
                }  
            });
            for (var i = 0; i < demoArr.length; i++) {
              if(type==demoArr[i].name){
                  for (var d = 0; d < demoArr[i].imgUrl.length; d++) {
                      mySwiper.appendSlide('<div class="swiper-slide"><img src='+demoArr[i].imgUrl[d]+'></div>');
                  }
              }
            };
            $('#portfolioBanner').show('400', function() {
                mySwiper.update();
                if(window.utils.getWindowInfo().userAgent=='m'){
                   ModalHelper.afterOpen();
                }

            });
         },
        /**
         * 关闭弹窗
         */
        closeModal:function(obj){
           $(obj).parent().fadeOut('400', function() {
              mySwiper.removeAllSlides(); //移除全部
              mySwiper.updatePagination();
              if(window.utils.getWindowInfo().userAgent=='m'){
                   ModalHelper.beforeClose();
                }
           });
        },

    });

    ///////////////////////////////////////jQ扩展方法js结束////////////////////////////////////// 

    ///////////////////////////////////////模块js 开始//////////////////////////////////////
    /**
  	* 控制台打印配置
  	*/
   	function prin(){
   		console.log("%c ---本网站不支持ie8及以下浏览器打开---","color:red"); 
   		if(window.utils.IEVersion()!='-1'){
   			if(window.confirm("当前为IE浏览器,为了效果体验，不支持打开")){
   				window.close();
   			}
   		}
   	};
    /**
  	* 计算banner高度
  	*/
    function setBannerHeight(){
        $('#banner').height(window.utils.getWindowInfo().height);
    };
    /**
  	* 粒子线条背景
  	* 移动端点的条数为50个，避免密集
  	*/
  	function initCanvas(){
  		var defaults={
				dom:'J_dotLine',//画布id
				cw:window.utils.getWindowInfo().width,//画布宽
				ch:window.utils.getWindowInfo().height,//画布高
				ds:100,//点的个数
				r:0.5,//圆点半径
				cl:'#aaa',//粒子线颜色
				dis:100//触发连线的距离
		};
  		if(window.utils.getWindowInfo().userAgent=='m'){
	  			var options={
	  				ds:50,//点的个数
	  			};
	  			$.extend(defaults, options);
  		}
  		var dotline = new Dotline(defaults).start();
  	};
  	/**
  	* 我的技能里进行赋值进度
  	*/
  	function setNum(){
  		var bar=$('#skills .bar-box');
  		var arrSKill=bar.find('span');
  		for (var i = 0; i < arrSKill.length; i++) {
  			$(arrSKill[i]).siblings().find('i').css('width',$(arrSKill[i]).html());
  		};
  	};
  	/**
  	*  性别选择
  	*  当点击单选按钮时触发
  	*/
  	$('.ui-checkbox li').on('click',function(){
  		/* Act on the event */
  		$(this).find('input').attr('checked','checked');
  		$(this).siblings().find('input').removeAttr('checked');
  	});
  	/**
  	*  导航菜单滚动到指定位置进行变色
  	*/
  	$(window).scroll(function(event){
  		var winTop = $(window).scrollTop();
  		if(winTop>=window.utils.getWindowInfo().navTop){
  			$('#header').addClass('on');
  			if(window.utils.getWindowInfo().userAgent=='m'){
  				$('.copyRight .goTop').addClass('on');
  			}
  		}else{
  			$('#header').removeClass('on')
  			if(window.utils.getWindowInfo().userAgent=='m'){
  				$('.copyRight .goTop').removeClass('on');
  			}
  		}
  		// 我的技能滚动到位置才进行数据显示效果
  		if(winTop>=$('#mySkills .font-box').offset().top-window.utils.getWindowInfo().height/2){
        	setNum() //滚动到才加载
  		}
  		setNavCur(winTop)
    });

  	/**
  	*  根据滚动距离计算nav样式
  	*/
    function setNavCur(top){
    	// 判断是否是第一次加载，避免重复计算获取值 距离顶部的值
    	if(isfirst){
	    	for (var i = 0; i < navArr.length; i++) {
	    		navArr[i].scrollTop=parseInt($(navArr[i].name).offset().top);
	    	}
	    	isfirst=false;
    	};
    	for (var i = 0; i < navArr.length; i++) {
    		if(top>=navArr[i].scrollTop-60){
    			$('#header ul li').eq(i).addClass('cur').siblings().removeClass('cur');
    		}
    	}
    };
   


    ///////////////////////////////////////模块js 结束////////////////////////////////////// 
})(window, document, $);



// 粒子线条Js
;(function(window){
			function Dotline(option){
				this.opt = this.extend({
					dom:'J_dotLine',//画布id
					cw:1000,//画布宽
					ch:500,//画布高
					ds:100,//点的个数
					r:0.5,//圆点半径
					cl:'#000',//颜色
					dis:100//触发连线的距离
				},option);
				this.c = document.getElementById(this.opt.dom);//canvas元素id
				this.ctx = this.c.getContext('2d');
				this.c.width = this.opt.cw;//canvas宽
				this.c.height = this.opt.ch;//canvas高
				this.dotSum = this.opt.ds;//点的数量
				this.radius = this.opt.r;//圆点的半径
				this.disMax = this.opt.dis*this.opt.dis;//点与点触发连线的间距
				this.color = this.color2rgb(this.opt.cl);//设置粒子线颜色
				this.dots = [];
				//requestAnimationFrame控制canvas动画
				var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
				            window.setTimeout(callback, 1000 / 60);
				        };
				var _self = this;
				//增加鼠标效果
				var mousedot = {x:null,y:null,label:'mouse'};
				this.c.onmousemove = function(e){
					var e = e || window.event;
					mousedot.x = e.clientX - _self.c.offsetLeft;
					mousedot.y = e.clientY - _self.c.offsetTop;
				};
				this.c.onmouseout = function(e){
					mousedot.x = null;
					mousedot.y = null;
				}
				//控制动画
				this.animate = function(){
					_self.ctx.clearRect(0, 0, _self.c.width, _self.c.height);
					_self.drawLine([mousedot].concat(_self.dots));
					RAF(_self.animate);
				};
			}
			//合并配置项，es6直接使用obj.assign();
			Dotline.prototype.extend = function(o,e){
				for(var key in e){
					if(e[key]){
						o[key]=e[key]
					}
				}
				return o;
			};
			//设置线条颜色(参考{抄袭}张鑫旭大大，http://www.zhangxinxu.com/wordpress/2010/03/javascript-hex-rgb-hsl-color-convert/)
			Dotline.prototype.color2rgb = function(colorStr){
				var red = null,
					green = null,
					blue = null;
				var cstr = colorStr.toLowerCase();//变小写
				var cReg = /^#[0-9a-fA-F]{3,6}$/;//确定是16进制颜色码
				if(cstr&&cReg.test(cstr)){
					if(cstr.length==4){
						var cstrnew = '#';
						for(var i=1;i<4;i++){
							cstrnew += cstr.slice(i,i+1).concat(cstr.slice(i,i+1));
						}
						cstr = cstrnew;
					}
					red = parseInt('0x'+cstr.slice(1,3));
					green = parseInt('0x'+cstr.slice(3,5));
					blue = parseInt('0x'+cstr.slice(5,7));
				}
				return red+','+green+','+blue;
			}
			//画点
			Dotline.prototype.addDots = function(){
				var dot;
				for(var i=0; i<this.dotSum; i++){//参数
					dot = {
						x : Math.floor(Math.random()*this.c.width)-this.radius,
						y : Math.floor(Math.random()*this.c.height)-this.radius,
						ax : (Math.random() * 2 - 1) / 1.5,
						ay : (Math.random() * 2 - 1) / 1.5
					}
					this.dots.push(dot);
				}
			};
			//点运动
			Dotline.prototype.move = function(dot){
				dot.x += dot.ax;
				dot.y += dot.ay;
				//点碰到边缘返回
				dot.ax *= (dot.x>(this.c.width-this.radius)||dot.x<this.radius)?-1:1;
				dot.ay *= (dot.y>(this.c.height-this.radius)||dot.y<this.radius)?-1:1;
				//绘制点
				this.ctx.beginPath();
				this.ctx.arc(dot.x, dot.y, this.radius, 0, Math.PI*2, true);
				this.ctx.stroke();
			};
			//点之间画线
			Dotline.prototype.drawLine = function(dots){
				var nowDot;
				var _that = this;
				//自己的思路：遍历两次所有的点，比较点之间的距离，函数的触发放在animate里
				this.dots.forEach(function(dot){
					
					_that.move(dot);
					for(var j=0; j<dots.length; j++){
						nowDot = dots[j];
						if(nowDot===dot||nowDot.x===null||nowDot.y===null) continue;//continue跳出当前循环开始新的循环
						var dx = dot.x - nowDot.x,//别的点坐标减当前点坐标
							dy = dot.y - nowDot.y;
						var dc = dx*dx + dy*dy;
						if(Math.sqrt(dc)>Math.sqrt(_that.disMax)) continue;
						// 如果是鼠标，则让粒子向鼠标的位置移动
						if (nowDot.label && Math.sqrt(dc) >Math.sqrt(_that.disMax)/2) {
							dot.x -= dx * 0.02;
							dot.y -= dy * 0.02;
						}
						var ratio;
						ratio = (_that.disMax - dc) / _that.disMax;
						_that.ctx.beginPath();
						_that.ctx.lineWidth = ratio / 2;
	          			_that.ctx.strokeStyle = 'rgba('+_that.color+',' + parseFloat(ratio + 0.2).toFixed(1) + ')';
						_that.ctx.moveTo(dot.x, dot.y);
						_that.ctx.lineTo(nowDot.x, nowDot.y);
						_that.ctx.stroke();//不描边看不出效果

						//dots.splice(dots.indexOf(dot), 1);
					}
				});
			};
			//开始动画
			Dotline.prototype.start = function(){
				var _that = this;
				this.addDots();
				setTimeout(function() {
				     _that.animate();
				}, 100);
			}
			window.Dotline = Dotline;
}(window));

// 文字点击特效
var list = ['学而时习之', '不亦说乎', '有朋自远方来', '不亦乐乎', '人不知而不愠', '不亦君子乎', '三人行 必有我师焉', '择其善者而从之', '其不善者而改之', '学而不思则罔', '思而不学则殆'];
$('body>*').bind('click',function(e){
    textUp( e, 2000, list, 200 )
})
function textUp( e, time, arr, heightUp ){
    var lists = Math.floor(Math.random() * arr.length);
    var colors = '#'+Math.floor(Math.random()*0xffffff).toString(16);
    var $i = $('<span />').text( arr[lists] );
    var xx = e.pageX || e.clientX + document.body.scroolLeft;
    var yy = e.pageY || e.clientY + document.body.scrollTop;

    $('body').append($i);
    $i.css({
        top: yy,
        left: xx,
        color: colors,
        transform: 'translate(-50%, -50%)',
        display: 'block',
        position: 'absolute',
        zIndex: 999999999999
    })  
    $i.animate({
        top: yy - ( heightUp ? heightUp : 200 ),
        opacity: 0
    }, time, function(){
        $i.remove();
    })            
}

/**
  * ModalHelper helpers resolve the modal scrolling issue on mobile devices
  * https://github.com/twbs/bootstrap/issues/15852
  * requires document.scrollingElement polyfill https://github.com/yangg/scrolling-element
  */
var ModalHelper = (function(bodyCls) {
  var scrollTop;
  return {
    afterOpen: function() {
      scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add(bodyCls);
      document.body.style.top = -scrollTop + 'px';
    },
    beforeClose: function() {
      document.body.classList.remove(bodyCls);
      // scrollTop lost after set position:fixed, restore it back.
      document.scrollingElement.scrollTop = scrollTop;
    }
  };
})('no-scroll');

// 滚动显示js
var smt = new SMT({
    animateClass: 'animated',
    offset: 100
});




// jq页面加载完毕
// $(function(){
	
// })
// window.onload=function(){
       
// }


smt.init();
$.init()