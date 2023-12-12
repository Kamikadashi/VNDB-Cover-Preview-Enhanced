// ==UserScript==
// @name        VNDB Cover Preview Enhanced
// @namespace   https://twitter.com/Kuroonehalf
// @namespace   https://kuroonehalf.com
// @include     https://vndb.org*
// @include     https://vndb.org/v*
// @include     https://vndb.org/g*
// @include     https://vndb.org/p*
// @include     https://vndb.org/u*
// @include     https://vndb.org/s*
// @include     https://vndb.org/r*
// @include     https://vndb.org/c*
// @include     https://vndb.org/t*
// @version     2.0.2
// @description Previews covers in vndb.org searches when hovering over the respective hyperlinks.
// @grant       GM_setValue
// @grant       GM_getValue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @license     http://creativecommons.org/licenses/by-nc-sa/4.0/
// @inject-into content
// ==/UserScript==

const TagLinkTest = /^https:\/\/vndb.org\/g\/links/;
const UserLinkTest = /^https:\/\/vndb.org\/u[0-9]+/;
const VNLinkTest = /^https:\/\/vndb.org\/v[0-9]+/;
const CharacterLinkTest = /^https:\/\/vndb.org\/c[0-9]+/;
const pageURL = document.URL;

$('[title]').mouseover(function() {
    $(this).data('title', $(this).attr('title')).removeAttr('title');
});

jQuery.fn.center = function () {
    const windowHeight = $(window).height();
    const boxHeight = $(this).outerHeight();
    const scrollOffset = $(window).scrollTop();
    const leftoffset = $('tr a:hover').get(0).getBoundingClientRect().left;
    const topoffset =  $('tr a:hover').get(0).getBoundingClientRect().top;
    let newTopOffset;

    if (topoffset - boxHeight / 2 < 10) {
        newTopOffset = 10;
    } else if (topoffset + boxHeight / 2 > windowHeight - 10) {
        newTopOffset = windowHeight - boxHeight - 10;
    } else {
        newTopOffset = topoffset - boxHeight / 2;
    }

    this.css("top", newTopOffset + scrollOffset);

    if (pageURL.search(TagLinkTest) != -1 || pageURL.search(UserLinkTest) != -1 || pageURL.search(VNLinkTest) != -1)
        this.css("left", leftoffset + $(window).scrollLeft() - $(this).outerWidth() - 25);
    else
        this.css("left", Math.max(0, $(window).width() * 0.6 + $(window).scrollLeft() - $(this).outerWidth() / 2));

    return this;
};

$('body').append('<div id="popover"></div>');
$('#popover').css({position: 'absolute', zIndex: '10', boxShadow: '0px 0px 5px black', display: 'none'});

let timeoutId;

function handleMouseOver() {
    const VNnumber = $(this).attr('href');
    const pagelink = 'https://vndb.org' + VNnumber;

    timeoutId = setTimeout(function() {
        if (GM_getValue(pagelink)) {
            const retrievedLink = GM_getValue(pagelink);
            $('#popover').empty().append('<img src="' + retrievedLink + '"></img>');
            $('#popover img').on('load', function() {
                if (this.height === 0) {
                    GM_deleteValue(pagelink);
                } else {
                    $('#popover').center().css('display', 'block');
                }
            });
        } else {
            $.ajax({
                url: pagelink,
                dataType: 'text',
                success: function (data) {
                    const parser = new DOMParser();
                    const dataDOC = parser.parseFromString(data, 'text/html');
                    const imagelink = pagelink.search(CharacterLinkTest) !== -1 ? dataDOC.querySelector(".charimg img").src : dataDOC.querySelector(".vnimg img").src;
                    $('#popover').empty().append('<img src="' + imagelink + '"></img>');
                    $('#popover img').on('load', function() {
                        if (this.height === 0) {
                            return;
                        } else {
                            $('#popover').center().css('display', 'block');
                            GM_setValue(pagelink, imagelink);
                        }
                    });
                }
            });
        }
    }, 500); // Delay of 0.5 seconds
}

function handleMouseLeave() {
    clearTimeout(timeoutId);
    $('#popover').empty().css('display', 'none');
}

$('body').on('mouseover', 'tr a', handleMouseOver);
$('body').on('mouseleave', 'tr a', handleMouseLeave);

$(window).scroll(function() {
    if ($('tr a:hover').length) {
        $('#popover').center();
    }
});
