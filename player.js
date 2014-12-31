//http://save-coco.blogspot.com/2010/02/javascriptgetexample.html
function getQueryString( paramName ){
    paramName = paramName .replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]").toLowerCase();
    var reg = "[\\?&]"+paramName +"=([^&#]*)";
    var regex = new RegExp( reg );
    var regResults = regex.exec( window.location.href.toLowerCase() );
    if( regResults === null ) return "";
    else return regResults [1];
}


//iframeFix patch for resizable elements
//http://stackoverflow.com/a/13473569/3973896
function resizable_start(event, ui){
    $('<div class="ui-resizable-iframeFix" style="background: #fff;">&nbsp;</div>')
    .css({
        width:'100%', height: '100%',
        position: "absolute",  opacity: "0.001", zIndex: 1000, left: "0", top: "0"
    })
    .appendTo("body");
}

function resizable_stop(event, ui){
    $('.ui-resizable-iframeFix').remove();
}

function chatOpacity(){
    var chat = $(".chat");
    var chat_div = chat.find(".chat-barrier");
    var chat_embed = chat.find(".embed");

    var stream = $(".stream");
    stream.on("mouseout",function(ev){
        // if(ev.target === this){
            chat.css("opacity","0.7");
        // }
    });
    stream.on("mouseover",function(ev){
        // if(ev.target === this){
            chat.css("opacity","0");
            chat_div.css("display","block");
        // }
    });
    chat_div.on("click",function(ev){
        console.log("click");
        chat.css("opacity","1");
        chat_div.css("display","none");
    });
}

function chatUiEvents(){
    $(".chat").draggable({containment: "parent", iframeFix: true}).resizable({containment: "parent",handles:'e,s,w,ew,sw',"start":resizable_start,"stop":resizable_stop});
}
    
function loadStreamAndChat(){
    var channel_id = getQueryString("channel");
    if(channel_id !== ""){
        $(".embed").each(function (index, element){
            console.log(element.nodeName.toLowerCase());
            if( element.nodeName.toLowerCase() === "iframe"){
                $(element).attr("src", $(element).attr("data-src").replace("\{id\}",channel_id));
            }else{
                //twitch object
                $(element).attr("data", $(element).attr("data-data").replace("\{id\}",channel_id));
                var flashvars = $(element).find('param[name="flashvars"]');
                flashvars.attr("value", flashvars.attr("data-value").replace("\{id\}",channel_id));
            }
        });
    }
}

function setStreamBarrier(){
    console.log($(".stream").height());
}


$(document).ready(function(){
    // jqueryui_resizable_iframefix();
    chatUiEvents();
    chatOpacity();
    loadStreamAndChat();
    setStreamBarrier();
});







