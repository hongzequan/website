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
    var isAdmin;
    var isfirst = true; //用来判断是否是第一次加载
    var isCascade=true;
    var times; //延时器
    // var API = "http://localhost:8080/"; //测试接口
    var API = "https://api.hongzequan.com:8000/";//接口地址
    //存储模块数据
    var navArr = [{ name: '#banner', scrollTop: 0, }, { name: '#aboutMe', scrollTop: 0, }, { name: '#mySkills', scrollTop: 0, }, { name: '#myPortfolio', scrollTop: 0, }, { name: '#message', scrollTop: 0, }];
    // 案例demo组
    var demoArr = [{
            name: 'swws',
            imgUrl: [
                'https://images.hongzequan.com/website/portfolio/swws_1.png',
                'https://images.hongzequan.com/website/portfolio/swws_2.png',
                'https://images.hongzequan.com/website/portfolio/swws_3.png',
            ]
        },
        {
            name: 'smt',
            imgUrl: [
                'https://images.hongzequan.com/website/portfolio/smt_1.png',
                'https://images.hongzequan.com/website/portfolio/smt_2.png',
                'https://images.hongzequan.com/website/portfolio/smt_3.png',
            ]
        },
        {
            name: 'smtyy',
            imgUrl: [
                'https://images.hongzequan.com/website/portfolio/yy_sumaotong.png',
                'https://images.hongzequan.com/website/portfolio/yy_sumaotong_1.png',
                'https://images.hongzequan.com/website/portfolio/yy_sumaotong_2.png',
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
                navTop: $('#aboutMe').offset().top - 60,
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
        /**
         * 预防xss进行字符串转码
         */
        htmlEncodeByRegExp: function(str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            return s;
        },
    }
    ///////////////////////////////////////部分原型的扩展js结束//////////////////////////////////////

    $.extend({
        /**
         * 初始化
         */
        init: function() {
            prin(); //打印
            setBanner(); //写入轮播图信息
            if(window.utils.getWindowInfo().userAgent=='pc'){
                initCanvas(); //粒子效果
                smt.init(); //滚动加载动画
            }
            setInfo(); //获取访问者信息
        },

        /**
         * 页面滚动到指定位置js
         */
        goTop: function(obj) {
            if (obj) {
                var top = $(obj).offset().top - 60;
                $('body,html').stop(true, true).animate({ scrollTop: top }, 300);
            } else {
                $('body,html').stop(true, true).animate({ scrollTop: 0 }, 300);
            }
        },


        /**
         * 查看案例
         */
        demo: function(obj) {
            var type = $(obj).attr('data-type');
            /**
             *  查看界面Swiper弹窗
             */
            mySwiper = new Swiper('#portfolioBanner .swiper-container', {
                // loop: true,
                // autoHeight: true, //高度随内容变化
                paginationType: 'fraction',
                // 如果需要前进后退按钮
                nextButton: '#portfolioBanner .swiper-button-next',
                prevButton: '#portfolioBanner .swiper-button-prev',
                onSlideChangeEnd: function(swiper) {
                    mySwiper.update();
                }
            });
            for (var i = 0; i < demoArr.length; i++) {
                if (type == demoArr[i].name) {
                    for (var d = 0; d < demoArr[i].imgUrl.length; d++) {
                        mySwiper.appendSlide('<div class="swiper-slide"><img src=' + demoArr[i].imgUrl[d] + '></div>');
                    }
                }
            };
            $('#portfolioBanner').show('400', function() {
                mySwiper.update();
                if (window.utils.getWindowInfo().userAgent == 'm') {
                    ModalHelper.afterOpen();
                }

            });
        },
        /**
         * 关闭弹窗
         */
        closeModal: function(obj) {
            $(obj).parent().fadeOut('400', function() {
                mySwiper.removeAllSlides(); //移除全部
                mySwiper.updatePagination();
                if (window.utils.getWindowInfo().userAgent == 'm') {
                    ModalHelper.beforeClose();
                }
            });
        },
        /**
         * 获得留言
         */
        getMessage: function() {
            // 获取留言
            $.ajax({
                type: "get",
                url: API + 'getMessage',
                data: '',
                beforeSend: function() {

                },
                success: function(data) {
                    var res = JSON.parse(data);
                    if (res.s == 1) {
                        var arr = res.info;
                        for (var i = 0; i < arr.length; i++) {
                            var html = "<li>";
                            if (arr[i].sex == 0) {
                                html += "<div class='img-box'><img src='https://images.hongzequan.com/website/b_gg.png'></div>";
                            } else {
                                html += "<div class='img-box'><img src='https://images.hongzequan.com/website/b_mm.png'></div>";
                            }
                            html += "<div class='font-box'>";
                            if (arr[i].isAdmin == 0) {
                                html += "<div class='from'>来自" + arr[i].address + "网友 - " + arr[i].userName + "</div>";
                            } else {
                                html += "<div class='from'>来自 - 权小哥</div>";
                            };
                            html += "<p>" + arr[i].content + "</p>";
                            html += "<span>" + timestampToTime(arr[i].createDate) + "</span>";
                            if (isAdmin) {
                                html += "<div class='delect' onClick='$.delectMessage(" + arr[i].id + ",this)'>删除</div>"
                            }
                            html += "</div>";
                            html += "</li>";
                            $('.msg-item').append(html);
                        }
                    }
                },

                error: function(err) {
                    console.log('err')
                }

            });
        },
        /**
         * 提交留言
         */
        submitMessage: function() {
            var data = {
                "username": $('#username').val() == '' ? '匿名' : window.utils.htmlEncodeByRegExp($('#username').val()),
                "sex": $('input:radio[name="sex"]:checked').val(),
                "content": window.utils.htmlEncodeByRegExp($("textarea[name='content']").val()),
                "ip": $('#ip').val(),
                "address": $('#address').val(),
                "isAdmin": isAdmin ? 1 : 0
            };
            $.ajax({
                type: "POST",
                url: API + 'setMessage',
                data: data,
                beforeSend: function() {
                    if (data.content == '') {
                        $.openMessage('error', '内容不能为空');
                        return false;
                    };
                },
                success: function(e) {
                    var res = JSON.parse(e);
                    if (res.s == 1) {
                        $.openMessage('success', '提交成功～');
                        $("textarea[name='content']").val('');
                        var html = "<li class='on'>";
                        if (data.sex == 0) {
                            html += "<div class='img-box'><img src='https://images.hongzequan.com/website/b_gg.png'></div>";
                        } else {
                            html += "<div class='img-box'><img src='https://images.hongzequan.com/website/b_mm.png'></div>";
                        }
                        html += "<div class='font-box'>";
                        if (data.isAdmin == 0) {
                            html += "<div class='from'>来自" + data.address + "网友 - " + data.username + "</div>";
                        } else {
                            html += "<div class='from'>来自 - 权小哥</div>";
                        };
                        html += "<p>" + data.content + "</p>";
                        html += "<span>" + timestampToTime(Date.parse(new Date())) + "</span>";
                        html += "</div>";
                        html += "</li>"
                        $('.msg-item').prepend(html);

                    }
                },
                error: function(err) {
                    console.log(err)
                    $.openMessage('error', '提交失败！')
                }
            });
        },
        // 检查是否能够提交留言
        checkMessage: function() {
            var data = {
                'ip': $('#ip').val(),
            };
            $.ajax({
                type: "POST",
                url: API + 'checkMessage',
                data: data,
                beforeSend: function() {

                },
                success: function(data) {
                    var res = JSON.parse(data);
                    if (res.s == 1) {
                        $.submitMessage();
                    } else if (res.s == 0) {
                        $.openMessage('error', '1分钟内禁止多次提交');
                    };

                },
                error: function(err) {
                    console.log(err)
                    $.openMessage('error', '提交失败！')
                }
            });
        },
        delectMessage: function(id, obj) {
            $.ajax({
                type: "POST",
                url: API + 'delectMessage',
                data: { 'id': id },
                beforeSend: function() {

                },
                success: function(data) {
                    var res = JSON.parse(data);
                    if (res.s == 1) {
                        $.openMessage('success', '删除成功');
                        $(obj).parents('li').fadeOut('400', function() {
                            $(obj).parents('li').remove();
                        });
                    }
                },
                error: function(err) {
                    console.log(err)
                    $.openMessage('error', '提交失败！')
                }
            });
        },
        // 公用提示信息
        openMessage: function(type, text) {
            if ($('#tips').length > 0) {
                $('#tips').remove();
                //多次触发，计时器重新计算
                if (times != 'undefined') {
                    clearTimeout(times);
                }
            }
            if (type == 'success') {
                var html = '<div id="tips">' + text + '</div>';
                $('body').append(html);
            } else if (type == 'error') {
                var html = '<div id="tips" class="error">' + text + '</div>';
                $('body').append(html);
            }
            $('#tips').addClass('on');
            times = setTimeout(function() {
                $('#tips').fadeOut('400', function() {
                    $('#tips').remove();
                });
            }, 3000)

        }
    });

    ///////////////////////////////////////jQ扩展方法js结束////////////////////////////////////// 

    ///////////////////////////////////////模块js 开始//////////////////////////////////////
    /**
     * 控制台打印配置
     */
    function prin() {
        console.log("%c ---本网站不支持ie8及以下浏览器打开---", "color:red");
        if (window.utils.IEVersion() != '-1') {
            if (window.confirm("当前为IE浏览器,为了效果体验，不支持打开")) {
                window.close();
            }
        }
    };
    /**
     * 首屏打字效果
     */
    function setFont() {
        $('.banner .text').typeIt({
            whatToType: ["Believeme!", "I was prepared foreverything."],
            typeSpeed: 100
        }, function() {

        });
    };
    /**
     * 获取当前访问者的信息
     */
    function setInfo() {
        $('#ip').val(returnCitySN['cip']);
        $('#address').val(returnCitySN['cname']);

        // 管理员身份验证

        checkAdmin(getQueryString('admin'), getQueryString('password'));
    };
    /**
     * 检测当前对象是否是管理员
     */
    function checkAdmin(username, password) {
        if (username && password) {
            var data = {
                'username': username,
                'password': password,
            }
            $.ajax({
                type: "POST",
                url: API + 'checkAdmin',
                data: data,
                beforeSend: function() {

                },
                success: function(e) {
                    var res = JSON.parse(e);
                    if (res.s == 1) {
                        isAdmin = true;
                        $.openMessage('success', '欢迎回来！  ' + username);
                        $.getMessage(); //获取留言信息
                    }else if(res.s==0){
                        $.getMessage(); //获取留言信息
                    }
                },
                error: function(err) {
                    console.log(err)
                    $.openMessage('error', '提交失败！')
                }
            });
        } else {
            $.getMessage(); //获取留言信息
        }

    };

    /**
     * 设置轮播图图片
     */
    function setBanner() {
        var arr = $('.banner img');
        length = arr.length;
        q = 1;
        if (window.utils.getWindowInfo().userAgent == 'pc') {
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).attr('src', $(arr[i]).attr('data-pc'))
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).attr('src', $(arr[i]).attr('data-m'))
            }
        }
        arr.load(function() {
            // 加载完成    
            if (length <= q) {
                initSwiper();
                setFont();
            } else {
                q++;
            }
        });
    };
    /**
     * 计算banner高度
     */
    function setBannerHeight() {
        $('body').css({ "paddingTop": $('#banner').height() })
    };
    /**
     * 初始化轮播图
     */
    function initSwiper() {
        var bannerSwiper = new Swiper('.banner .swiper-container', {
            loop: true,
            autoplay: 5000,
            autoplayDisableOnInteraction: false,
            autoHeight: true, //高度随内容变化
            // 如果需要分页器
            // pagination: '.banner .swiper-pagination',
            paginationClickable: true,
            observer: true,
            observeParents: true,
            onInit: function(swiper) {
                //Swiper初始化了
                //alert(swiper.activeIndex);提示Swiper的当前索引
                setBannerHeight();
            },
            onBeforeResize: function(swiper) {
                setBannerHeight();
            }
        });
    };
    /**
     * 粒子线条背景
     * 移动端点的条数为50个，避免密集
     */
    function initCanvas() {
        var defaults = {
            dom: 'J_dotLine', //画布id
            cw: window.utils.getWindowInfo().width, //画布宽
            ch: window.utils.getWindowInfo().height, //画布高
            ds: 100, //点的个数
            r: 0.5, //圆点半径
            cl: '#aaa', //粒子线颜色
            dis: 100 //触发连线的距离
        };
        if (window.utils.getWindowInfo().userAgent == 'm') {
            var options = {
                ds: 50, //点的个数
            };
            $.extend(defaults, options);
        };
        var dotline = new Dotline(defaults).start();
    };
    /**
     * 我的技能里进行赋值进度
     */
    function setNum() {
        var bar = $('#skills .bar-box');
        var arrSKill = bar.find('span');
        for (var i = 0; i < arrSKill.length; i++) {
            $(arrSKill[i]).siblings().find('i').css('width', $(arrSKill[i]).html());
        };
    };
    /**
     *  性别选择
     *  当点击单选按钮时触发
     */
    $('.ui-checkbox li').on('click', function() {
        /* Act on the event */
        $(this).find('input').attr('checked', 'checked');
        $(this).siblings().find('input').removeAttr('checked');
    });
    /**
     *  导航菜单滚动到指定位置进行变色
     */
    $(window).scroll(function(event) {
        var winTop = $(window).scrollTop();
        if (winTop >= window.utils.getWindowInfo().navTop) {
            $('#header').addClass('on');
            if (window.utils.getWindowInfo().userAgent == 'm') {
                $('.copyRight .goTop').addClass('on');
            }
        } else {
            $('#header').removeClass('on')
            if (window.utils.getWindowInfo().userAgent == 'm') {
                $('.copyRight .goTop').removeClass('on');
            }
        }
        // 我的技能滚动到位置才进行数据显示效果
        if (winTop >= $('#mySkills .font-box').offset().top - window.utils.getWindowInfo().height / 2) {
            setNum() //滚动到才加载
        }
        setNavCur(winTop)
    });

    /**
     *  根据滚动距离计算nav样式
     */
    function setNavCur(top) {
        // 判断是否是第一次加载，避免重复计算获取值 距离顶部的值
        if (isfirst) {
            for (var i = 0; i < navArr.length; i++) {
                navArr[i].scrollTop = parseInt($(navArr[i].name).offset().top);
            }
            isfirst = false;
        };
        for (var i = 0; i < navArr.length; i++) {
            if (top >= navArr[i].scrollTop - 60) {
                $('#header ul li').eq(i).addClass('cur').siblings().removeClass('cur');
            }
        }
    };

    // 获取url传参
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    // 滚动显示js
    var smt = new SMT({
        animateClass: 'animated',
        offset: 100
    });


    // 时间戳转日期格式
    function timestampToTime(timestamp) {
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '/';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        // var s = date.getSeconds();
        return Y + M + D + h + m;
    }
    function initCascade(){
        if(window.utils.getWindowInfo().userAgent=='pc'){
          console.log('判定为pc端，移动端取消瀑布流加载');
          if(isCascade){
            isCascade=false;
             $('.myPortfolio-box ul').cascade();
          }

        }
    }

    window.onload = function() {
       initCascade()
    }
    $(window).resize(function() {
       initCascade()
    });


    ///////////////////////////////////////模块js 结束////////////////////////////////////// 
})(window, document, $);



