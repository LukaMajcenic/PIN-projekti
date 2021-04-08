$('#ButtonRegistracija').click(function()
{
  var PoljaPopunjena = true;

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
		$('#InputLozinka').attr('placeholder', 'Unesite lozinku!');
		PoljaIspunjena = false;
  }
  
  if($('#InputProfilna').val() == '')
	{
		$('#InputProfilna').css('border-color', 'red');
		$('#InputProfilna').attr('placeholder', 'Unesite url profilne slike!');
		PoljaIspunjena = false;
  }
  
  if($('#InputKorisnickoIme').val() == '')
	{
		$('#InputKorisnickoIme').css('border-color', 'red');
		$('#InputKorisnickoIme').attr('placeholder', 'Unesite korisničko ime!');
		PoljaIspunjena = false;
  }

  if(PoljaPopunjena == true)
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
          alert('E-mail se već koristi');
        }
        if(errorCode == 'auth/invalid-email')
        {
          alert('Neispravna e-mail adresa');
        }
        if(errorCode == 'auth/operation-not-allowed')
        {
          alert('Prijava onemogućena');
        }
        if(errorCode == 'auth/weak-password')
        {
          alert('Lozinka preslaba');
        }
    });
  }
})