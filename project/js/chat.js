/**
 * Created by ALIMOE on 11.06.14.
 */
var rect = [];
var x1, y1;
var moveX1, moveY1;
var def_color = "FFFF00";

var mouseDown = false, mouseUp = false, mouseMove = false;
var isClose = false, isStart = false;;
var isFirst = true;
var curMiniImageWr;


var countSaves = 10, currentSaveStep = 0, saveStepsNumber = 0;//количество возможных сохранений, текущее сохранение, количество сделанных сохранений

//Нормализация событий
function normaliseEvent(event) {
    if (!event.stopPropagation) {
        event.stopPropagation = function() {this.cancelBubble = true;};
        event.preventDefault = function() {this.returnValue = false;};
    }
    if (!event.stop) {
        event.stop = function() {
            this.stopPropagation();
            this.preventDefault();
        };
    }
    if (event.srcElement && !event.target)
        event.target = event.srcElement;
    if ((event.toElement || event.fromElement) && !event.relatedTarget)
        event.relatedTarget = event.toElement || event.fromElement;
    if (event.clientX != undefined && event.pageX == undefined) {
        event.pageX = event.clientX + document.body.scrollLeft;
        event.pageY = event.clientY + document.body.scrollTop;
    }
    if (event.type == "keypress") {
        if (event.charCode === 0 || event.charCode == undefined)
            event.character = String.fromCharCode(event.keyCode);
        else
            event.character = String.fromCharCode(event.charCode);
    }
    return event;
}
//выбор цвета
//document.getElementById("color_panel").addEventListener("click",function(event){
//    event = event || window.event;
//    event = normaliseEvent(event);
//    var src = event.target;
//    window.def_color = src.getAttribute("color");
//    window.ctx.beginPath();
//});

function setColor(el){
    console.dir(el.value);
    window.def_color = el.value;
    window.ctx.beginPath();
}

document.getElementById("LineTest").onclick = function(){
    document.getElementById("test_canvas").onmousedown = mousedown_Line;
    document.getElementById("test_canvas").onmouseup = mouseup_Line;
    document.getElementById("test_canvas").onmousemove = mousemove_Line;
};

//обработчики для рисования линий
function mousedown_Line(event){
    mouseDown = true;//нажали кнопку
    isStart = true;
    moveX1 = event.offsetX;
    moveY1 = event.offsetY;
    console.log("mousedown_Line");
}

function mouseup_Line(event){
    mouseDown = false;
    isStart = false;
    moveX1 = event.offsetX;
    moveY1 = event.offsetY;
    console.log("mouseup_Line");
}

function mousemove_Line(event){
    if(mouseDown){
        isClose = false;
        window.ctx.lineWidth = 5;
        window.ctx.strokeStyle = window.def_color;
        var moveX2 = event.offsetX;
        var moveY2 = event.offsetY;
        window.ctx.moveTo(moveX1, moveY1);
        window.ctx.lineTo(moveX2, moveY2);
        window.ctx.stroke();

        var ob = {};
        ob.type = "line";
        ob.X1 = moveX1;
        ob.Y1 = moveY1;
        ob.X2 = moveX2;
        ob.Y2 = moveY2;
        if(isStart){
            ob.act = "start";
            isStart = false;
        }
        else{
            ob.act = "continue";
        }
        ob.color = window.def_color;
        ob.lineWidth = window.ctx.lineWidth;

        sendSocket("drowPometki", ob);

        console.log("mousemove_Line");
        //console.log(moveX1, moveY1, moveX2, moveY2, mouseDown);
        moveX1 = moveX2;
        moveY1 = moveY2;
    }
    else if(!mouseDown && !isClose){
        var moveX2 = event.offsetX;
        var moveY2 = event.offsetY;
        isClose = true;
        var ob = {};
        ob.type = "line";
        ob.X1 = moveX1;
        ob.Y1 = moveY1;
        ob.X2 = moveX2;
        ob.Y2 = moveY2;
        ob.act = "close";
        ob.color = window.def_color;
        ob.lineWidth = window.ctx.lineWidth;

        sendSocket("drowPometki", ob);
    }
}

function sendSocket(typeMess, data){
    socket.emit(typeMess, data);
}


function removeEvents(type){
}

document.getElementById("RectTest").onclick = function(){
    document.getElementById("test_canvas").onmousedown = mousedown_Rect;
    document.getElementById("test_canvas").onmouseup = mouseup_Rect;
    document.getElementById("test_canvas").onmousemove = '';
}

