/*
jquery-resizable
Version 0.17 - 3/31/2016
В© 2015 Rick Strahl, West Wind Technologies
www.west-wind.com
Licensed under MIT License
*/
(function($, undefined) {
    function getHandle(selector, $el) {
        if (selector.trim()[0] === ">") {
            selector = selector.trim().replace(/^>\s*/, "");

            return $el.find(selector);
        }

        return selector ? $(selector) : $el;
    }

    if ($.fn.resizable)
        return;

    $.fn.resizable = function fnResizable(options) {
        var opt = {
            // selector for handle that starts dragging
            handleSelector: null,
            // resize the width
            resizeWidth: true,
            // resize the height
            resizeHeight: true,            
            // the side that the width resizing is relative to
            resizeWidthFrom: 'right',
            // the side that the height resizing is relative to
            resizeHeightFrom: 'bottom',            
            // hook into start drag operation (event passed)
            onDragStart: null,
            // hook into stop drag operation (event passed)
            onDragEnd: null,
            // hook into each drag operation (event passed)
            onDrag: null,
            // disable touch-action on $handle
            // prevents browser level actions like forward back gestures
            touchActionNone: true
        };
        if (typeof options == "object") opt = $.extend(opt, options);

        return this.each(function () {
            var startPos, startTransition;

            var $el = $(this);

            var $handle = getHandle(opt.handleSelector, $el);

            if (opt.touchActionNone)
                $handle.css("touch-action", "none");

            $el.addClass("resizable");
            $handle.bind('mousedown.rsz touchstart.rsz', startDragging);

            function noop(e) {
                e.stopPropagation();
                e.preventDefault();
            };

            function startDragging(e) {
                startPos = getMousePos(e);
                startPos.width = parseInt($el.width(), 10);
                startPos.height = parseInt($el.height(), 10);

                startTransition = $el.css("transition");
                $el.css("transition", "none");

                if (opt.onDragStart) {
                    if (opt.onDragStart(e, $el, opt) === false)
                        return;
                }
                opt.dragFunc = doDrag;

                $(document).bind('mousemove.rsz', opt.dragFunc);
                $(document).bind('mouseup.rsz', stopDragging);
                if (window.Touch || navigator.maxTouchPoints) {
                    $(document).bind('touchmove.rsz', opt.dragFunc);
                    $(document).bind('touchend.rsz', stopDragging);
                }
                $(document).bind('selectstart.rsz', noop); // disable selection
            }

            function doDrag(e) {
                var pos = getMousePos(e), newWidth, newHeight;

                if (opt.resizeWidthFrom === 'left')
                    newWidth = startPos.width - pos.x + startPos.x;
                else
                    newWidth = startPos.width + pos.x - startPos.x;

                if (opt.resizeHeightFrom === 'top')
                    newHeight = startPos.height - pos.y + startPos.y;
                else
                    newHeight = startPos.height + pos.y - startPos.y;

                if (!opt.onDrag || opt.onDrag(e, $el, newWidth, newHeight, opt) !== false) {
                    if (opt.resizeHeight)
                        $el.height(newHeight);                    

                    if (opt.resizeWidth)
                        $el.width(newWidth);                    
                }
            }

            function stopDragging(e) {
                e.stopPropagation();
                e.preventDefault();

                $(document).unbind('mousemove.rsz', opt.dragFunc);
                $(document).unbind('mouseup.rsz', stopDragging);

                if (window.Touch || navigator.maxTouchPoints) {
                    $(document).unbind('touchmove.rsz', opt.dragFunc);
                    $(document).unbind('touchend.rsz', stopDragging);
                }
                $(document).unbind('selectstart.rsz', noop);

                // reset changed values
                $el.css("transition", startTransition);

                if (opt.onDragEnd)
                    opt.onDragEnd(e, $el, opt);

                return false;
            }

            function getMousePos(e) {
                var pos = { x: 0, y: 0, width: 0, height: 0 };
                if (typeof e.clientX === "number") {
                    pos.x = e.clientX;
                    pos.y = e.clientY;
                } else if (e.originalEvent.touches) {
                    pos.x = e.originalEvent.touches[0].clientX;
                    pos.y = e.originalEvent.touches[0].clientY;
                } else
                    return null;

                return pos;
            }
        });
    };
})(jQuery,undefined);


$('#chatwrap, #videowrap').wrapAll( '<div class="resizable clearfix" />');
//$('#chatwrap').after('<div class="splitter" />');

 $("#chatwrap").resizable({
   //handleSelector: ".splitter",
   resizeHeight: false
 });
 
 $("#chatwrap").resizable().bind({
    resizestart: function(event, ui) {
		$('#smile-menu, .server-msg-reconnect').hide();
    }
});

/* 
    Add video url from kadu 
*/
//var urlinput = $('#mediaurl');
//urlinput.parent().before(
//    '<div class="input-group">' +
//        '<input class="form-control" id="kadu-url" type="text" placeholder="Р’СЃС‚Р°РІСЊС‚Рµ СЃСЃС‹Р»РєСѓ РЅР° РІРёРґРµРѕ kadu.ru">' +
//        '<span class="input-group-btn"><button class="btn btn-default" id="kadu-check">РџСЂРѕРІРµСЂРёС‚СЊ</button></span>' +
//    '</div>' +
//    '<div id="hidden-video" style="dispaly: none;"></div>'
//);
//
//var kaduurl = $('#kadu-url'),
//    kadubtn = $('#kadu-check');
//
//kadubtn.on('click', function() {
//    var $url = kaduurl.val();
//    $.get($url, function(result){
//    var obj = $(result).find('body');
//        var videourl = $(result).find('#video-flash').attr('src');
//        console.log(PageText);
//    });
//});

п»їfunction redrawStyles()
{
 if (typeof $0USERS == "undefined") return;
 $.each($0USERS, function(k, v) {
  $(".userlist_item span:last-of-type").filter(function(){
    return (this.innerText === v);
  }).addClass(v+"_nick");
  $(".chat-msg-"+v+" span:last-of-type").addClass(v+"_chat");
  $(".chat-msg-"+v+" .username").addClass(v+"_nick_chat");
 });
}

function reloadAliases()
{
  if (typeof $0ALIASES == "undefined") return;
  $.each($0ALIASES, function(k, v) {
    $(".userlist_item span:last-of-type").filter(function(){
      return (this.innerText === k);
    }).html(v);
    $(".chat-msg-"+k+" .username").html(v+": ");
  });
}
  
  
UI_HeaderDropMenu = 1;      // [&] additional header dropdown menu
UI_MOTDAutoLogo = 0;        // [&] big channel logo inserted into MOTD
UI_MOTDTabs = 1;        // [&] switchable MOTD tabs application for homepage-like channel header
UI_MOTDDelete = 0;      // deleting previous MOTD after accepting/loading script
UI_GroupEmotes = 1;     // [&] emotes panel pagination, display limited number of emotes at one time
UI_CustomCaptions = 1;      // [&] custom captions for add, refresh, voteskip buttons, and welcome text
UI_PlayerOptions = 1;       // [&] additional player options
UI_ChannelDatabase = 0;     // [&] box with embed additional media database
  
