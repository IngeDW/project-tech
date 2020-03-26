/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

/*eslint-env browser*/

/*eslint 'no-console': 0*/

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");



/*hartjes liken*/

var hartjes = document.querySelectorAll('.leeg-hartje');
console.log(hartjes);

hartjes.forEach(function(hart) {
    hart.addEventListener('click', function() {
        hart.src = "images/hart-vol.svg";
    })
});














/*

        hart.classlist.add('fill');



function changeHart() {
    hart.src = "images/hart-vol.svg";
    console.log("er is geklikt");
}

hart[0].addEventListener('click', changeHart);



for (var i = 0; i < hart.length; i++) {
    hart.src = "images/hart-vol.svg";
    console.log("er is geklikt");
}

var inputVakantieFilter = document.getElementById("value").value; 
var tussenkop = document.getElementsByTagName("h4");

function updateTussenkop() {
tussenkop.write(inputVakantieFilter);
}


*/