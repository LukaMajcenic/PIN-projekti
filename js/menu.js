const RYG = ['#FF6666', '#FFEE66', '#77DD77'];

function SetActiveColor()
{
	let randomIndex = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
	document.documentElement.style.setProperty('--active-color', RYG[randomIndex]);
}

document.addEventListener("DOMContentLoaded", function(event) {
SetActiveColor();

const showNavbar = (toggleId, navId, bodyId, headerId) =>
{
	const toggle = document.getElementById(toggleId),
	nav = document.getElementById(navId),
	bodypd = document.getElementById(bodyId),
	headerpd = document.getElementById(headerId)

	// Validate that all variables exist
	if(toggle && nav && bodypd && headerpd)
	{
		toggle.addEventListener('click', ()=>
		{
			// show navbar
			nav.classList.toggle('navShow')
			// change icon
			toggle.classList.toggle('bx-x')
			// add padding to body
			bodypd.classList.toggle('body-pd')
			// add padding to header
			headerpd.classList.toggle('body-pd')
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

// Your code to run since DOM is loaded and ready
});