MOTDAutoLogo_Array = [
];
  
MOTDTabs_Array = [
['Р“Р»Р°РІРЅР°СЏ', '<li>Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ РІ  РЈСЋС‚РЅРµРЅСЊРєРёР№ РљРёРЅРѕР·Р°Р»!</b> '
 + '<li>РўСѓС‚ РјС‹ РєРѕР»Р»РµРєС‚РёРІРЅРѕ СЃРјРѕС‚СЂРёРј С„РёР»СЊРјС‹, '
 + '<li>Р Р°СЃРїРёСЃР°РЅРёРµ РґРѕСЃС‚СѓРїРЅРѕ РІ РЅР°С€РµРј <a href="https://vk.com/lurkopub_alive" target="_blank">РїР°Р±Р»РёРєРµ</a>'
 + '<li>РџСЂРёСЃРѕРµРґРёРЅСЏР№СЃСЏ Рє РЅР°Рј РІ Teamspeak! <a href="ts3server://lurkopub_alive.my-ts.ru">РќРђР–РњР РЎР®Р”Рђ</a>'
 ],
['РџСЂР°РІРёР»Р°', 'РљР°Рє Рё РІ Р»СЋР±РѕРј РјРµСЃС‚Рµ, РіРґРµ Р±РѕР»СЊС€Рµ СЃРѕР±СЂР°Р»РѕСЃСЊ Р±РѕР»СЊС€Рµ РґРІСѓС… СЃ РїРѕР»РѕРІРёРЅРѕР№ РёРЅРґРёРІРёРґРѕРІ, Сѓ РЅР°СЃ РµСЃС‚СЊ РїСЂР°РІРёР»Р° Рё РЅРѕСЂРјС‹ РїРѕРІРµРґРµРЅРёСЏ, Р›СѓСЂС‡Р°РЅСЃРєРёР№. РџСЂРёРґРµСЂР¶РёРІР°Р№СЃСЏ РёС… Рё С‚С‹ РїСЂРѕРІРµРґРµС€СЊ РІРµС‡РµСЂ РІ С‚РµРїР»РѕР№ РєРѕРјРїР°РЅРёРё, Р° РЅРµ Р±СѓРґРµС€СЊ РІС‹СЃС‚Р°РІР»РµРЅ РЅР° РјРѕСЂРѕР· Рє СЂР°РєР°Рј.  '
 + '<hr class="rules-sep">'
 + '<div class="rules-wrapper"><li>РћСЃРєРѕСЂР±Р»СЏС‚СЊ Р»СЋРґРµР№ Р±РµР· РІРёРґРёРјРѕР№ РЅР° С‚Рѕ РїСЂРёС‡РёРЅС‹ вЂ” РїР»РѕС…Р°СЏ РёРґРµСЏ. '
 + '<li>РќРµ РїРѕСЂС‚Рё Р°С‚РјРѕСЃС„РµСЂСѓ РґР°РЅРЅРѕР№ РєРѕРјРЅР°С‚РєРё. РњС‹ РїСЂРёС€Р»Рё СЃСЋРґР° С‡С‚РѕР±С‹ РїРѕСЃРјРѕС‚СЂРµС‚СЊ РєРёРЅРѕ РІ С…РѕСЂРѕС€РµР№ РєРѕРјРїР°РЅРёРё, Р° РЅРµ С‡РёС‚Р°С‚СЊ Р°С…СѓРёС‚РµР»СЊРЅС‹Рµ РїРѕР»СѓС‡Р°СЃРѕРІС‹Рµ РёСЃС‚РѕСЂРёРё.'
 + '<li>Р РµРєР»Р°РјР° вЂ” С…Р°СЂР°Рј. Р•СЃР»Рё С‚РµР±Рµ РІРѕС‚ РїСЂСЏРјРѕ Р·СѓРґРёС‚ РїРѕСЂРµРєР»Р°РјРёСЂРѕРІР°С‚СЊ РїСЂРѕРєР»Р°РґРєРё/РЅРµР±Рѕ/Р°Р»Р»Р°С…Р°, С‚Рѕ РњС‹ (РІ Р»РёС†Рµ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂР°/РјРѕРґРµСЂР°С‚РѕСЂР°) РІСЃРµРіРґР° РіРѕС‚РѕРІС‹ РІС‹СЃР»СѓС€Р°С‚СЊ С‚РµР±СЏ. Р”Р»СЏ СЌС‚РѕРіРѕ РЅР°Р¶РјРё Р›РљРњ РЅР° РЅРёРєРµ Рё РѕС‚РїСЂР°РІСЊ Р»РёС‡РЅРѕРµ СЃРѕРѕР±С‰РµРЅРёРµ.'
 + '<li>РЎРїРѕР№Р»РµСЂС‹ РїСЂРёС‡РёРЅСЏСЋС‚ Р±Р°РЅ. РџРѕРґСѓРјР°Р№, РЅСѓР¶РЅРѕ Р»Рё РѕРЅРѕ С‚РµР±Рµ?'
 + '<li>Р‘РµСЃРјС‹СЃР»РµРЅРЅС‹Р№ С„Р»СѓРґ вЂ” РїСЂРёР·РЅР°Рє Р°СѓС‚РёСЃС‚Р°. РњС‹ Р±С‹ РЅРµ С…РѕС‚РµР»Рё РІРёРґРµС‚СЊ С‚СѓС‚ Р°СѓС‚РёСЃС‚РѕРІ, Р° С‚С‹? '
 + '<li>РџРѕР»СЊР·РѕРІР°С‚СЊСЃСЏ РєР°РїСЃР»РѕРєРѕРј РЅРµ РѕРґРѕР±СЂСЏРµС‚СЃСЏ, РЅРѕ Рё РЅРµ Р·Р°РїСЂРµС‰РµРЅРѕ. РџСЂРѕСЃС‚Рѕ РЅРµ Р·Р»РѕСѓРїРѕС‚СЂРµР±Р»СЏР№, Рё РІСЃРµ Р±СѓРґРµС‚ С…РѕСЂРѕС€Рѕ. '
 + '<li>РќРёРєРё. Р•СЃР»Рё РІ РїР°СЃРїРѕСЂС‚Рµ С‚С‹ РҐРѕС…РѕР» Р•РІСЂРѕРїРµРµРІРёС‡/Р’Р°С‚Р°РЅ РџСѓС‚РёРЅРѕРІРёС‡ - РєР°Рє СЃРєР°Р¶РµС€СЊ, С‚РІРѕРµ РїСЂР°РІРѕ. РўРѕР»СЊРєРѕ СѓС‡С‚Рё: РµСЃР»Рё РёР·-Р·Р° СЌС‚РѕРіРѕ РєРѕРіРѕ РЅРёР±СѓРґСЊ Р±РѕРјР±Р°РЅРµС‚, С‚Рѕ РІРёРЅРѕРІР°С‚С‹ Р±СѓРґРµС‚Рµ РѕР±Р°. Р”Р°, С‚Р°РєРѕРІР° Р¶РёР·РЅСЊ. Р РґР°, РїРѕРґРїРёСЃС‹РІР°С‚СЊСЃСЏ РёРјРµРЅРµРј "РњР°С‚СЊ_РђРґРјРёРЅР°_РµР±Р°Р»" вЂ” РїР»РѕС…Р°СЏ РёРґРµСЏ. '
 + '<li>РќРµ Р·Р°Р±С‹РІР°Р№, Р›СѓСЂС‡Р°РЅСЃРєРёР№, РµСЃР»Рё С‚РµР±СЏ РґРѕСЃС‚Р°Р» РєР°РєРѕР№-С‚Рѕ РѕРїСЂРµРґРµР»РµРЅС‹Р№ РёРЅРґРёРІРёРґ, С‚С‹ РІСЃРµРіРґР° РјРѕР¶РµС€СЊ Р·Р°РјСЊСЋС‚РёС‚СЊ РµРіРѕ. Р”Р»СЏ СЌС‚РѕРіРѕ РІ СЃРїРёСЃРєРµ СЋР·РµСЂРѕРІ РЅР°Р¶РјРё Р›РљРњ РЅР° РµРіРѕ РЅРёРєРµ Рё РІС‹Р±РµСЂРё "РРіРЅРѕСЂРёСЂРѕРІР°С‚СЊ". '
 + '</div>'
 + '<hr class="rules-sep">'
 + 'РўР°РєР¶Рµ РЅР° РєРёРЅРѕРїРѕРєР°Р·Рµ РїСЂРёСЃСѓС‚СЃС‚РІСѓРµС‚ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ Рё/РёР»Рё РјРѕРґРµСЂР°С‚РѕСЂ, Рё С‚С‹ РІСЃРµРіРґР° РјРѕР¶РµС€СЊ Р·Р°РґР°С‚СЊ РёРЅС‚РµСЂРµСЃСѓСЋС‰РёР№ С‚РµР±СЏ РІРѕРїСЂРѕСЃ, РІС‹СЃРєР°Р·Р°С‚СЊ СЃРІРѕРµ РЅРµРіРѕРґРѕРІР°РЅРёРµ/РєРѕРЅСЃС‚СЂСѓРєС‚РёРІРЅСѓСЋ (Рё РЅРµ РѕС‡РµРЅСЊ) РєСЂРёС‚РёРєСѓ.'],
['РќРёС€С‚СЏРєРё', 'Р•СЃР»Рё С‚С‹ С…РѕС‡РµС€СЊ СЃРµР±Рµ: <li>С†РІРµС‚РЅРѕР№ РЅРёРє; <li>С†РІРµС‚РЅРѕР№ С‚РµРєСЃС‚ РІ С‡Р°С‚Рµ; <li>Р°РІР°С‚Р°СЂРєСѓ РІРјРµСЃС‚Рѕ РёРјРµРЅРё<br> вЂ” РїРёС€Рё <b>Fenixer</b> РёР»Рё С‚С‹РєР°Р№ (<a href="https://docs.google.com/forms/d/1QfTdXThfxaZPuGXm3fllCuAUkTXLfvgR8cg5Gzr43Dg/viewform">СЃСЋРґР°</a>)<br>'
 + 'РЎС‚РѕРёРјРѕСЃС‚СЊ РєР°Р¶РґРѕР№ СѓСЃР»СѓРіРё РїРѕ РѕС‚РґРµР»СЊРЅРѕСЃС‚Рё - 50СЂ. РќРёРє+С‡Р°С‚ - 75СЂ.  Р’СЃС‘ РІРјРµСЃС‚Рµ - 125СЂ.'],
['Р РµРєРІРёР·РёС‚С‹ РґР»СЏ РЅРёС€С‚СЏРєРѕРІ', '<li> '
 + '<li>РЇР” 410012434068814'
 + '<li> ']
 ];
  
