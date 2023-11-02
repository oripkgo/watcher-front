const message = {
    html: {
        alert: "",
        confirm: "",
    },
    alert: function (msg,callback) {
        alert(msg);

        if( callback ){
            callback();
        }

    },
    confirm : function(msg,callback){
        if( confirm(msg) ){
            callback(true);
        }else{
            callback(false);
        }

    },
}

export default message;