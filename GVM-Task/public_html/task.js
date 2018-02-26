$(function () {
    $(document).ready(function () {
        getInstagramFeed('womantalk_com');
    });
    var getInstagramFeed = function (name) {
        $.get('https://www.instagram.com/' + name + '/?__a=1', function (data) {
            var appendText = ''
            for (var i = 0; i < 10; i++) {
                appendText += '<a href="//instagram.com/p/' + data.user.media.nodes[i].code + '" target="_blank">'
                appendText += '<img src="' + data.user.media.nodes[i].thumbnail_resources[0].src + '" />'
                appendText += '</a>'
            }
            $('#instafeed').html(appendText)
        });
    }
});