/* -- HTML/CSS -- */
  
MOTDTabs_CSS = {
'padding':      '3px',
'text-align':       'center',
'margin':       'auto',
'color':        'white',
};
  
// set MOTD
  
function changeMOTD() {
    if (UI_MOTDTabs=="1" && MOTDTabs_Array.length>0) {
        // adding tabs application
  
        motdtabswrap = $('<center id="motdtabswrap" />')
          .appendTo("#motd");
        for (var i in MOTDTabs_Array) {
            btn = $('<button class="btn btn-default motdtabs-btn" tab="'+i+'">')
              .text(MOTDTabs_Array[i][0])
              .appendTo(motdtabswrap)
              .on("click", function() {
                $(".motdtabs-btn").removeClass('btn-success');
                $(this).addClass('btn-success');
                nr=$(this).attr('tab');
                motdtabscontent.html(MOTDTabs_Array[nr][1]);
              });
        }
        motdtabscontent = $('<div id="motdtabscontent">'+MOTDTabs_Array[0][1]+'</div>')
          .css(MOTDTabs_CSS)
          .appendTo("#motd");
        $(".motdtabs-btn:nth-child(1)").addClass('btn-success');
    }
    if (UI_MOTDAutoLogo=="1") {
  
        // adding logo
  
        var logo = 0;
        var len = MOTDAutoLogo_Array.length;
        if (len<1) {
            MOTDAutoLogo_Array=['https://dl.dropboxusercontent.com/s/7mrz85gl29eiiks/logo.png'];
            len=1;
        }
        if (MOTDAutoLogo_Mode=="2" || MOTDAutoLogo_Mode=="3") {
            logo=Math.floor(Math.random()*len);
        } else if (MOTDAutoLogo_Mode=="7") {
            logo=new Date().getDay();
            typeof MOTDAutoLogo_Array[logo]==="undefined" ? logo=0 : '';
        }
        $('<center><img id="motdlogo" src="'+MOTDAutoLogo_Array[logo]+'" /></center>').prependTo("#motd");
    }
}
  
// setting MOTD
  
if (UI_MOTDAutoLogo=="1" || (UI_MOTDTabs=="1" && MOTDTabs_Array.length>0)) {
    socket.on("setMotd", changeMOTD);
    changeMOTD();
}
  
  
  
  
//======Nano_lib v0.12.28
//======Author: JAlB (2014)
//======License: Beerware
  
function $id(ID){
if(ID == '@body'){
return document.body;
}else{
return document.getElementById(ID);
}
}
  
function $Selector(SELECTOR){
return document.querySelectorAll(SELECTOR);
}
  
function $Class(CLASS) {
return document.getElementsByClassName(CLASS);
};
  
function $Random(MIN, MAX) {
    return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
};
  