// 粒子线条Js
;
(function(window) {
    function Dotline(option) {
        this.opt = this.extend({
            dom: 'J_dotLine', //画布id
            cw: 1000, //画布宽
            ch: 500, //画布高
            ds: 100, //点的个数
            r: 0.5, //圆点半径
            cl: '#000', //颜色
            dis: 100 //触发连线的距离
        }, option);
        this.c = document.getElementById(this.opt.dom); //canvas元素id
        this.ctx = this.c.getContext('2d');
        this.c.width = this.opt.cw; //canvas宽
        this.c.height = this.opt.ch; //canvas高
        this.dotSum = this.opt.ds; //点的数量
        this.radius = this.opt.r; //圆点的半径
        this.disMax = this.opt.dis * this.opt.dis; //点与点触发连线的间距
        this.color = this.color2rgb(this.opt.cl); //设置粒子线颜色
        this.dots = [];
        //requestAnimationFrame控制canvas动画
        var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
        var _self = this;
        //增加鼠标效果
        var mousedot = { x: null, y: null, label: 'mouse' };
        this.c.onmousemove = function(e) {
            var e = e || window.event;
            mousedot.x = e.clientX - _self.c.offsetLeft;
            mousedot.y = e.clientY - _self.c.offsetTop;
        };
        this.c.onmouseout = function(e) {
            mousedot.x = null;
            mousedot.y = null;
        }
        //控制动画
        this.animate = function() {
            _self.ctx.clearRect(0, 0, _self.c.width, _self.c.height);
            _self.drawLine([mousedot].concat(_self.dots));
            RAF(_self.animate);
        };
    }
    //合并配置项，es6直接使用obj.assign();
    Dotline.prototype.extend = function(o, e) {
        for (var key in e) {
            if (e[key]) {
                o[key] = e[key]
            }
        }
        return o;
    };
    //设置线条颜色(参考{抄袭}张鑫旭大大，http://www.zhangxinxu.com/wordpress/2010/03/javascript-hex-rgb-hsl-color-convert/)
    Dotline.prototype.color2rgb = function(colorStr) {
        var red = null,
            green = null,
            blue = null;
        var cstr = colorStr.toLowerCase(); //变小写
        var cReg = /^#[0-9a-fA-F]{3,6}$/; //确定是16进制颜色码
        if (cstr && cReg.test(cstr)) {
            if (cstr.length == 4) {
                var cstrnew = '#';
                for (var i = 1; i < 4; i++) {
                    cstrnew += cstr.slice(i, i + 1).concat(cstr.slice(i, i + 1));
                }
                cstr = cstrnew;
            }
            red = parseInt('0x' + cstr.slice(1, 3));
            green = parseInt('0x' + cstr.slice(3, 5));
            blue = parseInt('0x' + cstr.slice(5, 7));
        }
        return red + ',' + green + ',' + blue;
    }
    //画点
    Dotline.prototype.addDots = function() {
        var dot;
        for (var i = 0; i < this.dotSum; i++) { //参数
            dot = {
                x: Math.floor(Math.random() * this.c.width) - this.radius,
                y: Math.floor(Math.random() * this.c.height) - this.radius,
                ax: (Math.random() * 2 - 1) / 1.5,
                ay: (Math.random() * 2 - 1) / 1.5
            }
            this.dots.push(dot);
        }
    };
    //点运动
    Dotline.prototype.move = function(dot) {
        dot.x += dot.ax;
        dot.y += dot.ay;
        //点碰到边缘返回
        dot.ax *= (dot.x > (this.c.width - this.radius) || dot.x < this.radius) ? -1 : 1;
        dot.ay *= (dot.y > (this.c.height - this.radius) || dot.y < this.radius) ? -1 : 1;
        //绘制点
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.stroke();
    };
    //点之间画线
    Dotline.prototype.drawLine = function(dots) {
        var nowDot;
        var _that = this;
        //自己的思路：遍历两次所有的点，比较点之间的距离，函数的触发放在animate里
        this.dots.forEach(function(dot) {

            _that.move(dot);
            for (var j = 0; j < dots.length; j++) {
                nowDot = dots[j];
                if (nowDot === dot || nowDot.x === null || nowDot.y === null) continue; //continue跳出当前循环开始新的循环
                var dx = dot.x - nowDot.x, //别的点坐标减当前点坐标
                    dy = dot.y - nowDot.y;
                var dc = dx * dx + dy * dy;
                if (Math.sqrt(dc) > Math.sqrt(_that.disMax)) continue;
                // 如果是鼠标，则让粒子向鼠标的位置移动
                if (nowDot.label && Math.sqrt(dc) > Math.sqrt(_that.disMax) / 2) {
                    dot.x -= dx * 0.02;
                    dot.y -= dy * 0.02;
                }
                var ratio;
                ratio = (_that.disMax - dc) / _that.disMax;
                _that.ctx.beginPath();
                _that.ctx.lineWidth = ratio / 2;
                _that.ctx.strokeStyle = 'rgba(' + _that.color + ',' + parseFloat(ratio + 0.2).toFixed(1) + ')';
                _that.ctx.moveTo(dot.x, dot.y);
                _that.ctx.lineTo(nowDot.x, nowDot.y);
                _that.ctx.stroke(); //不描边看不出效果

                //dots.splice(dots.indexOf(dot), 1);
            }
        });
    };
    //开始动画
    Dotline.prototype.start = function() {
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
$('body>*').bind('click', function(e) {
    textUp(e, 2000, list, 200)
})

function textUp(e, time, arr, heightUp) {
    var lists = Math.floor(Math.random() * arr.length);
    var colors = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    var $i = $('<span />').text(arr[lists]);
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
        top: yy - (heightUp ? heightUp : 200),
        opacity: 0
    }, time, function() {
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





// jq页面加载完毕
// $(function(){

// })




$.init()