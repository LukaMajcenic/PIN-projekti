const RYG = ['#FF6666', '#FFEE66', '#77DD77'];

function SetActiveColor()
{
	let randomIndex = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
	document.documentElement.style.setProperty('--active-color', RYG[randomIndex]);
}

document.addEventListener("DOMContentLoaded", function(event) {
SetActiveColor();
let MenuExpanded = false;

const showNavbar = (toggleId, navId, bodyId, headerId) =>
{
	const toggle = document.getElementById(toggleId),
	nav = document.getElementById(navId),
	bodypd = document.getElementById(bodyId),
	headerpd = document.getElementById(headerId)

	//Postavi trenutni link aktivan
	$(`a[href="${window.location.pathname.split("/").pop()}"]`).addClass('active');

	// Validate that all variables exist
	if(toggle && nav && bodypd && headerpd)
	{
		toggle.addEventListener('click', ()=>
		{
			$('#' + toggleId).removeClass();
			MenuExpanded = !MenuExpanded;
			// show navbar
			nav.classList.toggle('navShow')
			// add padding to body
			bodypd.classList.toggle('body-pd')
			// add padding to header
			headerpd.classList.toggle('body-pd')
			// change icon
			if(!MenuExpanded)
			{		
				setTimeout(function(){
					$('#ButtonDodajProjektModal').find('span').text('')
					$('#ButtonDodajProjektModal').find('span').removeClass('ms-2');
					$('#ButtonDodajProjektModal').removeClass('w-100');
				}, 500);		
				//$('#ButtonDodajProjektModal').find('span').text('');					
				$('#' + toggleId).addClass('fas fa-angle-double-right');
			}
			else
			{
				$('#ButtonDodajProjektModal').find('span').text('  Dodaj novi projekt');
				$('#ButtonDodajProjektModal').find('span').addClass('ms-2');
				$('#ButtonDodajProjektModal').addClass('w-100');
				$('#' + toggleId).addClass('fas fa-angle-double-left');
			}
		})
	}
}

showNavbar('header-toggle','nav-bar','body-pd','header')

/*===== LINK ACTIVE =====*/
const linkColor = document.querySelectorAll('.nav_link')

function colorLink()
{
	if(linkColor)
	{
		linkColor.forEach(function(l)
		{
			SetActiveColor();
			l.classList.remove('active')
		})
		this.classList.add('active')
	}
}
linkColor.forEach(l=> l.addEventListener('click', colorLink))

$('#Signout').click(function()
{
	firebase.auth().signOut().then(() => {
		// Sign-out successful.
	})
})

// Your code to run since DOM is loaded and ready
});