//Р”РѕР±Р°РІР»РµРЅРёРµ СЌР»РµРјРµРЅС‚РѕРІ Рё СѓРґР°Р»РµРЅРёРµ СЌР»РµРјРµРЅС‚РѕРІ.
function $Create(TYPE, ID, CLASS, OBJTYPE){
if ($id(ID) == null){
 var result = document.createElement(TYPE);
 result.id = ID;
 result.className = CLASS;
 if (OBJTYPE != null) {
    result.type = OBJTYPE;
 }
 return result;
 } else {
console.error('$Create: Р­Р»РµРјРµРЅС‚ '+ID+' СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓРµС‚');
return null;
}
}
  
function $Add(TYPE, ID, CLASS, ToID){
if($id(ToID) != null){
 result = $Create(TYPE, ID, CLASS);
 if (result != null){
  $id(ToID).appendChild(result);
 } else {
  console.warn('$Add: Р­Р»РµРјРµРЅС‚ '+ID+' РЅРµ СЃРѕР·РґР°РЅ.');
 }
 return result;
} else {
 console.error('$Add: Р­Р»РµРјРµРЅС‚ '+ToID+' РЅРµ РЅР°Р№РґРµРЅ.');
 }
}
  
function $RemoveID(ID){
var element = $id(ID);
element.parentNode.removeChild(element);
}
  
function $Remove(OBJ){
OBJ.parentNode.removeChild(OBJ);
}
//РљРѕРЅРµС†
  
//Р›РѕРєР°Р»СЊРЅРѕРµ С…СЂР°РЅРёР»РёС‰Рµ
function $LSGet(PROPERTY){
return window.localStorage.getItem(PROPERTY);
}
  
function $LSSet(PROPERTY, VALUE){
window.localStorage.setItem(PROPERTY, VALUE);
}
  
//JSON
function $JsonEncode(OBJ){
return JSON.stringify(OBJ);
}
  
function $JsonDecode(STR){
return JSON.parse(STR);
}
  
//РљРѕРЅРµС† Nano_lib
  
  
//======Synchtube API v 0.15.724
//======Author: JAlB (2014)
//======License: Beerware
  
  
// INTERFACE FUNCTIONS
/***** add_button *****/
$0BUTTONS = [];
function API_ADDBUTTON(ID, CAPTION, ONCLICK, POSTFIX){
    if ($id(ID) == null) {
        $0BUTTONS[$0BUTTONS.length] = $Add('button', ID, 'btn btn-sm btn-default', 'leftcontrols');
        }
        var BTN = $id(ID)
        BTN.innerHTML = CAPTION;
        BTN.onclick = ONCLICK;
        if (POSTFIX != null) {
            POSTFIX(BTN);
        }
}
/***** END add_button *****/
/***** Add well frame *****/
$0WELLS = [];
function API_ADDWELL(ID, POSTFIX) {
    if ($id(ID) == null) {
        $0WELLS[$0WELLS.length] = $Add('div', ID, 'well', 'pollwrap');
        }
        var WELL = $id(ID)
        if (POSTFIX != null) {
            POSTFIX(WELL);
        }
}
/***** END add well frame *****/
/***** imgur ajax *****/
var $0IMGURONFILESET = [];
function API_IMGURONFILESET(FUNCTION) {
    $0IMGURONFILESET[$0IMGURONFILESET.length] = FUNCTION;
}
var $0IMGURONLOAD = [];
function API_IMGURONLOAD(FUNCTION) {
    $0IMGURONLOAD[$0IMGURONLOAD.length] = FUNCTION;
}
var $0IMGURONPROGRESS = [];
function API_IMGURONPROGRESS(FUNCTION) {
    $0IMGURONPROGRESS[$0IMGURONPROGRESS.length] = FUNCTION;
}
function API_IMGURUPLOAD(file) {
    if (!file || !file.type.match(/image.*/)) return;
    var DATA = new FormData();
    DATA.append("image", file);
    DATA.append("key", "6528448c258cff474ca9701c5bab6927");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.imgur.com/3/image");
    xhr.setRequestHeader('Authorization', 'Client-ID a11c2b9fbdd104a');
    xhr.onload = function() {
        result = JSON.parse(xhr.responseText).data.link;
        for (var i = 0; i < $0IMGURONLOAD.length; i++) {
            $0IMGURONLOAD[i](result);
        }
    }
    xhr.onerror = function(){
        alert('Р’Рѕ РІСЂРµРјСЏ Р·Р°РіСЂСѓР·РєРё С„Р°Р№Р»Р° РїСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР°: ' + xhr.status);
    };
    xhr.upload.onprogress = function(EVENT){
        for (var i = 0; i < $0IMGURONPROGRESS.length; i++) {
            $0IMGURONPROGRESS[i](EVENT);
        }
    };
    xhr.send(DATA);
    $id('imgur_fileinput').value = '';
 }
