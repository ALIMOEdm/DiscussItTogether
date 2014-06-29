<?php
session_start();
$host_without_port = 'http://'.$_SERVER["SERVER_NAME"];
$host = 'http://'.$_SERVER["SERVER_NAME"].':9091';
$get_param = "";
if(isset($_GET["room"]) && !empty($_GET["room"])){
    $get_param = $_GET["room"];
}else{
    $room = uniqid().uniqid().uniqid().uniqid().uniqid();
    header("Location: ".$host_without_port.$_SERVER["PHP_SELF"]."?room=".$room);
}
//file_get_contents($host."?room=".$get_param);
//    file_get_contents('http://disscussittogether:9091');
?>
<!DOCTYPE html>
<html>
<head>
    <title>DIT Service</title>
    <meta charset="utf-8"/>
    <link rel='stylesheet' href='css/style.css'/>
    <link rel='stylesheet' href='css/bootstrap.min.css'/>
    <link rel='stylesheet' href='css/font-awesome.min.css'/>
    <link href="css/jquery.contextMenu.css" rel="stylesheet" type="text/css" />
    <?php
    echo "<script>window.hostt='".$host."'</script>";
    ?>
</head>
<body style="margin: 0;background-color: rgb(229, 243, 255); padding: 0;">

<nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <div class="row">
                <div class="col-xs-6 col-md-3" style="width: 10%;">
                    <a onclick="changeImage(event); return false;" href="#" class="thumbnail" style="margin-bottom: 5px;margin-to: 5px;">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzEiIGhlaWdodD0iMTgwIj48cmVjdCB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2VlZSI+PC9yZWN0Pjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijg1LjUiIHk9IjkwIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+MTcxeDE4MDwvdGV4dD48L3N2Zz4=" data-src="" alt="...">
                    </a>
                </div>
            </div>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>
<div id='content' style="padding: 0 80px;">
    <div id="content_canvas_wr" style="width:1100px;margin: 20px auto; position: relative;">
        <input style="display: none;" type="file" id="files" name="files[]"/>
        <canvas style="box-shadow: 0 0 4px 4px rgb(158, 158, 158);" id="test_canvas"  width="1000"></canvas>
    </div>
</div>

<div class="" style="position: fixed; top: 40%; left: 95%; width: 5%;">
    <div style="width: 100%;" class="btn-group-vertical">
        <button id="RectTest" type="button" class="btn btn-default">
            <i class="fa fa-pencil-square-o"></i>
        </button>
        <button id="LineTest" type="button" class="btn btn-default">
            <i class="fa fa-pencil"></i>
        </button>
        <button id="TextTest" type="button" class="btn btn-default">
            <i class="fa fa-font"></i>
        </button>
        <button id="VoiceTest" type="button" class="btn btn-default">
            <i class="fa fa-microphone"></i>
        </button>
    </div>

    <div  class="work_panel-changecolor" id="color_panel" style="margin: 10px 2px;">
        <form role="form" onsubmit="return false;">
            <input onchange="setColor(this)" class="form-control" type="color" name="bg" value="#ff0000">
        </form>
    </div>

    <div style="width: 100%;margin-top: 10px;" class="btn-group-vertical">
        <button id="ClearImage" type="button" class="btn btn-default">
            <i class="fa fa-stop"></i>
        </button>
    </div>
</div>

<script>

</script>
<script src='http://code.jquery.com/jquery-1.8.0.min.js' type='text/javascript'></script>
<script>

</script>>
<script src="js/jquery.ui.position.js" type="text/javascript"></script>
<script src="js/jquery.contextMenu.js" type="text/javascript"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/socket.io.js"></script>
<script src='js/chat.js' type='text/javascript'></script>
<script src='js/notesContextMenu.js' type='text/javascript'></script>
<script src='js/chat_ui.js' type='text/javascript'></script>


<div class="modal fade" id="addNewNote" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="addNewNote_Header"></h4>
            </div>
            <div class="modal-body">
                <textarea class="form-control" rows="3" id="addNewNote_noteText"></textarea>
            </div>
            <div class="modal-footer">
                <button id="addNewNote_CloseBtn" type="button" class="btn btn-default" data-dismiss="modal"></button>
                <button id="addNewNote_AddBtn" type="button" class="btn btn-primary" onclick="addNewNote()"></button>
            </div>
        </div>
    </div>
</div>


</body>
</html>