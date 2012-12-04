/**
 * @author Ingimar Samuelsson
 * @doc
 *  Content-display and User-interaction
 * @end
 */
var isUserAction = new Object();
var duplicateArray = new Array('hot','latest','top','view');
var actionArray = new Array('votedown','voteup','report');
var actionFields = new Array('Down_Vote','Up_Vote','Report_Count',
                                'Clicks','LastClicked');
var cookieStart = 'er1new5_';
var articleTemplates;

/**
 * @author Ingimar Samuelsson
 * @doc
 *  When the page loads - get article templates
 *  and call article information fetcher and twitter feed
 * @end
 */
jQuery(document).ready(function() {
    jQuery('#rightside').hide();
    jQuery('#wholepage').hide();
    jQuery('#first_loading').css('height','150px');
    jQuery('#first_loading').css('padding-top','65px');
    jQuery('#first_loading').html('<img src="' + jableDir 
        + '/custom-img/loading.gif">');
    jQuery.get(jableDir +'_get_templates.php',{jableurl:jableDir},function(str){
        articleTemplates = str.split('<split_between_templates>');
        getNewsJSON();
        getTweets();
        setInterval(getTweets, 20000);
    });

});

/**
 * @author Ingimar Samuelsson
 * @doc
 *  User-interaction. User clicks buttons, images are swapped
 *  and information is changed in the database and users cookies
 * @end
 */
function articleAction(item,action,undo) {
    var id = jQuery(item).attr('id').split('_')[1];
    if( isUserAction[id][Math.floor(action/2)] == true )
        return;
    updateCounter(id,action,undo);
    isUserAction[id][Math.floor(action/2)] = true;
    changeUserButtons(item,id);
    jQuery.get(jableDir + '_article_action.php',
            {id:id,action:action,undo:undo},function() {
        isUserAction[id][Math.floor(action/2)] = false;
    });
/*
    function setActionCookies(id,action,undo) {
        var cookie = getCookie(cookieStart+actionFields[action]);
        if( undo == false ) {
            setCookie(cookieStart+actionFields[action],
                        cookie+':'+id,30);
            if( action == 0 )
                setCookie(cookieStart+actionFields[1],
                        cookie.replace(':'+id,''),30);
            else if( action == 1 )
                setCookie(cookieStart+actionFields[0],
                        cookie.replace(':'+id,''),30);
        }
        else
            setCookie(cookieStart+actionFields[action],
                        cookie.replace(':'+id,''),30);
    }
    function setCookie(name,value,days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
        document.cookie = name+"="+value+expires+"; path=/";
    }
    function getCookie(c_name) {
        var i,x,y,ARRcookies=document.cookie.split(";");
        for (i=0;i<ARRcookies.length;i++) {
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x==c_name){
                return unescape(y);
            }
        }
        return null;
    }
*/
    function updateCounter(id,action,undo) {
        for( var i = 0 ; i < duplicateArray.length ; i++ ) {
            if( jQuery('#' + duplicateArray[i] + '_' + id + '_' + actionArray[0] 
                    + '_count').length != 0 ) {
                if( undo == true && action == 0 )
                    iterateCounter('#' + duplicateArray[i] + '_' + id + '_' 
                        + actionArray[0] + '_count',false);
                else if( undo == true && action == 1 )
                    iterateCounter('#' + duplicateArray[i] + '_' + id + '_' 
                        + actionArray[1] + '_count',false);
                else if( undo == false && action == 0 ) {
                    iterateCounter('#' + duplicateArray[i] + '_' + id + '_' 
                        + actionArray[0] + '_count',true);
                    if( jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                                + actionArray[1] + '_active').is(':visible') ) {
                        iterateCounter('#' + duplicateArray[i] + '_' + id + '_' 
                            + actionArray[1] + '_count',false);
                        jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                            + actionArray[1] + '_active').hide();
                        jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                            + actionArray[1]).show();
                    }
                } else if( undo == false && action == 1 ) {
                    iterateCounter('#' + duplicateArray[i] + '_' + id + '_' 
                        + actionArray[1] + '_count',true);
                    if( jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                                + actionArray[0] + '_active').is(':visible') ) {
                        iterateCounter('#' + duplicateArray[i] + '_' + id + '_' 
                            + actionArray[0] + '_count',false);
                        jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                            + actionArray[0] + '_active').hide();
                        jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                            + actionArray[0]).show();
                    }
                }
            }
        }
    }
    function iterateCounter(id,up) {
        var org = parseInt( jQuery(id).text(), 10 );
        if( up ){
            jQuery(id).text( ( org + 1 ) );
            jQuery(id + '_active').text( ( org + 1 ) );
        }else{            
            jQuery(id).text( ( org - 1 ) );
            jQuery(id + '_active').text( ( org - 1 ) );
        }
            
    }
    function changeUserButtons(item,id) {
        var htmlID = jQuery(item).attr('id');
        var action = htmlID.split('_')[2];
        var contrAction = actionArray[0];
        if( action == actionArray[0] )
            contrAction = actionArray[1];
        for( var i = 0 ; i < duplicateArray.length ; i++ ) {
            if( jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                    + action).length != 0 ) {
                if( htmlID.indexOf('_active') != -1 ) {
                    jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                        + action + '_active' ).hide();
                    jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                        + action).show();
                }
                else {
                    jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                        + action).hide();
                    jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                        + action + '_active' ).show();
                }
                if( jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                            + contrAction + '_active' ).is(':visible') ) {
                    jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                        + contrAction + '_active' ).hide();
                    jQuery('#' + duplicateArray[i] + '_' + id + '_' 
                        + contrAction).show();
                }
            }
        }
    }
}
var updatingArticles = false;
var articleJSON = new Array();
var isFirstLoad = true;
var idList = '';
/**
 * @author Ingimar Samuelsson
 * @doc
 *  Fetches informations related to articles in JSON format
 *  and adds to HTML Dom
 * @end
 */
