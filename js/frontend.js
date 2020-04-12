// Retrieves tags to use in JavaScript
const introduction = document.querySelector('[data-introduction]');
const buttonIntro = document.querySelector('[href="#scrollToForm"]');
const profileForm = document.querySelector('[data-profileForm]');


// Positioning the form NOT in sight
profileForm.classList.add('gone');


// Function that changes the intro text to a form where the user can make a profile
buttonIntro.addEventListener('click', function(){
    event.preventDefault();                                      // Don't do default
    profileForm.classList.toggle('showForm');                    // Show form
    introduction.classList.add('introGone');                     // Remove intro text
});

// This code is to show how CONTEXT works and doen't apply on my feature
const profile = {
    name: 'Inge',
    age: 22,
    place: 'Egmond',
    message: function(){
        return `${this.name} is ${this.age} years old and lives in ${this.place}!`;
    },
};

console.log(profile.message());

// This code is to show how CLOSURE works and doen't apply on my feature
let addTo = function(outer){
  let add= function(inner){
    return outer + inner;
  };
  return add;
};

console.log(addTo(2)(3));
