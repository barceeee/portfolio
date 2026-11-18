var card = document.getElementById('card');
var loaderContainer = document.getElementById('loader-container');

document.addEventListener('DOMContentLoaded' , function() {
    card.style.display = 'none';
});

function showLoader() {
    $("#loader").fadeIn(3000);
}

$(window).on('load' , function(){
    setTimeout(removeLoader, 1200)
});
function removeLoader() {
    $("#loader").fadeOut(3000, function() {
        $("#loader").remove();
        $(card).fadeIn(100);
        card.style.display = 'block';
        $("loader-container").remove();
    });
}
