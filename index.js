
//iframeFix patch

// function jqueryui_resizable_iframefix(){
//     $.ui.plugin.add("resizable", "iframeFix", { 
//         start: function(event, ui) { 
//         var o = $(this).data('resizable').options; 
//             $(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() { 
//                 $('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>') 
//                 .css({ 
//                     width: this.offsetWidth+"px", height: this.offsetHeight+"px", 
//                     position: "absolute", opacity: "0.001", zIndex: 1000 
//                 }) 
//                 .css($(this).offset()) 
//                 .appendTo("body"); 
//             }); 
//         }, 
//         stop: function(event, ui) { 
//             $("div.ui-resizable-iframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers 
//         } 
//     }); 
// }


var msp = function(){
    var players = [];

    function createPlayer(params){

    }

    return {};
}();

$(document).ready(function(){
    jqueryui_resizable_iframefix();
    $("#player1").draggable().resizable();
    $(".chat").resizable({containment: "parent",iframeFix: true,handles:'s,w,sw'});
});