function getNewsJSON() {
    updatingArticles = true;
    jQuery('#first_loading').show();
    if( isFirstLoad ) {
        fillRightSide('top',2);
        fillRightSide('latest',1)
    }
    jQuery.post(jableDir + '_get_news.php',{query:'main',ids:idList},
            function(outcome) {
        jQuery('#first_loading').hide();
        if( isFirstLoad ) {
            jQuery('#rightside').show();
            jQuery('#wholepage').show();
        }
        var parse = jQuery.parseJSON(outcome);
        var json = parse.news;
        if( articleJSON[0] != null )
            articleJSON[0] = articleJSON[0].concat(json);
        else
            articleJSON[0] = json;
        if( json.length == 0 ){
            return;
        }

        var leftArc = 1;
        var rightArc = 0;

        for( var i = 0 ; i < json.length ; i++ ) {
            if( idList.indexOf('' + json[i].newsID) == -1 ) {
                if( idList != '' )
                    idList += ',';
                idList += json[i].newsID;
            }
            isUserAction[json[i].newsID] = Array(false,false);
            var template = articleTemplates[3];
            if( json[i].imgwidth > 350 )
                template = articleTemplates[1];
            else if( json[i].imgwidth > 1 )
                template = articleTemplates[2]
            if( i == 0 && isFirstLoad )
                jQuery('#top_hot_news').html( getArticle(json[i], 
                    template, 0 ) );
            else if( leftArc < rightArc )
                jQuery('#news_article_left').append( getArticle(json[i], 
                    template, 0 ) );
            else
                jQuery('#news_article_right').append( getArticle(json[i], 
                    template, 0 ) );
            
            leftArc = jQuery('#news_article_left').height();
            rightArc = jQuery('#news_article_right').height();
        }
        setUserClicked(parse.cookies.Up_Vote,actionArray[1]);
        setUserClicked(parse.cookies.Down_Vote,actionArray[0]);
        setUserClicked(parse.cookies.Report_Count,actionArray[2]);
        isFirstLoad = false;
        updatingArticles = false;
    });
    /**
     * @author Ingimar Samuelsson
     * @doc
     *  Get info for right side of webpage
     * @end
     */
    function fillRightSide(location,index) {
        jQuery.post(jableDir + '_get_news.php',{query:location},function(outcome) {
            var parse = jQuery.parseJSON(outcome);
            var json = parse.news;
            articleJSON[index] = json;
            jQuery('#' + location + '_news').html('');
            for( var i = 0 ; i < json.length ; i++ ) {
                isUserAction[json[i].newsID] = Array(false,false);
                var template = articleTemplates[4];
                if( json[i].Image == 'undef' )
                    template = articleTemplates[5];
                jQuery('#' + location + '_news').append( getArticle(json[i], 
                    template, index ) );

            }
        });        
    }
    /**
     * @author Ingimar Samuelsson
     * @doc
     *  Set's user pre-clicked votes and reports
     * @end
     */
    function setUserClicked(json,str) {
        for( var i = 0 ; i < json.length ; i++ ) {
            if( json[i] != '' ) {
                for( var k = 0 ; k < duplicateArray.length ; k++ ) {
                    jQuery('#' + duplicateArray[k] + '_' + json[i] + '_' 
                        + str).hide();
                    jQuery('#' + duplicateArray[k] + '_'  + json[i] + '_' 
                        + str + '_active').show();
                }
            }
        }
    }
    /**
     * @author Ingimar Samuelsson
     * @doc
     *  Replace template with information related to article
     * @end
     */
    function getArticle(json,template,arrayIndex) {
        var length = 500;
        if( arrayIndex > 0 )
            length = 200;
        var icon_hide = 'visible';
        if( json.Icon == 'undef' )
            icon_hide = 'hidden';
        var descr = json.Description;
        if( descr.length > length )
            descr = descr.substring(0,length) + ' ...';
        return template.replace(/{title}/g,json.Title.replace(/'/g, "´"))
                            .replace(/{down}/g,json.Down_Vote)
                            .replace(/{up}/g,json.Up_Vote)
                            .replace(/{clicks}/g,json.Clicks)
                            .replace(/{host}/g,json.host)
                            .replace(/{description}/g,descr)
                            .replace(/{image}/g,json.Image)
                            .replace(/{icon}/g,json.Icon)
                            .replace(/{URL}/g,json.URL)
                            .replace(/{icon_hide}/g,icon_hide)
                            .replace(/{id}/g,json.newsID)
                            .replace(/{index}/g,arrayIndex)
                            .replace(/{location}/g,duplicateArray[arrayIndex])
                            .replace(/{action0}/g,actionArray[0])
                            .replace(/{action1}/g,actionArray[1])
                            .replace(/{action2}/g,actionArray[2])
                            .replace(/{pubdate}/g,json.Pubdate.split(' ')[0])
                            .replace(/{imgwidth}/g,(json.imgwidth/2))
                            .replace(/{imgheight}/g,(json.imgheight/2));
    }
}

/**
 * @author Ingimar Samuelsson
 * @doc
 *  Get more articles when user gets to the bottom of page
 * @end
 */
$(window).scroll(function() {
    if($(window).scrollTop()+100 >= ($(document).height() - 
            ($(window).height())) && updatingArticles == false )
        getNewsJSON();
});


/**
 * @author Philip Masek
 * @doc
 *  
 * @end
 *
**/
function getTweets() {
    var template = articleTemplates[6];
    var url='http://search.twitter.com/search.json?callback=?&q=%23erlang&rpp=10';
    jQuery.getJSON(url,function(json){

        jQuery('#twitter_feed').empty();

        //a for loop will perform faster when setup like this
        for (var i = 0, len = json.results.length; i < len; i++) {

           //instead of appending each result, add each to the buffer array
           jQuery('#twitter_feed').append(twitterTemplate(json.results[i],template));
        }
    });
}
/**
 * @author Philip Masek
 * @doc
 *  
 * @end
 *
**/
function twitterTemplate(json, template, id){
    return template.replace(/{profile_img}/g,json.profile_image_url).
                    replace(/{text}/g,urlify(json.text)).
                    replace(/{from_user}/g,json.from_user).
                    replace(/{from_user_id}/g,json.from_user_id);
}
/**
 * @author Philip Masek
 * @doc
 *  
 * @end
 *
**/
function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    })
}
