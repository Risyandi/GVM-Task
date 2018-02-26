$(function() {
    var stream;
    var offset_id = 0;
    var isStreamExhausted = false;
    var isApiCallFinished = true;
    var _throttleTimer = null;
    var _throttleDelay = 100;

    $(document).ready(function () {
        $(window).off('scroll', homeStreamScrollHandler).on('scroll', homeStreamScrollHandler);
        getWebBanner();
        getMWebBanner();
        getWomanChatNew();
        getEditorChoice('home');
        getArticleStream(offset_id);
        getTrendingNow();
        getInstagramFeed('womantalk_com');
    });

    $(window).resize(function() {
      resizeTrendingCover()
    })

    function homeStreamScrollHandler(e) {
        //throttle event:
        clearTimeout(_throttleTimer);
        _throttleTimer = setTimeout(function () {
            if(!isStreamExhausted && isApiCallFinished){
              if ($(window).scrollTop() + $(window).innerHeight () > $(document).height() - 100) {
                getArticleStream(offset_id);
              }
            }
        }, _throttleDelay);
    }
    var isInitialArticle = true;

    function getWomanChatNew() {
      // var simpenan = '';
      // var isFirstSpace1 = 0;
      var param = {'limit': 8}
      actionWebApiRestrict('/v1/conversation/popular', param, 'GET').done(function(json) {
        if (json.status == 600) {
          stream = json.data;
          var totalSpaceTaken = 0;
          $.each(stream, function(key,value){
            // var appendText = generateNewWomanChat(value);
            // $("#womanchat-new").append(appendText);
            var takingSpace = 0;
            if(value.attachments) {
              takingSpace = 2;
            } else {
              takingSpace = 1;
              // if(isFirstSpace1 == 0) {
              //   isFirstSpace1 = 1
              // }
            }
            // if(isFirstSpace1 == 1) {
            //   simpenan = value;
            //   isFirstSpace1 = 2;
            // } else {
              if((totalSpaceTaken + takingSpace) <= 8) {
                totalSpaceTaken += takingSpace
                var appendText = generateNewWomanChat(value);
                $("#womanchat-new").append(appendText);
              }
            // }
          })
          // var appendText = generateNewWomanChat(simpenan);
          // $("#womanchat-new").append(appendText);

          var $gridWomanchat = $('.gridWomanChat').imagesLoaded( function() {
            $gridWomanchat.masonry({
              itemSelector: '.grid-womanchat',
              percentPosition: true,
              columnWidth: '.grid-sizer-womanchat',
              gutter: '.gutter-sizer'
            });
          });
          $gridWomanchat.masonry('reloadItems');

        }
      })
    }
    function generateNewWomanChat(value) {
      var appendText = '';
      appendText += '<div class="grid-womanchat" >'
        appendText += '<div style="padding: 15px 15px 5px 15px" onclick="return goLoungeDetail(event, \''+value.url+'\')">'

        appendText += '<div class="womanchat-home-category">'
          appendText += '<div onclick="return goLounge(\''+slugify(value.category.name)+'\')" style="color: '+value.category.color+';" class="m-top-5 bold">'
            appendText += value.category.name.toUpperCase()
          appendText += '</div>'
          appendText += '<div style="width: 15px; position: relative; top: 3px; border-bottom: 2px solid '+value.category.color+'"></div>'
        appendText+= '</div>'

          var dd = '';
          dd = changeTimeFormat(value.time_created)

          appendText += '<div class="row">'
            appendText += '<div style="float: left; margin: 0 10px" class="" >'
              appendText += '<img style="width: 45px; border-radius: 3px" src="'+value.creator.picture.medium+'" onerror="this.src=\'https://d15hng3vemx011.cloudfront.net/profile_picture/default-profpic.large\'"/>'
            appendText += '</div>'
            appendText += '<div class="" style="overflow: hidden; padding-right: 15px" >'
              appendText += '<div class="text-md mont-light">'
                appendText += '<a href="/@'+value.creator.username+'" class="mont-bold">' + value.creator.username + '</a>'
                if(value.creator.role.name=='ROLE_EXPERT') {
                  appendText+= '<span aria-hidden="true" data-fonticon="&#xe001;" class="fonticon-expert expert-badge expert-creator-icon" style="line-height: 0"></span>'
                }
                if(value.creator.is_certified == true) {
                  appendText += '<img src="/web/assets/icon/profile/icon-certified.svg" style="width: 15px; height: 15px; margin-left: 2px"/>'
                }
                if(value.expert) {
                  appendText += ' berbicara dengan ';
                  appendText += '<a href="/@'+value.expert.username+'" class="mont-bold">'+value.expert.username+'<span aria-hidden="true" data-fonticon="&#xe001;" class="fonticon-expert expert-badge" style="line-height: 0"></span></a>'
                } else {
                  appendText += ' membuka pembicaraan '
                }
                appendText += '<div class="newchat-create-date" >'
                  appendText += dd
                appendText += '</div>'
              appendText += '</div>'
            appendText += '</div>'

            appendText += '<div style="padding: 3%">'
              if(value.attachments) {
                appendText += '<div class="">'
                  if(value.attachments[0].image.medium) {
                    appendText += '<img class="newchat-attachment"  src="'+value.attachments[0].image.medium+'" />'
                  } else {
                    appendText += '<img class="newchat-attachment"  src="'+value.attachments[0].image.original+'" />'
                  }
                appendText += '</div>'
              }
              appendText += '<div class="newchat-content">'
                appendText += '<a href="'+value.url+'" style="color: #4c4c4c!important">'
                  appendText += value.content
                appendText += '</a>'
              appendText += '</div>'
              appendText += '<div class="newchat-info">'
                appendText += '<div class="newchat-action bold">'
                  if(value.like_status == 1) {
                    appendText += '<div class="pull-left clickable text-like" type="cancellike" data-id="'+value.id+'" onclick="likeLounge(this)">'
                      appendText += '<img class="m-right-5" src="/web/assets/icon/bookmark/liked.svg">'
                      appendText += '<div class="like-status" style="display: inline-block;font-size: 1em;">'
                        appendText += '<span class="like-number" style="margin-right: 0px;" >'+value.total_like+'</span>'
                      appendText += '</div>'
                  } else {
                    appendText += '<div class="pull-left clickable text-like" type="like" data-id="'+value.id+'" onclick="likeLounge(this)">'
                      appendText += '<img class="m-right-5" src="/web/assets/icon/bookmark/like.svg">'
                      appendText += '<div class="like-status" style="display: inline-block;font-size: 1em;">'
                        appendText += '<span class="like-number" style="margin-right: 0px;" >'+value.total_like+'</span>'
                      appendText += '</div>'
                  }
                appendText += '</div>'
                appendText += '<div class="pull-left" onclick="window.location=\''+value.url+'\'">'
                  appendText+= '<img class="clickable m-right-5" src="/web/assets/icon/bookmark/comment.svg" alt="">'
                  //appendText+= '<span>Reply</span>'
                  appendText += '<div class="like-status" style="display: inline-block;font-size: 1em;">'
                    appendText += '<span class="like-number" style="margin-right: 0px;" >'+value.total_comment+'</span>'
                  appendText += '</div>'
                appendText += '</div>'

                appendText += '<div class="clearfix">'
              appendText += '</div>'
            appendText += '</div>'



          appendText += '</div>'

        appendText += '</div>'
      appendText += '</div>'
      return appendText;
    }

    function getTrendingNow() {
      actionWebApiRestrict('/v1/stream/article/trending', {'limit':5}, 'GET').done(function(json) {
        if (json.status == 600) {
          stream = json.data;
          appendText = '';
          appendText+= '<div clas="row row-no-margin">'
            appendText+= '<div class="col-md-8 col-sm-7 col-xs-12 m-bottom-10 p-l-r-0 trending-big-container">'
              appendText+= '<div class="col-xs-6" style="padding-left: 0px; padding-right: 5px">'
                appendText+= generateTrendingBig(stream[0])
              appendText+= '</div>'
              appendText+= '<div class="col-xs-6 " style="padding-right: 0px; padding-left: 5px">'
                appendText+= generateTrendingBig(stream[1])
              appendText+= '</div>'
            appendText+= '</div>'

            appendText+= '<div class="col-md-4 col-sm-5 col-xs-12 m-bottom-10 trending-small-container" style="padding-right: 0px;">'
              appendText+= '<div class="col-xs-12 p-l-r-0" style="margin-bottom: 6px">'
                appendText+= generateTrendingSmall(stream[2])
              appendText+= '</div>'
              appendText+= '<div class="col-xs-12 p-l-r-0" style="margin-bottom: 6px">'
                appendText+= generateTrendingSmall(stream[3])
              appendText+= '</div>'
              appendText+= '<div class="col-xs-12 p-l-r-0">'
                appendText+= generateTrendingSmall(stream[4])
              appendText+= '</div>'
            appendText+= '</div>'
          appendText+= '</div>'
          appendText+= '<div class="clearfix"></div>'
          $('#trending-now').html(appendText)


          $('#trending-now').imagesLoaded( function() {
            resizeTrendingCover();
          });

        }
      })
    }

    function resizeTrendingCover() {
      $('.trending-big-cover, .trending-small-cover').each(function(){
        $(this).height( $(this).width() * 7 / 6 )
      })

      // var heightDiff = Math.floor(($('.trending-small-container').height() - $('.trending-big-container').height())/3)
      // $('.trending-small-cover').each(function(){
      //   $(this).height( $(this).height()-heightDiff )
      // })

      if( $(window).width() >= 751 ) {
        $('.trending-big-cover').each(function(){
          $(this).height( $('.trending-small-container').height() )
        })
      }
    }

    function generateTrendingBig(data) {
      var appendText = ''
        appendText+= '<div style="position: relative; cursor: pointer" onclick="window.location=\''+data.url+'\'">'
          appendText+= '<div class="trending-big-cover hoverimage" style="background-image: url('
            data.cover ? appendText += data.cover.medium : appendText += '';
          appendText+='); background-color: #b5b5b5">'

            appendText+= '<div class="trending-title-overlay" style="">'
            appendText+= '</div>'

            appendText+= '<div class="trending-category small-trending-category big-trending-category bold" style="position: absolute; ">'
              appendText+= data.category.name.toUpperCase()
            appendText+= '</div>'
            appendText +='<div class="big-trending-category-border" style="width: 15px; position: relative; display:inline-block;left: 8px; border-bottom: 2px solid white; position: absolute;"></div>'

            appendText+= '<div class="trending-title big-trending-title" style="">'
              appendText+= '<a href="'+data.url+'" style="color: white!important">'
                appendText+= data.title
              appendText+= '</a>'
            appendText+= '</div>'

            if(data.sponsor_type) {
              appendText += '<div class="trending-big-tag">'
                appendText += data.sponsor_type
              appendText += '</div>'
            }

          appendText+= '</div>'
        appendText+= '</div>'
      return appendText;
    }
    function generateTrendingSmall(data) {
      var appendText = ''
        appendText+= '<div class="treding-small-content" style="position: relative; cursor: pointer; background-color: white" onclick="window.location=\''+data.url+'\'">'
          appendText+= '<div class="row row-no-margin" style="line-height: 1.2em">'
            appendText+= '<div class="col-xs-3 col-md-4 trending-small-cover p-l-r-0 hoverimage" style="background-image: url('
              data.cover ? appendText += data.cover.medium : appendText += '';
            appendText+='); background-color: #b5b5b5">'
            appendText+= '</div>'

            appendText+= '<div class="trending-category small-trending-category bold" style="color: '+data.category.color+'">'
              appendText+= data.category.name.toUpperCase()
            appendText+= '</div>'
            appendText += '<div style="width: 15px; position: relative; top: -11px; display:inline-block;left: 8px; border-bottom: 2px solid '+data.category.color+'"></div>'

            appendText+= '<div class="col-xs-9 col-md-8 p-l-r-0" style="">'
              appendText+= '<div class="m-bottom-5 trending-title small-trending-title">'
                appendText+= '<a href="'+data.url+'" style="color: #4c4c4c!important">'
                  appendText+= data.title
                appendText+= '</a>'
              appendText+= '</div>'
              appendText+= '<div class="small-trending-title" style="color: #55cfc4; font-size: 0.85em">'
                appendText+= 'Read More ...'
              appendText+= '</div>'
            appendText+= '</div>'

            if(data.sponsor_type) {
              appendText += '<div class="trending-small-tag">'
                appendText+= data.sponsor_type
              appendText += '</div>'
            }

          appendText+= '</div>'
        appendText+= '</div>'
      return appendText;
    }

    var numArticleStreamLoaded = 0;
    function getArticleStream(offsetId) {
      $('#stream-loading').removeClass('collapse');

      isApiCallFinished = false;
       var limitarticle = 12;
       if ( $(window).width() <= 768) {
          limitarticle = 6;
       }
      var param = {'offset_id': offsetId, 'limit': limitarticle};
      actionWebApiRestrict('/v1/stream/home', param, 'GET').done(function(json) {
          if (json.status == 600) {
              numArticleStreamLoaded += json.data.length;

              stream = json.data;
              if (stream.length < limitarticle) {
                isStreamExhausted = true;
              }
              if(isInitialArticle) {
                $('#stream-loading').addClass('collapse');
                isInitialArticle = false;
              }
              $.each(stream, function(key, value) {
                var appendText = generateArticleGridItem(value, 'home');
                $("#article-stream").append(appendText);
              })
              var timeoutTime = 0
              setTimeout(function(){
                var $grid = $('.grid').imagesLoaded( function() {
                  $grid.masonry({
                    itemSelector: '.grid-item',
                    percentPosition: true,
                    columnWidth: '.grid-sizer',
                    gutter: '.gutter-sizer'
                  });
                  $('#stream-loading').addClass('collapse');
                  isApiCallFinished = true;
                });
                $grid.masonry('reloadItems');
              }, timeoutTime);

              offset_id = stream[stream.length-1].id;
          } else {

          }
      });
    }
    function getWebBanner() {
      actionWebApiRestrict('/v1/top-banner/web', 'GET').done(function(json) {
        if (json.status == 600) {
          var appendText = ''
          var newTab = ''
          banners = json.data;
          if(banners.length == 1) {
            if(banners[0].open_new_tab == true){
              newTab = 'target="_blank"'
            }
            appendText += '<a id="'+bannerId[0]+'" href="'+banners[0].link+'" '+newTab+'>';
              appendText += '<img class="no-mobile" src="'+banners[0].original.url+'" style="width: 100%"/>';
            appendText += '</a>';
            $('#banner-container').append(appendText);
          } else {
            appendText += '<div id="myCarousel" class="carousel slide no-mobile" data-ride="carousel" >'
            appendText += '</div>'
            $('#banner-container').append(appendText);

            appendText = '<ol class="carousel-indicators" id="banner-web-control">'
            appendText += '</ol>'
            appendText += '<div class="carousel-inner text-center background-white" role="listbox" id="banner-web-content">'
            appendText += '</div>'
            appendText += '<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev" style="color: white!important">'
              appendText += '<span class="glyphicon-chevron-left fa fa-angle-left"></span>'
            appendText += '</a>'
            appendText += '<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next" style="color: white!important">'
              appendText += '<span class="glyphicon-chevron-right fa fa-angle-right"></span>'
            appendText += '</a>'

            $('#myCarousel').html(appendText);
            $.each(banners, function(idx, ban) {
              if(idx == 0){
                appendText = '<li data-target="#myCarousel" data-slide-to="'+idx+'" class="active"></li>'
              } else {
                appendText = '<li data-target="#myCarousel" data-slide-to="'+idx+'"></li>'
              }
              $('#banner-web-control').append(appendText);
              if(idx == 0){
                appendText = '<div class="item active">'
              } else {
                appendText = '<div class="item">'
              }

              if(ban.open_new_tab == true){
                newTab = 'target="_blank"'
              } else {
                newTab = ''
              }
                appendText += '<a id="'+bannerId[idx]+'" href="'+ban.link+'" '+newTab+'>'
                  appendText += '<img src="'+ban.original.url+'" alt="carousel image" />'
                appendText += '</a>'
              appendText += '</div>'
              $('#banner-web-content').append(appendText)
            })
            $('.carousel').carousel({interval: 3000});
            $('#myCarousel').carousel('cycle');
          }
        }
      })
    };
    function getMWebBanner() {
      actionWebApiRestrict('/v1/top-banner/mobile-web', 'GET').done(function(json) {
        if (json.status == 600) {
          var appendText = ''
          var newTab = ''
          banners = json.data;
          if(banners.length == 1) {
            if(banners[0].open_new_tab == true){
              newTab = 'target="_blank"'
            }
            appendText += '<a href="'+banners[0].link+'" '+newTab+'>';
              appendText += '<img class="no-web" src="'+banners[0].original.url+'" style="width: 100%"/>'
            appendText += '</a>'
            $('#banner-container').append(appendText);
          }else {
            appendText += '<div id="myCarousel2" class="carousel slide no-web" data-ride="carousel" >'
            appendText += '</div>'
            $('#banner-container').append(appendText);

            appendText = '<ol class="carousel-indicators" id="banner-mweb-control">'
            appendText += '</ol>'
            appendText += '<div class="carousel-inner text-center background-white" role="listbox" id="banner-mweb-content">'
            appendText += '</div>'
            appendText += '<a class="left carousel-control" href="#myCarousel2" role="button" data-slide="prev" style="color: white!important">'
              appendText += '<span class="glyphicon-chevron-left fa fa-angle-left"></span>'
            appendText += '</a>'
            appendText += '<a class="right carousel-control" href="#myCarousel2" role="button" data-slide="next" style="color: white!important">'
              appendText += '<span class="glyphicon-chevron-right fa fa-angle-right"></span>'
            appendText += '</a>'
            $('#myCarousel2').html(appendText);
            $.each(banners, function(idx, ban) {
              if(idx == 0){
                appendText = '<li data-target="#myCarousel2" data-slide-to="'+idx+'" class="active"></li>'
              } else {
                appendText = '<li data-target="#myCarousel2" data-slide-to="'+idx+'"></li>'
              }
              $('#banner-mweb-control').append(appendText);
              if(idx == 0){
                appendText = '<div class="item active">'
              } else {
                appendText = '<div class="item">'
              }

              if(ban.open_new_tab == true){
                newTab = 'target="_blank"'
              } else {
                newTab = ''
              }
              appendText += '<a href="'+ban.link+'" '+newTab+'>'
                appendText += '<img src="'+ban.original.url+'" alt="carousel image" />'
              appendText += '</a>'
              appendText += '</div>'
              $('#banner-mweb-content').append(appendText)
            })
            $('.carousel').carousel({interval: 3000});
            $('#myCarousel2').carousel('cycle');
          }
        }
      })
    };

    var getInstagramFeed = function(name) {
      $.get('https://www.instagram.com/'+name+'/?__a=1', function(data) {
        var appendText = ''
        for(var i = 0; i < 10; i++) {
          appendText += '<a href="//instagram.com/p/'+data.user.media.nodes[i].code+'" target="_blank">'
          appendText += '<img src="'+data.user.media.nodes[i].thumbnail_resources[0].src+'" />'
          appendText += '</a>'
        }
        $('#instafeed').html(appendText)
      });
    }

    var socmed = ['fb','tw','ig','yt'];
    var socmedLabel = ['Facebook','Twitter','Instagram','Youtube'];
    $.each(socmed, function(index, val) {
      var containerName = 'home-ig-'+val;
      var bwName = 'home-ig-'+val+'-bw'
      var rgbName = 'home-ig-'+val+'-rgb'
      $(document).on({
        mouseenter: function () {
            $('#'+bwName).toggleClass('collapse')
            $('#'+rgbName).toggleClass('collapse')
        },
        mouseleave: function () {
          $('#'+bwName).toggleClass('collapse')
          $('#'+rgbName).toggleClass('collapse')
        }
      }, '#'+containerName);
      $('#'+containerName).on({
        click: function () {
            eventClick('Social Media',socmedLabel[index])
        }
      }, 'a');
    });
    var eventClick = function(category,label){
      if(label != ''){
        ga('send', 'event', category, 'Click', label)
      }else{
        ga('send', 'event', category, 'Click')
      }
    }
    $('#completeness-bar-text').on('click', function(e) {
      eventClick('Progress Bar','Complete Profile')
    });
    $('#verification-bar').on('click','.clickable', function(e) {
      eventClick('Progress Bar','Verify Email')
    });
    $('.womanchat-home-button').on('click', function(e) {
      eventClick('Womanlounge','Load More')
    });
    $('#womanchat-new').on('click','.grid-womanchat', function(e) {
      eventClick('Womanlounge','Conversation')
    });
    var bannerId = ['first_banner','second_banner','third_banner','fourth_banner','fifth_banner']
    var bannerLabel = ['First Banner','Second Banner','Third Banner','Fourth Banner','Fifth Banner'];
    var articleLabel = ["First Article","Second Article","Third Article","Fourth Article","Fifth Article"];

    $.each(bannerId, function(index, val) {
      $(document).on({
        click: function () {
            eventClick('Slider Banner',bannerLabel[index])
        }
      }, '#'+bannerId[index]);
    });

    $(document).on('click', '.editor_choice', function(e){
        var editorIndex = $(this).index()
        eventClick('Editor Pick',articleLabel[editorIndex])
    })
    $(document).on('click', '.trending-big-cover', function(e){
        var trendingIndex = $(this).parent().parent().index()

        eventClick('Trending',articleLabel[trendingIndex])
    })
    $(document).on('click', '.treding-small-content', function(e){
        var trendingIndex = $(this).parent().index()
        eventClick('Trending',articleLabel[trendingIndex+2])
    })
    $('#article-stream').on('click', '.grid-item', function(e){
        eventClick('Latest Update','')
    })
  });
