
//iframeFix patch for resizable elements
//http://stackoverflow.com/a/13473569/3973896
function resizable_start(event, ui){
    $('<div class="ui-resizable-iframeFix" style="background: #fff;">&nbsp;</div>')
    .css({
        width:'100%', height: '100%',
        position: "absolute",  opacity: "0.001", zIndex: 1000, left: "0", top: "0"
    })
    .appendTo("body");
    console.log("start");
}

function resizable_stop(event, ui){
    $('.ui-resizable-iframeFix').remove();
    console.log("stop");
}

var msp = function(){
    var players = [];

    function createPlayer(params){

    }

    return {};
}();

$(document).ready(function(){
    // jqueryui_resizable_iframefix();
    $("#player1").draggable().resizable();
    $(".chat").draggable({containment: "parent", iframeFix: true}).resizable({containment: "parent",handles:'s,w,sw',"start":resizable_start,"stop":resizable_stop});
});
