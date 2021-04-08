firebase.auth().onAuthStateChanged(function(user) {
    if (user) 
    {
      UpdateUserPictureUI();
      UpdateUserNameUI();
      UpdateMailUI();

    } else 
    {
      window.open('index.html',"_self")
    }
});

//Uredivanje profilne slike
$('#ButtonUrediProfilnu').click(function()
{
  if($('#ProfileImageUrl').val() == '')
  {
      $('#ProfileImageUrl').attr('placeholder', 'Unesite url!');
      $('#ProfileImageUrl').css('border-color', 'red');
  }
  else
  {
    if(confirm('Jeste li sigurni?'))
    {
      $('#EditProfilnuModal').modal('hide');
      UpdateUserPictureDb($('#ProfileImageUrl').val());
      
      $('#ImgEdit').on('error', function()
      {
        alert('Profilna slika nije pronađena');
        $(this).off('error');
        UpdateUserPictureDb('https://mpng.subpng.com/20180405/acq/kisspng-male-avatar-user-profile-clip-art-profile-5ac69e04c061f0.400875961522966020788.jpg');
      });
    } 
  }
})

function UpdateUserPictureDb(url) 
{  
  firebase.auth().currentUser.updateProfile({
    photoURL: url
  }).then(function() 
  {
    UpdateUserPictureUI();

  }).catch(function(error) 
  {
    alert('Došlo je do pogreške')
  });
}

function UpdateUserPictureUI()
{
  user = firebase.auth().currentUser;
  $('#ImgEdit').attr('src', user.photoURL);
  $('#UserPhoto').attr('src', user.photoURL);
  $('#ProfileImageUrl').val(user.photoURL);
}
////////////////////

//Uredivanje imena
$('#ButtonUrediIme').click(function()
{
  if($('#ImeInput').val() == '')
  {
      $('#ImeInput').attr('placeholder', 'Unesite ime!');
      $('#ImeInput').css('border-color', 'red');
  }
  else
  {
    if(confirm('Jeste li sigurni?'))
    {
      $('#EditImeModal').modal('hide');
      UpdateUserNameDb();
    } 
  }
})

function UpdateUserNameDb() 
{  
  firebase.auth().currentUser.updateProfile({
    displayName: $('#ImeInput').val()
  }).then(function() 
  {
    UpdateUserNameUI();

  }).catch(function(error) 
  {
    alert('Došlo je do pogreške');
  });
}

function UpdateUserNameUI()
{
  user = firebase.auth().currentUser;
  $('#UserNameCard').text(user.displayName);
  $('#testBtn').html(`<img src="${user.photoURL}" alt="Avatar" id="UserPhoto">${user.displayName}`);
  $('#ImeInput').val(user.displayName);
}
////////////////////

//Uredivanje maila
$('#ButtonUrediEmail').click(function()
{
  if($('#EmailInput').val() == '' || $('#ServerInput').val() == '')
  {
    $('#EmailInput').val('');
    $('#EmailInput').attr('placeholder', 'Unesite mail!');
    $('#EmailInput').css('border-color', 'red');
    $('#ServerInput').css('border-color', 'red');
  }

  if($('#LozinkaProvjera').val() == '')
  {
    $('#LozinkaProvjera').attr('placeholder', 'Unesite lozinku!');
    $('#LozinkaProvjera').css('border-color', 'red');
  }

  if($('#EmailInput').val() != '' && $('#ServerInput').val() != '' && $('#LozinkaProvjera').val() != '')
  {
    if(confirm('Jeste li sigurni?'))
    {
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(user.email, $('#LozinkaProvjera').val());

      user.reauthenticateWithCredential(credential).then(function() 
      {
          $('#EditEmailModal').modal('hide');
          UpdateEmailDb();
            
      }).catch(function(error) 
      {
        if(error.code =='auth/wrong-password')
        {
          alert('Neispravna lozinka');
        }
        else
        {
          alert('Došlo je do pogreške, pokušajte kasnije');
          console.log(error.code);
        }
      });
    }
  }
})

