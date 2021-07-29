firebase.auth().onAuthStateChanged(function(user) 
{
	if (user)
	{
		window.open('Home.html',"_self")
	} 
});

$('input').on('input',function(e){
    $('.firebase-feedback').html('');
});

function Submit()
{
	$('.firebase-feedback').html('');
	$('.fa.fa-circle-o-notch.fa-spin').addClass('d-inline-block');
	firebase.auth().signInWithEmailAndPassword($('#InputMail').val() + '@' + $('#InputServer').val(), $('#InputLozinka').val())
		.then((userCredential) => 
		{
			window.open('Home.html',"_self")  
		})
		.catch((error) => {
			$('.fa.fa-circle-o-notch.fa-spin').removeClass('d-inline-block');
			AuthErrorHandler(error);		
		});
}

'use strict'
// Fetch all the forms we want to apply custom Bootstrap validation styles to
var forms = document.querySelectorAll('.needs-validation')

// Loop over them and prevent submission
Array.prototype.slice.call(forms)
  .forEach(function (form) {
	form.addEventListener('submit', function (event) {
		event.preventDefault()
		event.stopPropagation()
		if (form.checkValidity()) 
		{
			Submit();
		}

	  	form.classList.add('was-validated')
	}, false)
})