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
	firebase.auth().signInWithEmailAndPassword($('#InputMail').val() + '@' + $('#InputServer').val(), $('#InputLozinka').val())
		.then((userCredential) => 
		{
			window.open('Home.html',"_self")  
		})
		.catch((error) => {
			console.log(error);
			var errorCode = error.code;

			if(errorCode == 'auth/wrong-password')
			{
				$('.firebase-feedback').html('Neispravna lozinka!');
			}
			if(errorCode == 'auth/invalid-email')
			{
				$('.firebase-feedback').html(`Neispravna e-mail adresa!`)
			} 
			if(errorCode == 'auth/user-disabled')
			{
				$('.firebase-feedback').html(`Korisnik <b>${$('#InputMail').val()}@${$('#InputServer').val()}</b> onemogućen!`)
			}
			if(errorCode == 'auth/user-not-found')
			{
				$('.firebase-feedback').html(`Korisnik sa e-mail adresom <b>${$('#InputMail').val()}@${$('#InputServer').val()}</b> ne postoji!`)
			} 			
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