/***** END imgur ajax *****/
/***** imgur upload *****/
function API_CREATEIMGURUPLOADWELL() {
    API_ADDWELL('imgur_upload_well', function (OBJ) {OBJ.style.display = 'none';});
    FILEINPUT = $Create('input', 'imgur_fileinput', '', 'file');
    FILEINPUT.style.display = 'none';
    $id('imgur_upload_well').appendChild(FILEINPUT);
    window.ondragover = function(e) {e.preventDefault()}
    window.ondrop = function(e) {
        e.preventDefault();
        if(e.dataTransfer.files[0].type.match(/image.*/)){
            for (var i = 0; i < $0IMGURONFILESET.length; i++) {
                $0IMGURONFILESET[i]();
            }
            API_IMGURUPLOAD(e.dataTransfer.files[0]);
        } else {
            alert('РњРѕР¶РЅРѕ Р·Р°РіСЂСѓР¶Р°С‚СЊ С‚РѕР»СЊРєРѕ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ.');
            this.value = '';
        }
    }
    IMGUR_FILEINPUTBTN = $Add('button', 'imgur_fileinputbtn', 'btn btn-sm btn-default', 'imgur_upload_well');
    IMGUR_FILEINPUTBTN.innerHTML = 'Р—Р°РіСЂСѓР·РёС‚СЊ РёР·РѕР±СЂР°Р¶РµРЅРёРµ';
    IMGUR_FILEINPUTBTN.onclick = function () {FILEINPUT.click()};
    FILEINPUT.onchange = function(){
        if(this.files[0].type.match(/image.*/)){
            for (var i = 0; i < $0IMGURONFILESET.length; i++) {
                $0IMGURONFILESET[i]();
            }
            API_IMGURUPLOAD(this.files[0]);
        } else {
            alert('РњРѕР¶РЅРѕ Р·Р°РіСЂСѓР¶Р°С‚СЊ С‚РѕР»СЊРєРѕ РёР·РѕР±СЂР°Р¶РµРЅРёСЏ.');
            this.value = '';
        }
    }
}
/***** END imgur upload *****/
/***** CLASS CLICK EVENTS *****/
$0CLASSCLICKEVENTS = [];
function API_CLASSCLICKEVENTADD(FUNCTION){
    $0CLASSCLICKEVENTS[$0CLASSCLICKEVENTS.length] = FUNCTION;
}
function API_CLASSCLICKEVENT(TARGET){
    try{
        var CLS = TARGET.target.className;
    } catch(e){
        var CLS = null;
    }
    for (var i = 0; i < $0CLASSCLICKEVENTS.length; i++) {
        $0CLASSCLICKEVENTS[i](TARGET, CLS);
    }
}
$id('@body').onclick = function(TARGET){
    API_CLASSCLICKEVENT(TARGET);
    try{
        var ID = TARGET.target.id;
    } catch(e){
        var ID = null;
    }
  
    if (ID != 'image-viewer' && $id('image-viewer').style.display == 'block' && TARGET.target.className != 'chat-image') {
        $id('image-viewer').style.display = 'none';
    }
};
/***** END CLASS CLICK EVENTS *****/
/***** IMAGE VIEWER INIT *****/
$0THISIMAGEVIEW = {
"NATURALHEIGHT": 0,
"NATURALWIDTH": 0,
"scale": 100,
"width": 0,
"height": 0,
"move": false,
"startX": 0,
"startY": 0,
"x": 0,
"y": 0,
"setScale": function(SCALE){
    if(SCALE != null){
        if(SCALE < 1){SCALE = 1};
        this.scale = SCALE;
        this.width = Math.floor((this.NATURALWIDTH/100)*SCALE);
        this.height = Math.floor((this.NATURALHEIGHT/100)*SCALE);
    } else {
        var hScale = Math.floor((window.innerHeight/(this.NATURALHEIGHT + 150))*100);
        var wScale = Math.floor((window.innerWidth/this.NATURALWIDTH)*100);
        var scale = (hScale < wScale) ? hScale : wScale;
        if (scale > 100){scale = 100};
        this.scale = scale;
        this.width = Math.floor((this.NATURALWIDTH/100)*this.scale);
        this.height = Math.floor((this.NATURALHEIGHT/100)*this.scale);
    }
}
};
function API_IMAGESHOW(IMG, NATURALHEIGHT, NATURALWIDTH){
    var OBJ = $id('image-viewer');
    OBJ.style.display = 'block';
    OBJ.style.backgroundImage ='url('+IMG+')';
    $0THISIMAGEVIEW.NATURALHEIGHT = NATURALHEIGHT;
    $0THISIMAGEVIEW.NATURALWIDTH = NATURALWIDTH;
    $0THISIMAGEVIEW.setScale();
    OBJ.style.height = $0THISIMAGEVIEW.height + 'px';
    OBJ.style.width = $0THISIMAGEVIEW.width + 'px';
    OBJ.style.right = '5px';
    OBJ.style.top = '50px';
};
function API_IMAGEVIEWERINIT(){
    API_ADDWELL('image-viewer', function(OBJ){
        OBJ.style.display = 'none';
        OBJ.style.position = 'fixed';
        OBJ.style.backgroundPosition = 'center';
        OBJ.style.backgroundSize = 'contain';
        OBJ.style.backgroundRepeat = 'no-repeat';
        OBJ.style.backgroundAttachment = 'local';
        OBJ.style.padding = '5px';
        OBJ.style.top = '50px';
        OBJ.style.right = '5px';
        OBJ.style.zIndex = '1100';
        OBJ.style.cursor = 'move';
        OBJ.innerHTML = '<button data-dismiss="modal" aria-hidden="true" class="close" onclick="this.parentNode.style.display = \'none\'">?</button>';
        OBJ.onmousewheel = function(DELTA){
            DELTA.preventDefault()
            if(DELTA.wheelDelta > 0){
                $0THISIMAGEVIEW.setScale($0THISIMAGEVIEW.scale+3);
            } else {
                $0THISIMAGEVIEW.setScale($0THISIMAGEVIEW.scale-3);
            }
            this.style.height = $0THISIMAGEVIEW.height + 'px';
            this.style.width = $0THISIMAGEVIEW.width + 'px';
        };
        OBJ.onmousedown = function(EVENT){
            $0THISIMAGEVIEW.move = true;
            $0THISIMAGEVIEW.startX = EVENT.x;
            $0THISIMAGEVIEW.startY = EVENT.y;
            $0THISIMAGEVIEW.x = parseInt(this.style.right.replace('px', ''));
            $0THISIMAGEVIEW.y = parseInt(this.style.top.replace('px', ''));
            $id('@body').onmousemove = function(EVENT){
                if($0THISIMAGEVIEW.move){
                    $id('image-viewer').style.right = ($0THISIMAGEVIEW.x + ($0THISIMAGEVIEW.startX - EVENT.x)) + 'px';
                    $id('image-viewer').style.top = ($0THISIMAGEVIEW.y - ($0THISIMAGEVIEW.startY - EVENT.y)) + 'px';
                };
            };
        };
        $id('@body').onmouseup = function(){
            $0THISIMAGEVIEW.move = false;
            $id('@body').onmousemove = undefined;
        };
    });
};
/***** END IMAGE VIEWER INIT *****/
// END INTERFACE FUNCTIONS
  
  
// OVERRIDE FUNCTIONS
/****** formatChatMessage *******/
// API_PREFIXMESSAGE
var $0PREFIXMESSAGE = [];
function API_PREFIXMESSAGE(FUNCTION) {
    $0PREFIXMESSAGE[$0PREFIXMESSAGE.length] = FUNCTION;
}
// API_POSFIXMESSAGE
var $0POSTFIXMESSAGE = [];
function API_POSTFIXMESSAGE(FUNCTION) {
    $0POSTFIXMESSAGE[$0PREFIXMESSAGE.length] = FUNCTION;
}
  
