/*menu check*/
var menuActive = function(dirname) {
    if(dirname!="") {$("#"+dirname).attr("class", "active");}
}

/* site move*/
function getSiteMove(url) {
    window.open(url.trim());
}
