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
    console.log("asdsa");
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

// function chatOpacity(){
//     var chat = $(".chat");
//     var chat_div = chat.find(".chat-barrier");
//     var chat_embed = chat.find(".embed");

//     var stream = $(".stream");
//     chat_div.on("mouseover",function(ev){
//         // if(ev.target === this){
//             chat.css("opacity","0.7");
//         // }
//     });
//     stream.on("mouseover",function(ev){
//         // if(ev.target === this){
//             chat.css("opacity","0");
//             chat_div.css("display","block");
//         // }
//     });
//     chat_div.on("click",function(ev){
//         console.log("click");
//         chat.css("opacity","1");
//         chat_div.css("display","none");
//     });

//     $("body").on("mouseleave",function(ev){
//         chat.css("opacity",0);
//         chat_div.css("display","block");

//     });
// }
var multi_stream_player = function (){
    var player_id = 0;
    function parseChannelId(jq, channel_id, data_attr, attr){
        jq.attr( attr, jq.attr(data_attr).replace("\{id\}",channel_id).toLowerCase());
        jq.removeAttr(data_attr);
    }

    function setPlayerId(jq){
        player_id++;
        jq.attr("id","player" + player_id);
    }

    function addPlayer(channel_id){
        var new_player = $(".template").clone().attr("class","player");
        console.log(new_player[0]);
        parseChannelId(new_player.children().eq(0), channel_id, "data-src", "src");
        setPlayerId(new_player);
        setPlayerEvents(new_player);
        $(".main-container").append(new_player);
    }

    function setPlayerEvents(jq){
        jq.draggable({
            containment: "parent",
            iframeFix: true}
        ).resizable({
            containment: "parent",
            handles: 'e,s,w,ew,sw',
            "start": resizable_start,
            "stop": resizable_stop
        });
    }

    function mainUiEvents(){
        $(".menu").draggable({containment: "parent"}).resizable({containment: "parent",handles:'e,s,w,ew,sw'});
        $(".menu").find("button").button();

        $("#menu-add").on("click",function (ev){
            addPlayer($("#menu-channel-id").val());
        });
    }

    return {
        init: mainUiEvents
    };
}(); 


$(document).ready(function(){
    multi_stream_player.init();
});