function formatChatMessage(data, last) {
  
    //PREFIX
    for (var i = 0; i < $0PREFIXMESSAGE.length; i++) {
        $0PREFIXMESSAGE[i](data, last);
    }
    //END PREFIX
      
    // Backwards compat
    if (!data.meta || data.msgclass) {
        data.meta = {
            addClass: data.msgclass,
            // And the award for "variable name most like Java source code" goes to...
            addClassToNameAndTimestamp: data.msgclass
        };
    }
    // Phase 1: Determine whether to show the username or not
    var skip = data.username === last.name;
    if(data.meta.addClass === "server-whisper")
        skip = true;
    // Prevent impersonation by abuse of the bold filter
    if(data.msg.match(/^\s*<strong>\w+\s*:\s*<\/strong>\s*/))
        skip = false;
    if (data.meta.forceShowName)
        skip = false;
  
    data.msg = execEmotes(data.msg);
  
    last.name = data.username;
    var div = $("<div/>");
    /* drink is a special case because the entire container gets the class, not
       just the message */
    if (data.meta.addClass === "drink") {
        div.addClass("drink");
        data.meta.addClass = "";
    }
  
    // Add timestamps (unless disabled)
    if (USEROPTS.show_timestamps) {
        var time = $("<span/>").addClass("timestamp").appendTo(div);
        var timestamp = new Date(data.time).toTimeString().split(" ")[0];
        time.text("["+timestamp+"] ");
        if (data.meta.addClass && data.meta.addClassToNameAndTimestamp) {
            time.addClass(data.meta.addClass);
        }
    }
  
    // Add username
    var name = $("<span/>");
    if (!skip) {
        name.appendTo(div);
    }
    $("<strong/>").addClass("username").html(data.username + ": ").appendTo(name);
    if (data.meta.modflair) {
        name.addClass(getNameColor(data.meta.modflair));
    }
    if (data.meta.addClass && data.meta.addClassToNameAndTimestamp) {
        name.addClass(data.meta.addClass);
    }
    if (data.meta.superadminflair) {
        name.addClass("label")
            .addClass(data.meta.superadminflair.labelclass);
        $("<span/>").addClass(data.meta.superadminflair.icon)
            .addClass("glyphicon")
            .css("margin-right", "3px")
            .prependTo(name);
    }
  
    // Add the message itself
    var message = $("<span/>").appendTo(div);
    message[0].innerHTML = data.msg;
  
    // For /me the username is part of the message
    if (data.meta.action) {
        name.remove();
        message[0].innerHTML = data.username + " " + data.msg;
    }
    if (data.meta.addClass) {
        message.addClass(data.meta.addClass);
    }
    if (data.meta.shadow) {
        div.addClass("chat-shadow");
    }
  
    div.find("img").load(function () {
        if (SCROLLCHAT) {
            scrollChat();
        }
    });
      
    //POSTFIX
    for (var i = 0; i < $0POSTFIXMESSAGE.length; i++) {
        $0POSTFIXMESSAGE[i](name, message);
    }
    //END POSTFIX
      
    return div;
} 
/***** END formatChatMessage *****/
/***** chatline keydown *****/
// CLEAR chatline jquery keydown
$('#chatline').unbind('keydown');
// API_PREFIXBEFORESEND
var $0PREFIXBEFORESEND = [];
function API_PREFIXBEFORESEND(FUNCTION) {
    $0PREFIXBEFORESEND[$0PREFIXBEFORESEND.length] = FUNCTION;
}
$id('chatline').onkeydown = function(ev){
    if(ev.keyCode == 13) {
        if (CHATTHROTTLE) {
            return;
        }
        // FIX FUNCTIONS
        for (var i = 0; i < $0PREFIXBEFORESEND.length; i++) {
            $0PREFIXBEFORESEND[i]($id('chatline'));
        }
        // END FIX FUNCTIONS
        var msg = $id('chatline').value;
        if(msg.trim()) {
            var meta = {};
            if (USEROPTS.adminhat && CLIENT.rank >= 255) {
                msg = "/a " + msg;
            } else if (USEROPTS.modhat && CLIENT.rank >= Rank.Moderator) {
                meta.modflair = CLIENT.rank;
            }
  
            // The /m command no longer exists, so emulate it clientside
            if (CLIENT.rank >= 2 && msg.indexOf("/m ") === 0) {
                meta.modflair = CLIENT.rank;
                msg = msg.substring(3);
            }
            socket.emit("chatMsg", {
                msg: msg,
                meta: meta
            });
            CHATHIST.push($("#chatline").val());
            CHATHISTIDX = CHATHIST.length;
            $id('chatline').value = '';;
        }
        return;
    }
    else if(ev.keyCode == 9) { // Tab completion
        chatTabComplete();
        ev.preventDefault();
        return false;
    }
    else if(ev.keyCode == 38) { // Up arrow (input history)
        if(CHATHISTIDX == CHATHIST.length) {
            CHATHIST.push($("#chatline").val());
        }
        if(CHATHISTIDX > 0) {
            CHATHISTIDX--;
            $id('chatline').value = CHATHIST[CHATHISTIDX];
        }
  
        ev.preventDefault();
        return false;
    }
    else if(ev.keyCode == 40) { // Down arrow (input history)
        if(CHATHISTIDX < CHATHIST.length - 1) {
            CHATHISTIDX++;
            $id('chatline').value = CHATHIST[CHATHISTIDX];
        }
  
        ev.preventDefault();
        return false;
    }
}
/***** END chatline keydown *****/
/***** addChatMessage *****/
function addChatMessage(data) {
    if(IGNORED.indexOf(data.username) !== -1) {
        return;
    }
    if (data.meta.shadow && !USEROPTS.show_shadowchat) {
        return;
    }
    var safeUsername = data.username.replace(/[^\w-]/g, '$');
    var div = formatChatMessage(data, LASTCHAT);
    // Incoming: a bunch of crap for the feature where if you hover over
    // a message, it highlights messages from that user
    div.addClass("chat-msg-" + safeUsername);
    div.appendTo($("#messagebuffer"));
    div.mouseover(function() {
        $(".chat-msg-" + safeUsername).addClass("nick-hover");
    });
    div.mouseleave(function() {
        $(".nick-hover").removeClass("nick-hover");
    });
    // Cap chatbox at most recent 100 messages
    if($("#messagebuffer").children().length > 100) {
        $($("#messagebuffer").children()[0]).remove();
    }
    if(SCROLLCHAT)
        scrollChat();
  
    var isHighlight = false;
    if (CLIENT.name && data.username != CLIENT.name) {
        if (data.msg.toLowerCase().indexOf(CLIENT.name.toLowerCase()) != -1) {
            div.addClass("nick-highlight");
            isHighlight = true;
        }
    }
  
    pingMessage(isHighlight);
          
        reloadAliases();
    redrawStyles();
          
  
}
/***** END addChatMessage *****/
// END OVERRIDE FUNCTIONS
  
  
// ON LOAD
/***** FIX CHATLOAD *****/
API_CHATLOADFIX = function () {
    var CHAT = $Selector('#messagebuffer div');
    for (var i = 1; i < CHAT.length; i++) {
        var data = {};
        var msg = CHAT[i].children;
        if (msg.length != 0) {
            data.msg = (msg[msg.length-1].innerHTML);
        }
        if (msg.length != 0) {
            if (msg[msg.length-2].className != 'timestamp') {
                data.username = msg[msg.length-2].getElementsByTagName('strong')[0].innerHTML.replace(': ', '');
            }
        }
        //PREFIX
        for (var j = 0; j < $0PREFIXMESSAGE.length; j++) {
            $0PREFIXMESSAGE[j](data);
        }
        //END PREFIX
        if (msg.length != 0) {
            msg[msg.length-1].innerHTML = data.msg;
        }
        if (msg.length != 0) {
            if (msg[msg.length-2].class != 'timestamp') {
                if (msg[msg.length-2].getElementsByTagName('strong').length != 0) {
                    msg[msg.length-2].getElementsByTagName('strong')[0].innerHTML = data.username+': ';
                }
            }
        }
    }
        reloadAliases();
    redrawStyles();
  
};
/***** END FIX CHATLOAD *****/
// ON LOAD
  
