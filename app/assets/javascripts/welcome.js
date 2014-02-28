$(document).ready(
    function() {
        var pars = $("option");
        for(i=0;i<pars.length;i++) {
            console.debug("Found an option tag " + pars[i].innerHTML);
        }
        console.debug("This log comes from welcome.js file");
    }
);



