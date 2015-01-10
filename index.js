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
    var players_json = {players: []};
    function parseChannelId(jq, channel_id, data_attr, attr){
        jq.attr( attr, jq.attr(data_attr).replace("\{id\}",channel_id).toLowerCase());
        jq.removeAttr(data_attr);
    }

    function setPlayerId(jq){
        player_id++;
        jq.attr("id","player" + player_id);
    }

    function setPlayerPos(player, x, y, width, height){
        //need error checking
        player.css("left",x + "px");
        player.css("top",y + "px");
        player.css("width",width + "px");
        player.css("height",height + "px");
    }

    function addPlayer(channel_id){
        var new_player = $(".template").clone().attr("class","player");
        parseChannelId(new_player.children().eq(0), channel_id, "data-src", "src");
        new_player.attr("data-channel",channel_id);
        setPlayerId(new_player);
        setPlayerEvents(new_player);
        setPlayerPos(new_player, $("#menu-player-x").val(), $("#menu-player-y").val(), $("#menu-player-width").val(), $("#menu-player-height").val());
        $(".main-container").append(new_player);
        return new_player;
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

    function appendPlayerJSON(player){
        players_json.players.push({
            id: player.attr("id"),
            //site:
            channel: player.attr("data-channel"),
            x: player.css("left"),
            y: player.css("top"),
            width: player.css("width"),
            height: player.css("height")
            //z-index
        });
        console.log(players_json.players);
    }

    function appendPlayerList(player){
        var player_list = $("#menu-players");
        player_list.append('<option value="' + player.attr("id") + '">' + player.attr("data-channel") + '</option>');
        console.log(players_json);
    }

    function updateMenuJSON(){
        var menu = $(".menu");
        players_json.menu = {
            x: menu.css("left"),
            y: menu.css("top")
            //z-index
        };

    }

    function init(){
        updateMenuJSON();
        mainUiEvents();
    }

    function getPlayerInfo(player_id){
        var player = $("#"+player_id);
        console.log(player.attr("data-channel"));


        $("#menu-channel-url").val( player.attr("data-channel"));
        $("#menu-player-x").val( player.css("left").replace("px",""));
        $("#menu-player-y").val( player.css("top").replace("px",""));
        $("#menu-player-width").val( player.css("width").replace("px",""));
        $("#menu-player-height").val( player.css("height").replace("px",""));
    }

    function mainUiEvents(){
        $("#menu-update")[0].disabled = true;
        $("#menu-remove")[0].disabled = true;

        
        $(".menu").draggable({containment: "parent"});//.resizable({containment: "parent",handles:'e,s,w,ew,sw'});
        $(".menu").find("button").button();

        $("#menu-add").on("click",function (ev){
            var new_player = addPlayer($("#menu-channel-url").val()); //replace with parseUrl() later
            appendPlayerJSON(new_player);
            appendPlayerList(new_player);
        });

        $("#menu-players").on("click", function (ev){
            console.log($(ev.target).prop("tagName").toLowerCase());
            var option = $(ev.target);
            if( option.prop("tagName").toLowerCase() === "option"){
                getPlayerInfo(option.val());
            }
        });
    }

    return {
        init: init
    };
}(); 


$(document).ready(function(){
    multi_stream_player.init();
});







