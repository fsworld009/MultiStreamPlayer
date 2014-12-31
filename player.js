
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

var msp = function(){
    var players = [];

    function createPlayer(params){

    }

    return {};
}();


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
    

$(document).ready(function(){
    // jqueryui_resizable_iframefix();
    $("#player1").draggable().resizable();
    $(".chat").draggable({containment: "parent", iframeFix: true}).resizable({containment: "parent",handles:'e,s,w,ew,sw',"start":resizable_start,"stop":resizable_stop});
    chatOpacity();
});







