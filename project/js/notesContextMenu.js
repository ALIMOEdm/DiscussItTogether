
/**
 * Created by ALIMOE on 28.06.14.
 */


jQuery(function(){
    jQuery.contextMenu({
        selector: '.context-menu-one',
        callback: function(key, options) {
            var button = this[0];
            var m = "clicked: " + key;
            switch(key){
                case "edit":
                    var notes = getNoteF();
                    if(notes == -1)
                        break;
                    for(var i = 0; i < notes.length; i++){
                        if(notes[i].id == this[0].id)
                            jQuery("#addNewNote_noteText").val(notes[i].notetext);
                    }

                    document.querySelector("#addNewNote_Header").innerHTML = "Изменить пометку";
                    document.querySelector("#addNewNote_CloseBtn").innerHTML = "Отмена";
                    document.querySelector("#addNewNote_AddBtn").innerHTML = "Сохранить";
                    var id = this[0].id;
                    document.querySelector("#addNewNote_AddBtn").onclick = function(){
                        var notes = getNoteF();
                        var ob={};
                        var ind = 0;
                        for(var i = 0; i < notes.length; i++){
                            //
                            if(notes[i].id == id){
                                ind = i;
                                notes[i].notetext = jQuery("#addNewNote_noteText").val();
                                ob.notetext = jQuery("#addNewNote_noteText").val();
                                ob.id = id;
                                ob.noteY = notes[i].noteY;
                                ob.noteX = notes[i].noteX;
                                window.noteY = notes[i].noteY;
                                window.noteX = notes[i].noteX;
                                jQuery('#'+id).popover('hide');
                                document.getElementById(id).parentNode.parentNode.removeChild(document.getElementById(id).parentNode);
//                                forEach(document.getElementsByClassName("popover"), function(el){
//                                    el.parentNode.removeChild(el);
//                                });

                                //отрисуем заново заметку
                                addNote(id, ob.notetext);
                                console.log("if");
                                break;
                            }
                        }
                        //удаляем из массива заметок нужную заметку, и сохраняем ее
                        notes.splice(ind, 1);
                        notes.push(ob);
                        //saveNoteF(ob);
                        saveAllData(notes);

                        var ob_1 = {
                            notetext : ob.notetext,
                            id : ob.id
                        }
                        sendSocket("editNote", ob_1);

                        document.querySelector("#addNewNote_AddBtn").onclick = addNewNote;
                        jQuery("#addNewNote").modal("hide");
                        jQuery('#'+id).popover('show');
                    }
                    jQuery("#addNewNote").modal("show");
                    break;
                case "delete":

                    if(!confirm("Удалить пометку?"))
                        return;
                    var id = this[0].id;
                    removeNote(id);

                    var ob = {
                        id : id
                    };
                    sendSocket("removeNote", ob);

                    break;
            }
        },
        items: {
            "edit": {name: "Edit", icon: "", accesskey: "e"},
            "delete": {name: "Delete", icon: ""}
        }
    });
});

function forEach(arr, action){
    for(var i = 0; i < arr.length; i++){
        action(arr[i]);
    }
}

function removeNote(id){
    jQuery('#'+id).popover('hide');
    document.getElementById(id).parentNode.removeChild(document.getElementById(id));
    var notes = getNoteF();
    var ind = 0;
    for(var i = 0; i < notes.length; i++){
        if(notes[i].id == id){
            ind = i;
        }
    }
    notes.splice(ind, 1);
    saveAllData(notes);
}

function removeAllNote(){
    var notes = getNoteF();
    forEach(notes, function(el){
        var id = el.id;
        jQuery('#'+id).popover('hide');
        document.getElementById(id).parentNode.removeChild(document.getElementById(id));
        var o = [];
        saveAllData(o);
    });
}