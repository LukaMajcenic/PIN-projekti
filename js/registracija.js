var CardString = '<div class="customCard loginBackgroundCard">' +
							'<div class="cardHeader">' +
							'</div>' +
							'<div class="cardBody">' +
							'</div>' +
						'</div>';

SetActiveColor();
for(let i = 0; i < 6; i++)
{
	let middleScreen = '';
	if(i == 0 || i == 5){middleScreen = 'middleScreen'}
	
	$('.row1').append(`<div class="col-2 d-flex ${middleScreen}"></div>`);
	$('.row3').append(`<div class="col-2 d-flex ${middleScreen}"></div>`);
}
$('.row1 .col-2').append(CardString);
$('.row2 .col-2').append(CardString);
$('.row2 .col-2').append(CardString);
$('.row2 .col-2').append(CardString);
$('.row3 .col-2').append(CardString);

$( ".loginBackgroundCard").each(function() 
{
	$(this).css('border-color', RYG[Math.floor(Math.random() * (2-0+1))+0]);
	
	let rand = Math.floor(Math.random() * (2-0+1))+0;
	if(rand == 0)
	{
		$(this).css('border', 'none');
	}
	else if(rand == 1)
	{
		$(this).css('opacity', '0');
	}
});

let PasswordVisible = false;
$('#PasswordVisibilityToggle').click(function()
{
	PasswordVisible = !PasswordVisible;	
	if(PasswordVisible)
	{
		$('#InputLozinka').get(0).type = 'text';
		$('#PasswordVisibilityToggle i').removeClass().addClass('far fa-eye-slash');
	}
	else
	{
		$('#InputLozinka').get(0).type = 'password';
		$('#PasswordVisibilityToggle i').removeClass().addClass('far fa-eye');
	}
})

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
        var errorCode = error.code;
        if(errorCode == 'auth/email-already-in-use')
        {
          $('.firebase-feedback').html(`E-mail <b>${$('#InputMail').val()}@${$('#InputServer').val()}</b> se već koristi!`);
        }
        if(errorCode == 'auth/invalid-email')
        {
          $('.firebase-feedback').html(`Neispravna e-mail adresa!`);
        }
        if(errorCode == 'auth/operation-not-allowed')
        {
          $('.firebase-feedback').html(`Prijava onemogućena!`);
        }
        if(errorCode == 'auth/weak-password!')
        {
          $('.firebase-feedback').html(`Lozinka preslaba`);
        }
    });
}