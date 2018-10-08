function showInfo(message){
    $("#infoBox > span").text(message);
    $("#infoBox").show();
    setTimeout(()=>{
        $("#infoBox").hide();

    },2000)
}

function showError(message){
    $("#errorBox > span").text(message);
    $("#errorBox").show();
    setTimeout(()=>{
        $("#errorBox").hide();

    },2000)
}
