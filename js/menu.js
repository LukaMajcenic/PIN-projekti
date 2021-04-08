$('#ButtonHome').click(function()
{
	window.open('Home.html', "_blank");
})

$('#ButtonStatistika').click(function()
{
	window.open('statistika.html', "_blank");
})

$('#ButtonProfil').click(function()
{
	window.open('Profil.html', "_blank");
})

$('#testBtn').click(function()
{
	window.open('Profil.html', "_blank");
})

$('#ButtonOdjava').click(function()
{
	firebase.auth().signOut().then(() => {
		// Sign-out successful.
	  })
})

$('#OtvoriMenu').click(function()
{
	$('#Menu').show();
	$('#MainPageContainer').css('width', '80%');
	$('#OtvoriMenu').hide();
})

$('#ZatvoriMenu').click(function()
{
	$('#Menu').hide();
	$('#MainPageContainer').css('width', '100%');
	$('#OtvoriMenu').show();
})