function UpdateEmailDb() 
{  
  var user = firebase.auth().currentUser;
  var NoviMail = $('#EmailInput').val() + '@' + $('#ServerInput').val();

  user.updateEmail(NoviMail).then(function() 
  {
    UpdateMailUI();
  }).catch(function(error) 
  {
    errorCode = error.code;
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

function UpdateMailUI()
{
  user = firebase.auth().currentUser;
  $('#EmailCard').text(user.email);
}
////////////////////

//Uredivanje lozinke
$('#ButtonUrediLozinku').click(function()
{
  if($('#PasswordInput').val() == '')
  {
    $('#PasswordInput').attr('placeholder', 'Unesite novu lozinku!');
    $('#PasswordInput').css('border-color', 'red');
  }

  if($('#PasswordPotvrdiInput').val() == '')
  {
    $('#PasswordPotvrdiInput').attr('placeholder', 'Unesite novu lozinku!');
    $('#PasswordPotvrdiInput').css('border-color', 'red');
  }

  if($('#LozinkaProvjera2').val() == '')
  {
    $('#LozinkaProvjera2').attr('placeholder', 'Unesite staru lozinku!');
    $('#LozinkaProvjera2').css('border-color', 'red');
    $('.InfoButton').css('color', 'red');
  }

  if($('#PasswordInput').val() != $('#PasswordPotvrdiInput').val())
  {
    $('#PasswordPotvrdiInput').val('');
    $('#PasswordPotvrdiInput').attr('placeholder', 'Lozinka mora biti ista kao prethodno polje');
    $('#PasswordPotvrdiInput').css('border-color', 'red');
  }

  if($('#PasswordInput').val() != '' && $('#LozinkaProvjera2').val() != '' && $('#PasswordPotvrdiInputs').val() != '')
  {
    if(confirm('Jeste li sigurni?'))
    {
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(user.email, $('#LozinkaProvjera2').val());

      user.reauthenticateWithCredential(credential).then(function() 
      {
        UpdatePasswordDb();
      }).catch(function(error) 
      {
        if(error.code =='auth/wrong-password')
        {
          alert('Neispravna lozinka');
        }
        else
        {
          alert('Došlo je do pogreške, pokušajte kasnije');
          console.log(error.code);
        }
      });
    }
  }
})

function UpdatePasswordDb() 
{  
  var user = firebase.auth().currentUser;

  user.updatePassword($('#PasswordInput').val()).then(function() 
  {
    // Update successful.
  }).catch(function(error) 
  {
    // An error happened.
  });
}
////////////////////

$('#ButtonObrisiKorisnik').click(function()
{  
  if($('#LozinkaProvjeraDeleteUser').val() == '')
  {
    $('#LozinkaProvjeraDeleteUser').attr('placeholder', 'Unesite lozinku!');
    $('#LozinkaProvjeraDeleteUser').css('border-color', 'red');
  }
  else
  {
    if(confirm('Jeste li sigurni? Brisanjem korisnika izbrisat će se svi njegovi projekti i pripadajuće aktivnosti.'))
    {
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(user.email, $('#LozinkaProvjeraDeleteUser').val());

      user.reauthenticateWithCredential(credential).then(function() 
      {
          $('#DeleteUserModal').modal('hide');
          DeleteUser();

      }).catch(function(error) 
      {
        if(error.code == 'auth/wrong-password')
        {
          alert('Neispravna lozinka');
        }
      });
    }
  }
})

function DeleteUser()
{
  var userId = firebase.auth().currentUser.uid;

  if($('#LozinkaProvjeraDeleteUser').val() == '')
  {
    $('#LozinkaProvjeraDeleteUser').css('border-color', 'red');
    $('#LozinkaProvjeraDeleteUser').attr('placheloder', 'unesite lozinku');
  }
  else
  {
    //Brisanje korisnika
    user.delete().then(function() 
    {
      //Brisanje projekata i njegovih aktivnosti
      oDbProjekti.once('value', function (oOdgovorPosluzitelja)
      {
        oOdgovorPosluzitelja.forEach(function (oProjektSnapshot)
        {
          if(oProjektSnapshot.val().korisnik == user.uid)
          {
            //Aktivnosti
            oDbAktivnosti.once('value', function (oOdgovorPosluzitelja)
            {
              oOdgovorPosluzitelja.forEach(function (oAktivnostSnapshot)
              {
                if(oAktivnostSnapshot.val().projekt_id == oProjektSnapshot.key)
                {
                  var oAktivnostRef = oDb.ref('Aktivnosti/' + oAktivnostSnapshot.key);
                  oAktivnostRef.remove();
                }              
              });
            });
            //////////
        var oProjektRef = oDb.ref('Projekti/' + oProjektSnapshot.key);
        oProjektRef.remove();
      }        
    });
  });
    }).catch(function(error) {
      alert(error.code)
    });
  }

  

  
}

$('.modal').on('hidden.bs.modal', function () {
  $('#ProfileImageUrl').css('border-color', '#CED4DA');
  $('#ProfileImageUrl').attr('placeholder', '');
  
  $('#ImeInput').css('border-color', '#CED4DA');
  $('#ImeInput').attr('placeholder', '');
  
  $('#EmailInput').css('border-color', '#CED4DA');
  $('#EmailInput').attr('placeholder', '');
  $('#EmailInput').val();
  
  $('#ServerInput').css('border-color', '#CED4DA');
  $('#ServerInput').attr('placeholder', '');
  $('#ServerInput').val();
  
  $('#LozinkaProvjera').css('border-color', '#CED4DA');
  $('#LozinkaProvjera').attr('placeholder', '');
  $('#LozinkaProvjera').val();

  $('#PasswordInput').css('border-color', '#CED4DA');
  $('#PasswordInput').attr('placeholder', '');
  $('#PasswordInput').val();

  $('#PasswordPotvrdiInput').css('border-color', '#CED4DA');
  $('#PasswordPotvrdiInput').attr('placeholder', '');
  $('#PasswordPotvrdiInput').val();

  $('#LozinkaProvjera2').css('border-color', '#CED4DA');
  $('#LozinkaProvjera2').attr('placeholder', '');
  $('#LozinkaProvjera2').val();
})