/******************** test ******************/
function ShowHideID(ID){
    var FRAME = $id(ID);
    if (FRAME.style.display == 'none') {
        FRAME.style.display = 'block';
    }   else {
        FRAME.style.display = 'none';
    }
}
// РћР¤РћР РњР›Р•РќРР•
STYLE = $Add('style', 'API_STYLE', '', '@body');
STYLE.innerHTML += '.chat-image{max-width: 100px; max-height:100px; cursor: pointer;}';
STYLE.innerHTML += '.smile, #plmeta{cursor: pointer;}';
STYLE.innerHTML += '#help-btn, #image-btn, #smiles-btn{margin-right: 5px;}';
STYLE.innerHTML += '#smiles-btn{cursor: pointer; position: absolute; font-size: 25px; right: 10px;}';
STYLE.innerHTML += '#chatwrap{overflow: auto;}';
STYLE.innerHTML += '#footer{bottom: 0; position: fixed; width: 100%; opacity: 0.9;}';
  
// РћР±СЂР°Р±РѕС‚РєР° СЃРѕРѕР±С‰РµРЅРёР№ РїРµСЂРµРґ РѕРїСЂР°РІРєРѕР№
API_PREFIXBEFORESEND(function(OBJ){
    var msg = OBJ.value;
    msg = msg.replace(/http:\/\/cdn\.syn-ch\.com\/thumb\/.*\/.*\/.*\/(.*?((\.jpg)|(\.jpeg)|(\.png)|(\.gif)))(\s|$|\/)/g, '$$is$1is$$');
    msg = msg.replace(/http:\/\/cdn\.syn-ch\.com\/src\/.*\/.*\/.*\/(.*?((\.jpg)|(\.jpeg)|(\.png)|(\.gif)))(\s|$|\/)/g, '$$iS$1iS$$');
    msg = msg.replace(/http:\/\/i.imgur.com\/(.*?)(\s|$)/g, '$$ii$1ii$$');
    msg = msg.replace(/http:\/\/(.*?((\.jpg)|(\.jpeg)|(\.png)|(\.gif)))(\s|$)/g, '$$i1$1i1$$');
    msg = msg.replace(/https:\/\/(.*?((\.jpg)|(\.jpeg)|(\.png)|(\.gif)))(\s|$)/g, '$$i2$1i2$$');
    if(msg != OBJ.value){OBJ.value = msg;}
});
// РћР±СЂР°Р±РѕС‚РєР° РЅРѕРІС‹С… СЃРѕРѕР±С‰РµРЅРёР№.
API_PREFIXMESSAGE(function(data, last){
    data.msg = data.msg.replace(/\$i1(.*?)i1\$/g, '<img class="chat-image" src="http://$1">');
    data.msg = data.msg.replace(/\$i2(.*?)i2\$/g, '<img class="chat-image" src="https://$1">');
    data.msg = data.msg.replace(/\$ii(.*?)ii\$/g, '<img class="chat-image" src="http://i.imgur.com/$1">');
    data.msg = data.msg.replace(/\$is(.{3}?)(.{2}?)(.{2}?)(.*?)is\$/g, '<img class="chat-image" src="http://cdn.syn-ch.com/thumb/$1/$2/$3/$1$2$3$4">');
    data.msg = data.msg.replace(/\$iS(.{3}?)(.{2}?)(.{2}?)(.*?)iS\$/g, '<img class="chat-image" src="http://cdn.syn-ch.com/src/$1/$2/$3/$1$2$3$4">');
});
// РёРЅРёС†РёР°Р»РёР·Р°С†РёСЏ СЃРјРѕС‚СЂРµР»РєРё РєР°СЂС‚РёРЅРѕРє.
API_IMAGEVIEWERINIT();
// РћР±СЂР°Р±РѕС‚РєР° РєР»РёРєР° РїРѕ РєР»Р°СЃСЃСѓ РѕР±СЉРµРєС‚РѕРІ.
API_CLASSCLICKEVENTADD(function(TARGET, CLS){
    if(CLS == 'chat-image'){
        API_IMAGESHOW(TARGET.target.src, TARGET.target.naturalHeight, TARGET.target.naturalWidth);
    }
});
// РЎРјР°Р№Р»РёРєРё.
caseChatLine = $Create('div', 'caseChatLine', '');
$id('chatwrap').appendChild(caseChatLine);
caseChatLine.appendChild($id('chatline'));
  
smileMenuShowing = false;
smileMenuTimeout = null;
  
function ShowHideSmileMenu(){
    var FRAME = $id('smile-menu');
    FRAME.style.display = 'block';
    if (!smileMenuShowing) {
        FRAME.style.width = $id('chatline').offsetWidth + 'px';
        FRAME.style.top = $id('chatline').offsetTop - FRAME.offsetHeight +192 + 'px';
        FRAME.style.height = "300px";
        FRAME.style.opacity = '1';
        smileMenuShowing = true;
        clearTimeout(smileMenuTimeout);
    }   else {
        FRAME.style.opacity = '0';
        smileMenuShowing = false;
        smileMenuTimeout = setTimeout(function(){FRAME.style.display = 'none';}, 300);
    }
  
    $id('smile-menu').style.top = $id('chatline').offsetTop - $id('smile-menu').offsetHeight + 'px';
};
  
smilesBtn = $Create('div', 'smiles-btn', '');
smilesBtn.innerHTML = 'вє';
smilesBtn.onclick = function(){
    ShowHideSmileMenu();
}
caseChatLine.insertBefore(smilesBtn, $id('chatline'));
  
API_ADDWELL('smile-menu', function(OBJ){
    OBJ.style.display = 'none';
    OBJ.style.opacity = '0';
    OBJ.style.position = 'absolute';
    OBJ.style.zIndex = '10';
    OBJ.style.borderRadius = '0';
    OBJ.style.border = 'none';
    OBJ.style.overflow = 'auto';
    OBJ.style.transitionDuration = '0.3s';
    caseChatLine.insertBefore(OBJ, $id('chatline'));
    for(var i = 0; i < CHANNEL.emotes.length; i++){
        var TMP = $Add('img', 'smile-' + i, 'smile', 'smile-menu');
        TMP.src = CHANNEL.emotes[i].image;
        TMP.title = CHANNEL.emotes[i].name;
    }
});
  
API_CLASSCLICKEVENTADD(function(TARGET, CLS){
    if(CLS == 'smile'){
        var smid = TARGET.target.id.replace('smile-','');
        $id('chatline').value += CHANNEL.emotes[smid].name + ' ';
        ShowHideSmileMenu();
        $id('chatline').focus();
    }
});
  
API_ADDBUTTON('hide-btn', 'РЎРїСЂСЏС‚Р°С‚СЊ РІРёРґРµРѕ', function(){ShowHideID("videowrap")});
document.getElementById("leftcontrols").appendChild(document.createTextNode (" "));
  
  
API_ADDBUTTON('hide-btn', 'РЎРїСЂСЏС‚Р°С‚СЊ РІРёРґРµРѕ', function(){ShowHideID("videowrap")});

