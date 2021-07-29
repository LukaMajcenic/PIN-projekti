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

function Submit()
{
  $('.firebase-feedback').html('');
	$('.fa.fa-circle-o-notch.fa-spin').addClass('d-inline-block');
	firebase.auth().createUserWithEmailAndPassword($('#InputMail').val() + '@' + $('#InputServer').val(), $('#InputLozinka').val())
      .then((userCredential) => 
      {
        userCredential.user.updateProfile({
          displayName: $('#InputKorisnickoIme').val(),
          photoURL: $('#InputProfilna').val()
        }).then(function() 
        {          
            window.location.replace('Home.html');

        }).catch(function(error) 
        {
          console.log('Error kod ažuriranja korisnika: ' + error.code);
        });
      })
      .catch((error) => 
      {
        $('.fa.fa-circle-o-notch.fa-spin').removeClass('d-inline-block');
        AuthErrorHandler(error);
    });
}