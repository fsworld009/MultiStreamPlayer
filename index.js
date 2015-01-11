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
    var local_storage;
    
    var menu = {
        channel_url : $("#menu-channel-url"),
        x: $("#menu-player-x"),
        y: $("#menu-player-y"),
        width: $("#menu-player-width"),
        height: $("#menu-player-height"),
        add: $("#menu-add"),
        update: $("#menu-update"),
        remove: $("#menu-remove"),
        save: $("#menu-save"),
        load: $("#menu-load"),
        players: $("#menu-players"),
        update_id: $("#menu-update-id"),
        profiles: $("#menu-profiles")
    };

    function resetLocalStorage(){
        local_storage= {profiles : []};
    }

    
    function parseChannelId(jq, channel_id, data_attr, attr){
        jq.attr( attr, jq.attr(data_attr).replace("\{id\}",channel_id).toLowerCase());
        // jq.removeAttr(data_attr);
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

    function addPlayer(channel_id, x, y, width, height){
        var new_player = $(".template").clone().attr("class","player");
        parseChannelId(new_player.children().eq(0), channel_id, "data-src", "src");
        new_player.attr("data-channel",channel_id);
        setPlayerId(new_player);
        setPlayerEvents(new_player);
        setPlayerPos(new_player, x, y, width, height);
        new_player.on("click",onTop);
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

    

    function DomToJsObject(profile_name){
        var new_profile = {players:[]};
        
        $(".player").each(function(index, player){
            player = $(player);
            new_profile.players.push({
                id: player.attr("id"),
                site: "twitch", //future update
                channel: player.attr("data-channel"),
                x: player.css("left").replace("px",""),
                y: player.css("top").replace("px",""),
                width: player.css("width").replace("px",""),
                height: player.css("height").replace("px",""),
                zindex: player.css("z-index"),
                player: {} //future update
            });
        });
        
        var menu = $(".menu");
        new_profile.menu = {
            x: menu.css("left"),
            y: menu.css("top"),
            zindex: menu.css("z-index")
        };
        local_storage[profile_name] = new_profile;
    }

    function JsObjectToLocalStorage(){
        localStorage.setItem("MultiStreamPlayer",$.toJSON(local_storage));
    }

    function updateProfileList(new_profile){
        console.log(new_profile);
        if(local_storage.profiles.indexOf(new_profile) === -1 && new_profile !== "[auto]"){
            local_storage.profiles.push(new_profile);
        }
    }

    function appendProfileList(){
        $(".profiles-option").remove();
        $.each(local_storage.profiles, function(index, profile){
            menu.profiles.append('<option class="profiles-option" value="' + profile + '">' + profile + '</option>');
        });
    }

    function save(profile_name){
        //checkProfileName
        LocalStorageToJsObject();
        
        DomToJsObject(profile_name);
        console.log(local_storage);
        updateProfileList(profile_name);
        appendProfileList();
        JsObjectToLocalStorage();
    }

    function LocalStorageToJsObject(){
        local_storage = $.parseJSON(localStorage.getItem("MultiStreamPlayer"));
        if(local_storage === null){
            resetLocalStorage();
        }
    }

    function JsObjectToDom(profile_name){
        $(".player").remove();
        
        var menu = $(".menu");
        menu.css("left",local_storage[profile_name].menu.x);
        menu.css("top",local_storage[profile_name].menu.y);
        menu.css("z-index",local_storage[profile_name].menu.zindex);
        
        $(".players-option").remove();
        
        $.each(local_storage[profile_name].players, function(index, player){
            var new_player = addPlayer(player.channel, player.x, player.y, player.width, player.height);
            new_player.css("z-index",player.zindex);
            appendPlayerList(new_player);
            

        });
    }

    function load(profile_name){
        player_id = 0;
        LocalStorageToJsObject();
        JsObjectToDom(profile_name);
    }

    function appendPlayerList(player){
        menu.players.append('<option class="players-option" value="' + player.attr("id") + '">' + player.attr("data-channel") + '</option>');
    }

    function init(){
        mainUiEvents();
        LocalStorageToJsObject();
        appendProfileList();
        autoSave();
    }

    function autoSave(){
        $(window).unload(function(){save("[auto]");});
    }

    function getPlayerInfo(player_id){
        var player = $("#"+player_id);


        menu.channel_url.val( player.attr("data-channel"));
        menu.x.val( player.css("left").replace("px",""));
        menu.y.val( player.css("top").replace("px",""));
        menu.width.val( player.css("width").replace("px",""));
        menu.height.val( player.css("height").replace("px",""));
        menu.update_id.val( player.attr("id") );
    }

    function menuButtonControl(mode){
        switch(mode){
        case "add":
            menu.add.button("option","disabled",false);
            menu.update.button("option","disabled",true);
            menu.remove.button("option","disabled",true);
            return;
        case "update":
            menu.add.button("option","disabled",true);
            menu.update.button("option","disabled",false);
            menu.remove.button("option","disabled",false);
            return;
        case "multiple_selection":
           // 
        }
    }

    function clearMenuOptions(){
        menu.channel_url.val("");
        menu.x.val("10");
        menu.y.val("10");
        menu.width.val("640");
        menu.height.val("360");
    }

    function updatePlayer(id, channel_id, x, y, width, height){
        var player = $("#"+id);
        //change channel url
        var old_channel = player.attr("data-channel");
        if(channel_id !== old_channel) {
            parseChannelId(player.children().eq(0), channel_id, "data-src", "src");
            menu.players.find('[value="' + id + '"]').text(channel_id);
            player.attr("data-channel",channel_id);

        }
        setPlayerPos(player, x,y,width,height);

        // updatePlayerJSON(player);

    }

    function removePlayer(id){
        $("#"+id).remove();
        menu.players.find('[value="' + id + '"]').remove();
    }

    function onTop(ev){
        $(".top").removeClass("top");
        $(this).addClass("top");
    }

    function mainUiEvents(){

        var menu_div = $(".menu");
        menu_div.draggable({containment: "parent"});//.resizable({containment: "parent",handles:'e,s,w,ew,sw'});
        menu_div.find("button").button();
        menu_div.on("click",onTop);


        menuButtonControl("add");

        menu.add.on("click",function (ev){
            var new_player = addPlayer(menu.channel_url.val(),menu.x.val(), menu.y.val(), menu.width.val(), menu.height.val()); //replace with parseUrl() later
            appendPlayerList(new_player);
        });

        menu.profiles.combobox();

        menu.players.on("click", function (ev){
            var option = $(ev.target);
            if(ev.target.value === "new_player"){
                clearMenuOptions();
                menuButtonControl("add");
                return;
            }


            
            if( option.prop("tagName").toLowerCase() === "option"){
                menuButtonControl("update");
                getPlayerInfo(option.val());
            }
        });

        menu.update.on("click", function(ev){
            updatePlayer(menu.update_id.val(), menu.channel_url.val(),menu.x.val(), menu.y.val(), menu.width.val(), menu.height.val());
        });

        menu.remove.on("click", function(ev){
            removePlayer(menu.update_id.val());
        });

        menu.save.on("click", function(ev){
            save($(".custom-combobox-input").val());
        });

        menu.load.on("click", function(ev){
            load(menu.profiles.val());
        });

        
    }

    return {
        init: init
    };
}(); 

$(document).ready(function(){
    multi_stream_player.init();
});







