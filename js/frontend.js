// Code standards
// • Always use ;
// • String 'between single quote'

// Retrieves tags to use in JavaScript
const introduction = document.querySelector('[data-introduction]');
const buttonIntro = document.querySelector('[data-introductionButton]');
const profileForm = document.querySelector('[data-profileForm]');


// Positioning the form NOT in sight
profileForm.classList.add('weg');


// Function that changes the intro text to a form where the user can make a profile
buttonIntro.addEventListener('click', function(){
    event.preventDefault();                                      // Don't do default
    profileForm.classList.toggle('tevoorschijn');                // Show form
    introduction.classList.add('wegIntro');                      // Remove intro text
});


// Object with input data from user
let inputUser = document.querySelector('[name="gebruikersnaam"]').value;


console.log(inputUser);