oDbProjekti.on('value', function (oOdgovorPosluzitelja)
{
    $('.ContainerAktivnosti').hide();

    var UkupnaVrijednost = 0;

    var Pripremi = new Array();
    var Tijeku = new Array();
    var Zavrseni = new Array();

    var Drustveni = new Array();
    var Infrastrukturni = new Array();
    var Kulturni = new Array();

    oOdgovorPosluzitelja.forEach(function (oProjektSnapshot)
    {
        UkupnaVrijednost += parseFloat(oProjektSnapshot.val().vrijednost.split(' ')[0]);

        switch(oProjektSnapshot.val().status)
        {
            case 'U pripremi':
                Pripremi.push(oProjektSnapshot.val().naziv);
                break;
            case 'U tijeku':
                Tijeku.push(oProjektSnapshot.val().naziv);
                break;
            case 'Završen':
                Zavrseni.push(oProjektSnapshot.val().naziv);
                break;
        }

        switch(oProjektSnapshot.val().tip)
        {
            case 'Društveni':
                Drustveni.push(oProjektSnapshot.val().naziv);
                break;
            case 'Infrastrukturni':
                Infrastrukturni.push(oProjektSnapshot.val().naziv);
                break;
            case 'Kulturni':
                Kulturni.push(oProjektSnapshot.val().naziv);
                break;
        }
    })
    var Ukupno = Pripremi.length + Tijeku.length + Zavrseni.length;

    DodajProgressBar('progPripremi', 'U pripremi', 'Pripremi', Math.round(Pripremi.length/Ukupno*100), Pripremi);
    DodajProgressBar('progTijeku', 'U tijeku', 'Tijeku', Math.round(Tijeku.length/Ukupno*100), Tijeku);
    DodajProgressBar('progZavrseni', 'Završeni', 'Zavrseni', Math.round(Zavrseni.length/Ukupno*100), Zavrseni);

    DodajProgressBar('progDrustveni', 'Društveni', 'Tip', Math.round(Drustveni.length/Ukupno*100), Drustveni);
    DodajProgressBar('progInfrastrukturni', 'Infrastrukturni', 'Tip', Math.round(Infrastrukturni.length/Ukupno*100), Infrastrukturni);
    DodajProgressBar('progKulturni', 'Kulturni', 'Tip', Math.round(Kulturni.length/Ukupno*100), Kulturni);

    $('#BrojProjekata').empty();
    $('#BrojProjekata').html('Broj projekata<br><span class="display-4">' + Ukupno + '</span>');

    $('#UkupnaVrijednost').empty();
    $('#UkupnaVrijednost').html('Ukupna vrijednost<br><span class="display-4">' + UkupnaVrijednost.toFixed(2) + '</span>');

    $('#ProsjecnaVrijednost').empty();
    if(isNaN((UkupnaVrijednost/Ukupno)))
    {
        $('#ProsjecnaVrijednost').html('Prosječna vrijednost<br><span class="display-4">0.00</span>');
    }
    else
    {
        $('#ProsjecnaVrijednost').html('Prosječna vrijednost<br><span class="display-4">' + (UkupnaVrijednost/Ukupno).toFixed(2) + '</span>');
    }
});

oDbAktivnosti.on('value', function(oOdgovorPosluzitelja)
{
    var ProsjecanRok = 0;
    var Tijeku = new Array();
    var Zavrseni = new Array();
    oOdgovorPosluzitelja.forEach(function(oAktivnostSnapshot)
    {
        ProsjecanRok += parseFloat(oAktivnostSnapshot.val().rok);
        switch(oAktivnostSnapshot.val().status)
        {
            case 'U tijeku':
                Tijeku.push(oAktivnostSnapshot.val().naziv);
                break;
            case 'Završen':
                Zavrseni.push(oAktivnostSnapshot.val().naziv);
                break;
        }
    })

    var Ukupno = Tijeku.length + Zavrseni.length;

    DodajProgressBar('progTijekuAk', 'U tijeku', 'Tijeku', Math.round(Tijeku.length/Ukupno*100), Tijeku);
    DodajProgressBar('progZavrseniAk', 'Završeni', 'Zavrseni', Math.round(Zavrseni.length/Ukupno*100), Zavrseni);

    $('#BrojAktivnosti').empty();
    $('#BrojAktivnosti').html('Broj aktivnosti<br><span class="display-4">' + Ukupno + '</span>');

    $('#ProsjecanRok').empty();
    if(isNaN(Math.round(ProsjecanRok/Ukupno)))
    {
        $('#ProsjecanRok').html('Prosječan rok<br><span class="display-4">0</span>');
    }
    else
    {
        $('#ProsjecanRok').html('Prosječan rok<br><span class="display-4">' + Math.round(ProsjecanRok/Ukupno) + '</span>');
    }
});

function DodajProgressBar(Kolona, Naslov, Klasa, Vrijednost, array)
{
    $('#' + Kolona).empty();
    if(isNaN(Vrijednost))
    {
        Vrijednost = '0';
    }
    var AppendString = `<div class="bg-white rounded-lg p-5 m-5 shadow">
    <h4 class="font-weight-bold text-center mb-4">${Naslov}</h4>

    <!-- Progress bar 1 -->
    <div class="progress mx-auto" data-value='${Vrijednost}'>
      <span class="progress-left">
                    <span class="progress-bar progress-${Klasa}"></span>
      </span>
      <span class="progress-right">
                    <span class="progress-bar progress-${Klasa}"></span>
      </span>
      <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
        <div class="h2 font-weight-bold">${Vrijednost}<sup class="small">%</sup></div>
      </div>
    </div>
    <!-- END -->

    <!-- info -->
        <div class="row text-center mt-4" id="Button-${Kolona}">
        </div>
    <!-- END -->
  </div> `
    $('#' + Kolona).append(AppendString);

    for(var i = 0; i < array.length; i++)
    {
        $('#Button-' + Kolona).append('<button class="btn btn-list">' + array[i] + '</button>');
    }

    ProgressInit();
}

firebase.auth().onAuthStateChanged(function(user) {
	if (user)
	{
		$('#testBtn').html(`<img src="${user.photoURL}" alt="Avatar" id="UserPhoto">${user.displayName}`);
	} 
	else 
	{
		window.open('index.html',"_self")
	}
});

$(window).focus(function()
{
	if($('#UserPhoto').attr('src') != firebase.auth().currentUser.photoURL || $('#testBtn').text() != firebase.auth().currentUser.displayName)
	{
		$('#testBtn').html(`<img src="${firebase.auth().currentUser.photoURL}" alt="Avatar" id="UserPhoto">${firebase.auth().currentUser.displayName}`);
	}
});

//progress bar
function ProgressInit()
{
    $(function() {

        $(".progress").each(function() {
    
        var value = $(this).attr('data-value');
        var left = $(this).find('.progress-left .progress-bar');
        var right = $(this).find('.progress-right .progress-bar');
    
        if (value > 0) {
            if (value <= 50) {
            right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
            } else {
            right.css('transform', 'rotate(180deg)')
            left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
            }
        }
    
        })
    
        function percentageToDegrees(percentage) {
    
        return percentage / 100 * 360
    
        }
    
    });
}

$('#RadioButtons').change(function()
{
    if($('#Projekti').is(':checked') == false)
    {
        $('.ContainerProjekti').hide();
    }
    else
    {
        $('.ContainerProjekti').show();
    }
    
    if($('#Aktivnosti').is(':checked') == false)
    {
        $('.ContainerAktivnosti').hide();
    }
    else
    {
        $('.ContainerAktivnosti').show();
    }
})