function mousedown_Rect(event){
    x1 = event.offsetX;
    y1 = event.offsetY;
    console.log("mousedown_Rect");
}

function mouseup_Rect(event){
    //console.dir(event);
    console.log("mouseup_Rect");
    window.ctx.strokeStyle = window.def_color;
    window.ctx.strokeRect(x1, y1, event.offsetX-x1, event.offsetY-y1);
    var transfer_date = {
        x1 : x1,
        y1 : y1,
        x2 : event.offsetX-x1,
        y2 : event.offsetY-y1,
        color : window.def_color
    }
    socket.emit('drawRect', transfer_date);
}

function changeImage(event){
    event = event || window.event;
    event = normaliseEvent(event);
    window.curMiniImageWr = event.target;
    jQuery("#files").trigger("click");
}

function handleFileSelect(evt){
    var files = evt.target.files;
    console.log(files)
    var f = files[0];
    var reader = new FileReader();

    reader.onload = (function(theFile){
        return function(e){
            //console.info(e.target.result);
//            document.getElementById("photo_im").src = e.target.result;
            curMiniImageWr.src = e.target.result;
            socket.emit('image', e.target.result);
            drawMage(e.target.result);
        }
    })(f);

    reader.readAsDataURL(f);
}


function saveImageFunction(path, data){
    var fullPath = location.href + "/" + path;
    var save_img = localStorage.getItem(fullPath);
    var save_img_arr = [];
    if(save_img != undefined && !isNull(save_img)){
        save_img_arr = JSON.parse(save_img);
    }
    save_img_arr[saveStepsNumber] = data;

    currentSaveStep++;
    saveStepsNumber++;
    if(saveStepsNumber > countSaves){
        saveStepsNumber = 0;
    }
    localStorage.setItem(fullPath, JSON.stringify(save_img_arr));
}

function getSaveImg(path, isBackOrAhead){
    var fullPath = location.href + "/" + path;
    var save_img = localStorage.getItem(fullPath);
    if(save_img == undefined ||  isNull(save_img)){
        return -1;
    }
    var save_img_arr = []
    save_img_arr = JSON.parse(save_img);
    var res = save_img_arr[currentSaveStep];
    currentSaveStep--;

}

function drawMage(src){
    window.canvas = document.getElementById("test_canvas"),
        window.ctx = canvas.getContext('2d'),
        window.pic = new Image();
    pic.src = src;
    if(pic.width > window.canvas.width){
        var koef = pic.width / window.canvas.width;
        pic.width = window.canvas.width;
        pic.height = pic.height/koef;
    }
    window.canvas.width = pic.width;
    window.canvas.height = pic.height;
    console.dir(window.canvas);
    pic.onload = function(){
        ctx.drawImage(pic, 0, 0, pic.width, pic.height);
    }

}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

var socket = io.connect('http://watchittogether:9091');
socket.on('hello', function (data) {
    console.log(data);
});

var find_ob = {};
find_ob.act = "find";
sendSocket("findOther", find_ob);

socket.on("findOther", function(data){
    console.log(data, isFirst, "findOther");
    if(isFirst){
        if(window.ctx != undefined && data.find_other.act == "find"){
            sendSocket("remoutFirstSett", {src : document.getElementById("test_canvas").toDataURL()})
        }
    }
});

socket.on('image', function(data){
    drawMage(data.data)
});

socket.on('drawRect', function(data){
    console.log('drawRect', data);
    var c = data.rectCoords;
    window.ctx.strokeStyle = c.color;
    window.ctx.strokeRect(c.x1, c.y1, c.x2, c.y2);
});

socket.on("drowPometki", function(data){
    console.log('drowPometki', data);
    var c = data.line;
    switch(c.type){
        case "line" :
            if(c.act == "start"){
                window.ctx.beginPath();
            }
            window.ctx.lineWidth = c.lineWidth;
            window.ctx.strokeStyle = c.color;

            window.ctx.moveTo(c.X1, c.Y1);
            window.ctx.lineTo(c.X2, c.Y2);
            window.ctx.stroke();
            if(c.act == "close"){
                window.ctx.beginPath();
            }
            break;
    }
});

socket.on("remoutFirstSett", function(data){
    console.info("remoutFirstSett");
    isFirst = false;
    drawMage(data.remoutFirstSett.src);
});

