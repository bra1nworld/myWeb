$(document).ready(function() {
    navInit('#section2', 400);
    navClick('#section2', 2);

    navInit('#section3', 400);
    navClick('#section3', 3);

    navInit('#section4', 400);
    navClick('#section4', 4);
    $("#sections").fullpage({
        controlArrows: false,
        easingcss3: 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'],
        // parallax: false,
        // parallaxOptions: {
        //     type: 'reveal',
        //     percentage: 62,
        //     property: 'translate'
        // },
        scrollingSpeed: 1000,
        // autoScrolling: true,
        // scrollBar: false,
        // fitToSection: false,

        //纵向滚动之前(index 从1开始)
        onLeave: function(index, nextIndex, direction) {
            //导航栏效果
            var scollbars = $(".scrollbar .dots>a");
            $(".scrollbar .current").html(nextIndex);
            for (var i = 0; i < scollbars.length; i++) {
                if (i == (nextIndex - 1)) {
                    scollbars.eq(i).addClass('focus');
                } else {
                    scollbars.eq(i).removeClass('focus');
                }
            }
            //首页效果
            if (index == 1) {
                $("#section1").removeClass("focus");
            } else {
                $("#section1").addClass("focus");
            }

            //第二页及以后的line2效果
            $("#sections").addClass("animate");
            setTimeout(function() {
                $("#sections").removeClass("animate");
            }, 1000)

            $("#line2").addClass("focus")
            if (nextIndex == 1) {
                $("#line2").removeClass("focus")
            }

            if (nextIndex == 3) {
                $("#section3").addClass("animate");
                setTimeout(function() {
                    $("#section3").removeClass("animate");
                }, 2000)
            }


        },

        //横向滚动之前(index 从1开始)
        onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex) {
            if (index == 2 || index == 3 || index == 4) {
                navSlick('#section' + index, index, slideIndex, nextSlideIndex);
            }
        }
    });
    $("[data-height]").each(function() {
        if ($(window).width() >= 980) {
            $(this).height($(window).height() / $(this).attr("data-height"));
        } else {
            e(this).css("height", "");
        }
    })

    //首页线条初始化
    lines(document.querySelector("#line1"));
    lines(document.querySelector("#line2"))

    //加载完成后去掉load等待页面
    $("#loading").fadeOut(500, function() {
        $("#section1").addClass("focus");
        $("body").removeClass("loading");
    })

});










/**
 * nav位置初始化
 *  
 * @param {any} idName      id名 eg:'#section3'
 * @param {any} offset      左偏移距离
 */
function navInit(idName, offset) {
    $(idName + " .slicks").css('transform', 'translateX(' + offset + 'px)');
    $(idName + " .slick-slide").eq(0).addClass('active');
}

/**
 * 页面滑动效果
 * 
 * @param {any} idName            id名 eg:'#section3'
 * @param {any} index             第几个section (从1开始)
 * @param {any} slideIndex        横向当前页角标 (从0开始)
 * @param {any} nextSlideIndex    横向下一页角标
 */
function navSlick(idName, index, slideIndex, nextSlideIndex) {
    var slicksTrans = parseFloat($(idName + " .slicks").css('transform').substring(7).split(',')[4]);
    var transformWidth = slicksTrans - (nextSlideIndex - slideIndex) * $(idName + " .slick-slide").width();
    var slides = $(idName + " .slick-slide");
    $(idName + " .slicks").css('transform', 'translateX(' + transformWidth + 'px)');
    for (var i = 0; i < slides.length; i++) {
        if (i == nextSlideIndex) {
            slides.eq(nextSlideIndex).addClass('active');
        } else {
            slides.eq(i).removeClass('active');
        }
    }
}


/**
 * nav点击事件
 * 
 * @param {any} idName        id名 eg:'#section3'
 * @param {any} sectionIndex  第几个section (从1开始)
 */
function navClick(idName, scetionIndex) {
    var slides = $(idName + " .slick-slide");
    var leftArrow = $(idName + " .controlArrow.prev");
    var rightArrow = $(idName + " .controlArrow.next");

    for (var i = 0; i < slides.length; i++) {
        (function(n) {
            slides.eq(i).click(function() {
                $("#sections").fullpage.moveTo(scetionIndex, n);
            })
        })(i)
    }

    leftArrow.click(function() {
        for (var i = 0; i < slides.length; i++) {
            if (slides.eq(i).attr('class').indexOf('active') > 0) {
                if (i == 0) {
                    $("#sections").fullpage.moveTo(scetionIndex, slides.length - 1);
                } else {
                    $("#sections").fullpage.moveTo(scetionIndex, i - 1);
                }
                return;
            }
        }
    })

    rightArrow.click(function() {
        for (var i = 0; i < slides.length; i++) {
            if (slides.eq(i).attr('class').indexOf('active') > 0) {
                if (i == slides.length - 1) {
                    $("#sections").fullpage.moveTo(scetionIndex, 0);
                } else {
                    $("#sections").fullpage.moveTo(scetionIndex, i + 1);
                }
                return;
            }
        }
    })
}