// РЎРјР°Р№Р»РёРєРё РіСЂСѓРїРїРёСЂРѕРІРєР°

var wrapper = $('#smile-menu');
wrapper.append('<ul class="img-tabs" / >');
for (var i=0; i<=3; i++) {
    wrapper.append('<div class="tab-content" />');
}

wrapper.find('.img-tabs').prepend('<li class="img-tab"><img class="small-tab-img" src="http://i.imgur.com/iPIUeFs.png" />Bitard</li>' + 
'<li class="img-tab"><img class="small-tab-img" src="http://i.imgur.com/iuhZZmS.png" />Yoba</li>' + 
'<li class="img-tab"><img class="small-tab-img" src="http://i.imgur.com/iMQpKc5.png" />Pepe</li>' +
'<li class="img-tab"><img class="small-tab-img" src="http://i.imgur.com/Vlt8Elo.png" />Memes</li>');

wrapper.find('.smile[title*="bitard"]')
       .appendTo('.tab-content:eq(0)');
       
wrapper.find('.smile[title*="yoba"]')
       .appendTo('.tab-content:eq(1)');

wrapper.find('.smile[title*="pepe"]')
       .appendTo('.tab-content:eq(2)');

wrapper.find('> .smile')
       .appendTo('.tab-content:eq(3)');

wrapper.find('.img-tab:eq(0)').addClass('current-tab');

$('.img-tabs .img-tab').click(function(e) {
  var index = $(this).index();
  
  $(this).addClass('current-tab').siblings().removeClass('current-tab');
  
  wrapper.find('.tab-content').eq(index).slideDown();
  wrapper.find('.tab-content').not(':eq(' + index + ')').slideUp();
  
  e.preventDefault;
});
  
// РѕР±СЂР°Р±РѕС‚РєР° СЃРѕРѕР±С‰РµРЅРёР№ РІ СЃС‚СЂРѕРєРµ РІРІРѕРґР° РІРѕ РІСЂРµРјСЏ РїРµС‡Р°С‚Рё.
$id('chatline').onkeyup = function(e){
    for (var i = 0; i < $0PREFIXBEFORESEND.length; i++) {
        $0PREFIXBEFORESEND[i](this);
    }
}
// РђРІР°С‚Р°СЂРєРё
AVATARS = [];
  
function addAvatar(name, image){
    var ava = {"name": name, "image": image};
    AVATARS[AVATARS.length] = ava;
}
  
//РђРґРјРёРЅРѕС‚Р°
addAvatar('Dark_AssassinUA', 'https://pp.vk.me/c627219/v627219901/22ba8/MdCvxrK24qo.jpg');
addAvatar('lurkopub_alive','https://pp.vk.me/c606827/v606827182/7e3a/nBP1FlbRxWo.jpg');
addAvatar('Claymore','http://i.imgur.com/akLCcv2.png');
  
//Р”РѕРЅР°С‚РµСЂС‹
  
addAvatar('lurkopub_moderator2', 'https://pp.vk.me/c617216/v617216502/14074/r2SmqQy0BoU.jpg');
addAvatar('elektrokefir', 'http://s018.radikal.ru/i501/1609/94/6aa8961b1375.jpg');
addAvatar('Maravin', 'https://pp.vk.me/c629418/v629418288/2ab65/uh7kaCPv3kg.jpg');
addAvatar('RogeroK','http://i1.imageban.ru/out/2015/12/11/8168cd42ae19d26f5272108f18e22b61.jpg');
addAvatar('Tetrateklon','https://cdn.scratch.mit.edu/static/site/users/avatars/857/1896.png');
addAvatar('VuleXX','http://i.imgur.com/GptSrkj.png');
addAvatar('m0rse','http://foodtransfer.ru/static/img/0000/0002/3330/23330993.m3fh19dog0.jpg?1');
addAvatar('wlesavo','https://pp.vk.me/c631820/v631820738/106e6/xqE7ZnqGGUo.jpg');
addAvatar('Hovut','http://i.imgur.com/iRg7Giw.jpg');
addAvatar('Maju_sisi_Djemom','http://i.imgur.com/3VsVqqs.png');
addAvatar('nikto47','https://pp.vk.me/c626229/v626229177/14420/Lh4VeGfG6yg.jpg');
addAvatar('feydorb','http://www.guygomel.com/disco-lider/4.jpg');
addAvatar('akcy','http://s009.radikal.ru/i309/1609/13/534d75c21f5a.jpg');


API_PREFIXMESSAGE(function(data, last){
    for (var i = 0; i < AVATARS.length; i++){
        if(data.username == AVATARS[i].name){
            data.username = '<img height="50" src="' + AVATARS[i].image + '" title="'+ AVATARS[i].name +'" class="ava">';
        }
    }
});
  
$(document).off("click", ".username");
  
API_CLASSCLICKEVENTADD(function(TARGET, CLS){
    if(CLS.indexOf('username') > -1){
        $id('chatline').value = TARGET.target.textContent + $id('chatline').value;
        $id('chatline').focus;
    }
    if(CLS == 'ava'){
        $id('chatline').value = TARGET.target.title + ': ' + $id('chatline').value;
        $id('chatline').focus;
    }
});
  
  
// РџСЂСЏС‡РµРј РїР»РµР№Р»РёСЃС‚
playlist = $Add('div', 'playlist', '', 'rightpane');
playlist.appendChild($id('queue'));
playlist.style.overflow = 'hidden';
  
$id('plmeta').onclick = function(){
    ShowHideID('playlist');
}
  
ShowHideID('footer');
  
API_CHATLOADFIX();
  
 $(".navbar-header").html('<a href="https://vk.com/lurkopub_alive" target="_blank"><img src=https://pp.vk.me/c628218/v628218554/2056a/-LDUeW8UeU0.jpg style="position: relative; top: 7px;"></a>');
 $("#usertheme").attr("href","/css/themes/slate.css");
  
// additional chat functions
  
chatflair = $('<span id="chatflair" class="label label-success pull-right pointer"></span>')
  .insertAfter("#modflair")
  .on("click", function() {
    if(!CHATFUNC) {
        $("#sounds-dropdown").remove();
        SOUNDSPANEL = false;
        showChatFunctions();
        CHATFUNC = true;
    } else {
        $("#chatfunc-dropdown").remove();
        CHATFUNC = false;
    }
  });
afkbtn = $('<span id="afk-btn" class="label label-default pull-right pointer">РђС„Рє</span>')
          .insertAfter("#modflair")
          .on("click", function() {
            socket.emit("chatMsg", {msg: '/afk'});
  });     
clearbtn = $('<span id="clear-btn" class="label label-default pull-right pointer">РћС‡РёСЃС‚РёС‚СЊ С‡Р°С‚</span>')
          .insertAfter("#modflair")
          .on("click", function() {
                socket.emit("chatMsg", {msg: '/clear'});    
  });

socket.on("rank", toggleChatFunctions);
toggleChatFunctions();