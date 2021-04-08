firebase.auth().onAuthStateChanged(function(user) 
{
	if (user)
	{
		window.open('Home.html',"_self")
	} 
});

$('#ButtonPrijava').click(function()
{
	var PoljaIspunjena = true;

	if($('#InputMail').val() == '')
	{
		$('#InputMail').css('border-color', 'red');
		$('#InputMail').attr('placeholder', 'Unesite mail!');
		PoljaIspunjena = false;
	}

	if($('#InputServer').val() == '')
	{
		$('#InputServer').css('border-color', 'red');
		$('#InputServer').attr('placeholder', 'Unesite server!');
		PoljaIspunjena = false;
	}

	if($('#InputLozinka').val() == '')
	{
		$('#InputLozinka').css('border-color', 'red');
		$('#InputLozinka').attr('placeholder', 'Unesite mail!');
		PoljaIspunjena = false;
	}

	if(PoljaIspunjena == true)
	{

		firebase.auth().signInWithEmailAndPassword($('#InputMail').val() + '@' + $('#InputServer').val(), $('#InputLozinka').val())
		.then((userCredential) => 
		{
			window.open('Home.html',"_self")  
		})
		.catch((error) => {
			var errorCode = error.code;

			if(errorCode == 'auth/wrong-password')
			{
				alert('Neispravna lozinka');
			}
			if(errorCode == 'auth/invalid-email')
			{
				alert('Neispravna e-mail adresa');
			} 
			if(errorCode == 'auth/user-disabled')
			{
				alert('Korisnik onemogućen');
			}
			if(errorCode == 'auth/user-not-found')
			{
				alert('Korisnik sa e-mail adresom \''+ $('#InputMail').val() + '@' + $('#InputServer').val() +'\' nije pronađen');
			} 
			
			
		});
	}
})

$('#ButtonRegistracija').click(function()
{
	window.open('Registracija.html',"_self")
})