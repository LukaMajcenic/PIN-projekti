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

function AuthErrorHandler(error)
{
	switch(error.code)
	{
		case 'auth/wrong-password':
			$('.firebase-feedback').html('Neispravna lozinka!');
			break;
		case 'auth/invalid-email':
			$('.firebase-feedback').html(`Neispravna e-mail adresa!`);
			break;
		case 'auth/user-disabled':
			$('.firebase-feedback').html(`Korisnik <b>${$('#InputMail').val()}@${$('#InputServer').val()}</b> onemogućen!`);
			break;
		case 'auth/user-not-found':
			$('.firebase-feedback').html(`Korisnik sa e-mail adresom <b>${$('#InputMail').val()}@${$('#InputServer').val()}</b> ne postoji!`);
			break;
		case 'auth/email-already-in-use':
			$('.firebase-feedback').html(`E-mail <b>${$('#InputMail').val()}@${$('#InputServer').val()}</b> se već koristi!`);
			break;
		case 'auth/operation-not-allowed':
			$('.firebase-feedback').html(`Prijava onemogućena!`);
			break;
		case 'auth/weak-password!':
			$('.firebase-feedback').html(`Lozinka preslaba`);
			break;
		default:
			$('.firebase-feedback').html('Došlo je do pogreške!');
			break;
	}
}