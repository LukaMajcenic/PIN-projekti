function AddProjectCard(Tip)
{
	return `<div class="customCard">
	<div class="cardBody">
	  <a class="stretched-link text-decoration-none flexCenter" id="ButtonDodajProjekt${Tip}" data-bs-toggle="modal" href="#DodajProjektModal" data-bs-target="#DodajProjektModal">
		<i class="fas fa-plus-circle"></i>
	  </a>
	</div>
  </div>`;
}

for(let i = 0; i < RandomNumber(1, 6); i++)
{
	let Columns = ['#drustveni', '#infrastrukturni', '#kulturni'];
	$(Columns[RandomNumber(0,2)]).append('<div class="customCard skeletonCard"><div class="cardHeader"></div><div class="cardBody"></div></div>');
}
$('#drustveni').append(AddProjectCard('X'));
$('#infrastrukturni').append(AddProjectCard('Y'));
$('#kulturni').append(AddProjectCard('Z'));

oDbProjekti.on('value', function (oOdgovorPosluzitelja)
{
	$("#EditSvojstvaModal").modal({backdrop: false});
	$("#EditAktivnostiModal").modal({backdrop: false});
	$("#DodajAktivnostModal").modal({backdrop: false});
	
	$('.col-lg').empty();

	$('#drustveni').append('<div class="ColumnHeading">DRUŠTVENI</div>');
  	$('#infrastrukturni').append('<div class="ColumnHeading">INFRASTRUKTURNI</div>');
  	$('#kulturni').append('<div class="ColumnHeading">KULTURNI</div>');

	var ListaSortirana = new Array();
    var ListaStatusa = ['U pripremi', 'U tijeku', 'Završen'];

    for (var i = 0; i < ListaStatusa.length; i++) 
	{
		oOdgovorPosluzitelja.forEach(function (oProjektSnapshot)
		{
			if(oProjektSnapshot.val().status == ListaStatusa[i] && oProjektSnapshot.val().korisnik == firebase.auth().currentUser.uid)
			{
				ListaSortirana.push(oProjektSnapshot);
			}
		})
	}

	for (var i = 0; i < ListaSortirana.length; i++)
	{
		var oProjekt = ListaSortirana[i].val();

        var HeaderColor;
        var ClockIcon;
    	switch(oProjekt.status)
    	{
    		case 'U pripremi':
    		HeaderColor = '#FF6666';
			HeaderColor2 = 'R';
    		ClockIcon = 'fas fa-hourglass-start';
    		break;

    		case 'U tijeku':
    		HeaderColor = '#FFEE66';
			HeaderColor2 = 'Y';
    		ClockIcon = 'fas fa-hourglass-half';
    		break;

    		case 'Završen':
    		HeaderColor = '#77DD77'
			HeaderColor2 = 'G';
    		ClockIcon = 'fas fa-hourglass-end';
    		break;
		}

		var CardString = '<div class="customCard MainCard">' +
							'<div class="cardHeader" style="background-color: var(--' + HeaderColor2 + ')">' +
							'</div>' +
							'<div class="cardBody">' +
							'<a class="stretched-link text-decoration-none" id="' + ListaSortirana[i].key + '" href="#exampleModal" data-bs-toggle="modal" data-bs-target="#exampleModal">' +
								'<h5 class="mb-0 MainCardNaziv">' + oProjekt.naziv + '</h5>' +
								'<p class="cardTip">' + oProjekt.tip + '</p>' +
								'<hr class="solid">' +
								'<i class="fas fa-user-tie"></i>' +
								'<span>' + oProjekt.voditelj_ime + '</span> <span>' + oProjekt.voditelj_prezime +'</span><br>' +
								'<i class="fas fa-dollar-sign" style="margin: 0px 3px 0px 2px"></i>' +
								'<span>' + oProjekt.vrijednost + '</span><br>' +
								'<i class="fas fa-hourglass-half" style="margin: 0px 1px 0px 1px"></i>' +
								'<span class="MainCardStatus">' + oProjekt.status + '</span>' +
							'</a>' +
							'</div>' +
						'</div>';

  		switch(oProjekt.tip)
  		{
  			case 'Društveni':
  			$('#drustveni').append(CardString);
  			break;

  			case 'Infrastrukturni':
  			$('#infrastrukturni').append(CardString);
  			break;

  			case 'Kulturni':
  			$('#kulturni').append(CardString);
  			break;
  		}
	}
	
	var Charts = [];
	$('.hexagon').remove();
	oDbAktivnosti.on('value', function (oOdgovorPosluzitelja)
	{	
		Charts.forEach((value) => {value.destroy()})
		for (var i = 0; i < ListaSortirana.length; i++) 
		{	
			dataArray = [0, 0];
			oOdgovorPosluzitelja.forEach(function (oAktivnostSnapshot)
			{
				if(oAktivnostSnapshot.val().projekt_id == ListaSortirana[i].key)
				{
					switch(oAktivnostSnapshot.val().status)
					{
						case 'U tijeku':
							dataArray[0]++;
							break;
						case 'Završen':
							dataArray[1]++;
							break;
					}
					
				}	
			})
			
			const data = 
			{
				datasets: [{
				  data: dataArray,
				  backgroundColor: [RYG[1], RYG[2]],
				  hoverOffset: 0
				}]
			};

			const config = {
				type: 'doughnut',
				data: data,
				options:
				{					
					plugins:
					{
						tooltip:
						{	
							enabled: false
						},
						legend:
						{
							display: false
						}
					},
					borderWidth: 0,
					cutout: '80%'
				} 
			};
			
			if(ListaSortirana[i].val().aktivnosti > 0)
			{
				$('#' + ListaSortirana[i].key).parent().append(`<div class="hexagon">
				<canvas id="chart${ListaSortirana[i].key}"></canvas>
				<span>${ListaSortirana[i].val().aktivnosti}<span>
				</div>`);

				var myChart = new Chart(
					document.getElementById('chart' + ListaSortirana[i].key),
					config
				);

				Charts.push(myChart);
			}	
		}
	});	

	$('#drustveni').append(AddProjectCard('X'));

	$('#infrastrukturni').append(AddProjectCard('Y'));

	$('#kulturni').append(AddProjectCard('Z'));


	$('.MainCard').each(function(){
		$(this).attr('data-search-term', $(this).find('h5').text().toLowerCase());
	});

	$('.live-search-box').on('keyup', function(){
	
		SearchAndSort();
	
	});

	SearchAndSort();
});

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

function SearchAndSort()
{
	var searchTermRaw = $('.live-search-box').val();
	var searchTerm = searchTermRaw.toLowerCase();
		
	$('.MainCard').each(function(){

		//Removes all .markText as .text() doesnt return html tags
		$(this).find('.MainCardNaziv').text($(this).find('.MainCardNaziv').text());

		if(searchTerm.length > 0)
		{
			var naslov = $(this).find('.MainCardNaziv').text();
			naslov = naslov.replace(new RegExp(searchTerm,'i'),'<span class="markText">$&</span>');

			$(this).find('.MainCardNaziv').html(naslov);
		}
	
		if ($(this).filter('[data-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) 
		{
			$(this).show();
		} 
		else
		{
			$(this).hide();
		}
	
	});

	$('.MainCard').each(function(){
	
		var text = $(this).find('.MainCardStatus').text();

		if(text == 'U pripremi' && $('#Pripremi').is(':checked') == false)
		{
			$(this).hide();
		}

		if(text == 'U tijeku' && $('#Tijeku').is(':checked') == false)
		{
			$(this).hide();
		}

		if(text == 'Završen' && $('#Zavrsen').is(':checked') == false)
		{
			$(this).hide();
		}

	});
}

function ModalData(UnosProjektId, UnosAktivnostId, AccordionOtvoren)
{
	var oProjekt;

	oDbProjekti.once('value', function (oOdgovorPosluzitelja)
	{
		oOdgovorPosluzitelja.forEach(function (oProjektSnapshot)
		{
			if(oProjektSnapshot.key == UnosProjektId)
			{
				oProjekt = oProjektSnapshot.val()
			}
		})
	});

	$('#exampleModal').attr('aria-labelledby', UnosProjektId);
	$('#ModalNaslov').text(oProjekt.naziv);
	$('#ModalTip').text(oProjekt.tip);
	$('#ModalOpis').text(oProjekt.opis);	
	$('#ModalVoditeljIme').text(oProjekt.voditelj_ime);
	$('#ModalVoditeljPrezime').text(oProjekt.voditelj_prezime);
	$('#ModalVrijednost').text(oProjekt.vrijednost);
	$('#ModalStatus').text(oProjekt.status);
	$('#ModalBrojAktivnosti').text(oProjekt.aktivnosti);

	var IconColor;

	switch(oProjekt.status)
	{
		case 'U pripremi':
    		IconColor = '#FF6666';
    		ClockIcon = 'fas fa-hourglass-start';
    		break;

    		case 'U tijeku':
			IconColor = '#FFEE66';
    		ClockIcon = 'fas fa-hourglass-half';
    		break;

    		case 'Završen':
			IconColor = '#77DD77';
    		ClockIcon = 'fas fa-hourglass-end';
    		break;
	}

	$('.modal-header').css('background-color', IconColor);

	$('.modal-body').children('button').children('i').css('color', IconColor);
	$('#AddButton').css('color', 'white');

	$('#ModalClock').attr('class', ClockIcon);

	$('#AktivnostiAccordion').empty();
	oDbAktivnosti.once('value', function (oOdgovorPosluzitelja)
	{
		oOdgovorPosluzitelja.forEach(function (oAktivnostSnapshot)
		{			
			if(oAktivnostSnapshot.val().projekt_id == UnosProjektId)
			{
				console.log(oAktivnostSnapshot.val());

				var BoolShow = '';
				var BoolAreaExpanded = 'false';
				var BoolCollapsed = 'collapsed';

				if(UnosAktivnostId == oAktivnostSnapshot.key && AccordionOtvoren == true)
				{
					BoolShow = 'show';
					BoolAreaExpanded = 'true';
					BoolCollapsed = '';
				}
								
				var AktivnostIconColor;
				var AktivnostClockIcon;
				var ProgressBarAnimated;

				switch(oAktivnostSnapshot.val().status)
				{
				case 'U tijeku':
					AktivnostIconColor = '#FFEE66';
					AktivnostClockIcon = 'fas fa-hourglass-half';
					ProgressBarAnimated = 'progress-bar-animated';
    				break;

				case 'Završen':
					AktivnostIconColor = '#77DD77';
					AktivnostClockIcon = 'fas fa-hourglass-end';
					ProgressBarAnimated = '';
    				break;
				}

				var DatumKreiranja = moment(oAktivnostSnapshot.val().vrijeme_kreiranja, 'DD/MM/YYYY');
				const DatumRok = moment(oAktivnostSnapshot.val().datum_rok, 'DD/MM/YYYY');

				const TrenutniDatum = moment(new Date()).format('DD-MM-YYYY');

				var Rok = oAktivnostSnapshot.val().rok;
				var RokProdeniDani = RazlikaDatuma(TrenutniDatum, DatumKreiranja);

				var postotak = (RokProdeniDani/Rok) * 100;
				postotak = postotak.toFixed(2);

				if(postotak < 0)
				{
					postotak = 0;
				}
				console.log(postotak + '%');

				var AlertIcon;
				if(RokProdeniDani > Rok && oAktivnostSnapshot.val().status == 'U tijeku')
				{
					AlertIcon = 'fas fa-exclamation-triangle';
				}

				var Dan_Dana = 'dan';
				if(oAktivnostSnapshot.val().rok.toString()[oAktivnostSnapshot.val().rok.toString().length -1] != '1')
				{
					Dan_Dana += 'a';
				}

				var AktivnostId = oAktivnostSnapshot.key;
				var AccordionString = `<div class="row" style="margin-top: 4px;">
				<div class="col-lg-1 px-0">
				  <button id="${AktivnostId}" class="btn btn-sm EditButtonAktivnostStatus" type="button">
					<i id="IconAktivnostStatus" style="color: ${AktivnostIconColor};" class="${AktivnostClockIcon}"></i>
				  </button>
				  <button id="Del_${AktivnostId}" type="button" class="btn btn-sm EditButtonAktivnostDelete">
					<i style="color: #444444;" class="fas fa-trash-alt"></i>
				  </button>
				</div>
	
				<div class="col-lg-11 px-0">
				  <div class="accordion">
					<div class="accordion-item">
					  <h2 class="accordion-header">                    
						<button style="height: 100%;" class="accordion-button ${BoolCollapsed}" type="button" data-bs-toggle="collapse" data-bs-target="#A${AktivnostId}" aria-expanded="${BoolAreaExpanded}">                
						  ${oAktivnostSnapshot.val().naziv}
						</button>
					  </h2>
					</div>
				  </div>
				</div>
	
			  </div>
			  <div class="row">
				<div class="col-lg-12 px-0">
				
				  <div id="A${AktivnostId}" class="accordion-collapse collapse ${BoolShow}">
					<div class="accordion-body">

					<div class="progress">
						<div class="progress-bar progress-bar-striped ${ProgressBarAnimated}" role="progressbar" style="width: ${postotak}%;
						background-color: ${AktivnostIconColor};" aria-valuenow="${postotak}" aria-valuemin="0" aria-valuemax="100">
							<button type="button" class="btn btn-sm" style="background-color: transparent">
                        		<i style="color: red" class="${AlertIcon}"></i>
                        		<span style="color: #444444"><b>${oAktivnostSnapshot.val().status}</b></span>
                      		</button></div>
					  </div><br>

					  <!-- Aktivnost opis -->
					  <button type="button" class="btn btn-sm ReadOnlyButton">
						<i style="color: ${AktivnostIconColor}" class="fas fa-info-circle"></i>
						<span style="color: white">OPIS</span>
					  </button>
					  <button type="button" class="btn btn-sm EditButtonAktivnost" id="EditButtonAktivnostOpis" data-bs-toggle="modal" data-bs-target="#EditAktivnostiModal">` +
					  `<i class="fas fa-edit iEditButton"></i>`+
					  `</button>` +
					  `<br>` +
					  `<div class="card" style="background-color: #F9F9F9">` +
						`<div class="card-body" id="AktivnostOpis_${AktivnostId}">${oAktivnostSnapshot.val().opis}</div>` +
					  `</div><br>` +
	
					  `<!-- Aktivnost vrijeme kreiranja -->
					  <button type="button" class="btn btn-sm ReadOnlyButton">
						<i style="color: ${AktivnostIconColor}" class="far fa-calendar-alt"></i>
						<span style="color: white">VRIJEME KREIRANJA</span>
					  </button>
					  <button type="button" class="btn btn-sm EditButtonAktivnost" id="EditButtonAktivnostVrijemeKreiranja" data-bs-toggle="modal" data-bs-target="#EditAktivnostiModal">
                    	<i class="fas fa-edit iEditButton"></i>` +
                  		`</button>` +
					  `<br>` +
					  `<div class="card" style="background-color: #F9F9F9">` +
						`<div class="card-body" id="AktivnostVrijemeK_${AktivnostId}">${oAktivnostSnapshot.val().vrijeme_kreiranja}</div>` +
					  `</div><br>` +
	
					  `<!-- Aktivnost rok -->
					  <button type="button" class="btn btn-sm ReadOnlyButton">
						<i style="color: ${AktivnostIconColor}" class="far fa-clock"></i>
						<span style="color: white">ROK</span>
					  </button>
					  <button type="button" class="btn btn-sm EditButtonAktivnost" id="EditButtonAktivnostRok" data-bs-toggle="modal" data-bs-target="#EditAktivnostiModal">
                    	<i class="fas fa-edit iEditButton"></i>` +
                  		`</button>` +
					  `<br>` +
					  `<div class="card" style="background-color: #F9F9F9">` +			  	
						`<div class="card-body">` +
						`<span id="AktivnostDatumRok_${AktivnostId}">${oAktivnostSnapshot.val().datum_rok}</span> <span id="AktivnostRok_${AktivnostId}">(${oAktivnostSnapshot.val().rok} ${Dan_Dana})</span>` +
						`</div>` +
					  `</div><br>` +
	
					`</div>
				  </div>
				</div>
			  </div>`;

				$('#AktivnostiAccordion').append(AccordionString);
			}
		})
	});
}

$('.col-lg').on('click', 'a', function()
{
	console.log($(this).attr('class'));
	ModalData($(this).attr('id'), null, false);
});

function ModalEdit(ButtonId, TextAppend)
{
	$('#EditSvojstvaModal').find('.modal-body').attr('id', 'Modal_' + ButtonId);
	$('#EditSvojstvaModal').find('.modal-body').empty();

	$('#EditSvojstvaModal').find('.modal-body').append(TextAppend + `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="Odustani">Close</button>`);	
	$('#EditSvojstvaModal').find('.modal-body').append(`<button type="button" class="btn btn-success" id="Spremi">Spremi</button>`);
}

$('#EditButtonNaslov').click(function()
{
	var ButtonId = $(this).attr('id');
	
	var DruštveniTrue = '';
	var InfrastrukturniTrue = '';
	var KulturniTrue = '';

	switch($('#ModalTip').text())
	{
		case 'Društveni':
			DruštveniTrue = 'selected';
			break;
		case 'Infrastrukturni':
			InfrastrukturniTrue = 'selected'; 
			break;
		case 'Kulturni':
			KulturniTrue = 'selected';
			break;
	}

	var TextAppend =  `<!-- Edit naslov -->
	<div class="input-group mb-3">
	  <span class="input-group-text">NASLOV</span>
	  <textarea class="form-control" id="EditNaslov" aria-label="With textarea" rows="1">${$('#ModalNaslov').text()}</textarea>
	</div>

	<!-- Edit tip -->
	<div class="input-group mb-3">
	  <label class="input-group-text">TIP</label>
	  <select class="form-select" id="EditTip">
		<option ${DruštveniTrue} value="Društveni">Društveni</option>
		<option ${InfrastrukturniTrue} value="Infrastrukturni">Infrastrukturni</option>
		<option ${KulturniTrue} value="Kulturni">Kulturni</option>
	  </select>
	</div>`;

	ModalEdit(ButtonId, TextAppend);
});

$('#EditButtonOpis').click(function()
{
	var ButtonId = $(this).attr('id');

	var TextAppend = `<!-- Edit opis -->
	<div class="input-group mb-3">
	  <span class="input-group-text">OPIS</span>
	  <textarea class="form-control" id="EditOpis" aria-label="With textarea" rows="1">${$('#ModalOpis').text()}</textarea>
	</div>`;

	ModalEdit(ButtonId, TextAppend);
});

$('#EditButtonVoditelj').click(function()
{
	var ButtonId = $(this).attr('id');

	var TextAppend = `<div class="input-group mb-3">
	<span class="input-group-text">IME I PREZIME</span>
	<input type="text" class="form-control" id="EditIme" value="${$('#ModalVoditeljIme').text()}">
	<input type="text" class="form-control" id="EditPrezime" value="${$('#ModalVoditeljPrezime').text()}">
  	</div>`;

  	ModalEdit(ButtonId, TextAppend);
});

$('#EditButtonVrijednost').click(function()
{
	var ButtonId = $(this).attr('id');

	var DollarTrue = '';
	var EuroTrue = '';
	var KunaTrue = '';

	switch($('#ModalVrijednost').text().substring($('#ModalVrijednost').text().length - 2))
	{
		case ' $':
			DollarTrue = 'selected';
			break;
		case ' €':
			EuroTrue = 'selected'; 
			break;
		case 'kn':
			KunaTrue = 'selected';
			break;
	}

	var TextAppend = `<div class="input-group mb-3">
	<span class="input-group-text">VRIJEDNOST</span>
	<input type="number" min="1" class="form-control" id="EditVrijednost" value="${$('#ModalVrijednost').text().split(' ', 1)}" style="width: 60%">
	<select class="form-select w-auto" id="EditVrijednostValuta">
	  <option ${DollarTrue} value="$">$</option>
	  <option ${EuroTrue} value="€">€</option>
	  <option ${KunaTrue} value="kn">kn</option>
	</select>
  	</div>`;

  	ModalEdit(ButtonId, TextAppend);
});

$('#EditButtonStatus').click(function()
{
	var ButtonId = $(this).attr('id');

	var uPripremiTrue = '';
	var utijekuTrue = '';
	var ZavrsenTrue = '';

	switch($('#ModalStatus').text())
	{
		case 'U pripremi':
			uPripremiTrue = 'selected';
			break;
		case 'U tijeku':
			utijekuTrue = 'selected'; 
			break;
		case 'Završen':
			ZavrsenTrue = 'selected';
			break;
	}

	var TextAppend = `<div class="input-group mb-3">
	<label class="input-group-text">STATUS</label>
	<select class="form-select" id="EditStatus">
	  <option ${uPripremiTrue} value="U pripremi">U pripremi</option>
	  <option ${utijekuTrue} value="U tijeku">U tijeku</option>
	  <option ${ZavrsenTrue} value="Završen">Završen</option>
	</select>
  </div>`;

  	ModalEdit(ButtonId, TextAppend);
});

function ModalEditAktivnosti(ButtonId, AktivnostId, TextAppend)
{
	$('#EditAktivnostiModal').attr('aria-labelledby', 'Modal_' + ButtonId + '_' + AktivnostId);
	$('#EditAktivnostiModal').find('.modal-body').empty();

	$('#EditAktivnostiModal').find('.modal-body').append(TextAppend + `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="OdustaniAktivnost">Close</button>`);	
	$('#EditAktivnostiModal').find('.modal-body').append(`<button type="button" class="btn btn-success" id="SpremiAktivnost">Spremi</button>`);
}

function InicijalizirajDateTime()
{
	$.fn.datepicker.defaults.language = 'en';
      		$('.input-group.date').datepicker({
        		format: "dd/mm/yyyy",
				clearBtn: true,
				todayHighlight: true,
				orientation: 'right top',
				autoclose: true,
				language: 'hr'
      		}).on('changeDate', function(){
				PromjenaInputaDatum();
				PromjenaInputaDatumAdd();
			})
}

function PromjenaInputaDatum()
{
	
	var AktivnostId = $('#EditAktivnostiModal').attr('aria-labelledby').split('_')[2];

	var DatumKreiranja = moment($('#AktivnostVrijemeK_' + AktivnostId).text(), 'DD/MM/YYYY');
	var DatumRok = moment($('#date').val(), 'DD/MM/YYYY');

	if(DatumRok.isValid() == true && DatumRok > DatumKreiranja)
	{
		var Razlika = RazlikaDatuma(DatumRok, DatumKreiranja);
		$('#rok').val(Razlika);

		if(Razlika.toString()[Razlika.toString().length - 1] == '1' && Razlika !='11')
		{
			$('#rokString').attr('value', 'dan');
		}
		else
		{
			$('#rokString').attr('value', 'dana');
		}
	}
	else
	{
		$('#rok').val('');
	}
}

function PromjenaInputaRok()
{
	console.log('a ova')
	var AktivnostId = $('#EditAktivnostiModal').attr('aria-labelledby').split('_')[2];

	var DatumRok = moment($('#AktivnostVrijemeK_' + AktivnostId).text(), 'DD/MM/YYYY');
	var DaniRok = $('#rok').val();

	if($('#rok').val() > 0)
	{
		DatumRok.add(DaniRok, 'days');
		DatumRok = DatumRok.format('DD/MM/YYYY');
		$('#date').val(DatumRok);

		if(DaniRok.toString()[DaniRok.toString().length - 1] == '1' && DaniRok !='11')
		{
			$('#rokString').attr('value', 'dan');
		}
		else
		{
			$('#rokString').attr('value', 'dana');
		}
	}
	else
	{
		$('#rok').val('1')
		var DatumRok = moment($('#AktivnostVrijemeK_' + AktivnostId).text(), 'DD/MM/YYYY');
		DatumRok.add(1, 'days');
		DatumRok = DatumRok.format('DD/MM/YYYY');
		$('#date').val(DatumRok);
	}

	//$('.date').datepicker('update', $('#date').val()); 
}

$('#AktivnostiAccordion').on('click', '.EditButtonAktivnost', function(){

	var ButtonId = $(this).attr('id');
	var AktivnostId = $(this).parents().eq(1).attr('id').substring(1);
	var TextAppend;

	switch(ButtonId)
	{
		case 'EditButtonAktivnostOpis':
			TextAppend = `<!-- Edit opis -->
			<div class="input-group mb-3">
	  			<span class="input-group-text">OPIS</span>
	  			<textarea class="form-control" id="EditAktivnostOpis" aria-label="With textarea" rows="1">${$('#AktivnostOpis_' + AktivnostId).text()}</textarea>
			</div>`;
			ModalEditAktivnosti(ButtonId, AktivnostId, TextAppend);
			break;

		case 'EditButtonAktivnostVrijemeKreiranja':
			var DatumRok = moment($('#AktivnostDatumRok_' + AktivnostId).text(), 'DD/MM/YYYY');
			DatumRok.subtract(1, 'days');
			DatumRok = DatumRok.format('DD/MM/YYYY');

			TextAppend = `<div class="input-group date mb-3" data-date-end-date="${DatumRok}">
			<span class="input-group-text">VRIJEME KREIRANJA</span>
			<input class="form-control" id="date" name="date" type="text" value="${$('#AktivnostVrijemeK_' + AktivnostId).text()}"/>
			<div class="input-group-addon textarea-addon">
			  <span><i class="far fa-calendar-alt iEditButton"></i></span>
			</div>
		  </div>`;

			ModalEditAktivnosti(ButtonId, AktivnostId, TextAppend);
			InicijalizirajDateTime();
			break;

		case 'EditButtonAktivnostRok':
			$(document).on('input', '#date', function () { 

				PromjenaInputaDatum();
				
			});

			$(document).on('input', '#rok', function () { 

				PromjenaInputaRok();
			});
			
			var DatumKreiranja = moment($('#AktivnostVrijemeK_' + AktivnostId).text(), 'DD/MM/YYYY');
			DatumKreiranja.add(1, 'days');
			DatumKreiranja = DatumKreiranja.format('DD/MM/YYYY');

			TextAppend = `<div class="input-group date mb-3" data-date-start-date="${DatumKreiranja}">
			<span class="input-group-text">DATUM ROK</span> 
			<input class="form-control" id="date" data-date-format="dd/mm/yyyy" name="date" type="text" value="${$('#AktivnostDatumRok_' + AktivnostId).text()}"/>
			<div class="input-group-addon textarea-addon" data-date-format="dd/mm/yyyy">
			  <span><i class="far fa-calendar-alt iEditButton"></i></span>
			</div>
		  </div>

		  <div class="input-group mb-3">
		  	<span class="input-group-text">ROK</span> 
			  <input type="number" class="form-control" id="rok" min="1" value="${$('#AktivnostRok_' + AktivnostId).text().split(' ')[0].substring(1)}" style="width: 40%">
			  <input type="text" class="form-control" id="rokString" value="dan/a" readonly>
			  	<button type="button" class="btn btn-sm EditButtonAktivnost" id="Dodaj10dana">
                    <b class="iEditButton">+10</b>
				</button>
				<button type="button" class="btn btn-sm EditButtonAktivnost" id="Dodaj30dana">
                    <b class="iEditButton">+30</b>
				</button>
		  </div>`;		

		  	ModalEditAktivnosti(ButtonId, AktivnostId, TextAppend);
			InicijalizirajDateTime();
			PromjenaInputaDatum();
			break;
	}
});

function ProvjeraUnosa(PoljeUnosa, Tekst)
{
	PoljeUnosa.css('border-color', 'red');
	PoljeUnosa.attr('placeholder', Tekst);

	return false;
}

function RazlikaDatuma(DatumRok, DatumKreiranja)
{
	DatumKreiranja = moment(DatumKreiranja, 'DD/MM/YYYY');
	DatumRok = moment(DatumRok, 'DD/MM/YYYY');

	return DatumRok.diff(DatumKreiranja, 'days');
}

$('.modal-body').on('click', '#Spremi', function()
{	
	var IspravnaVrijednost = true;
	var oProjektRef = oDb.ref('Projekti/' + $('#exampleModal').attr('aria-labelledby'));
	var Atribut = $('#EditSvojstvaModal').find('.modal-body').attr('id');
	var oProjekt = {};

	switch(Atribut)
	{
		case 'Modal_EditButtonNaslov':
			$('#EditNaslov').val($('#EditNaslov').val().trim());
			if($('#EditNaslov').val() != '')
			{
				oProjekt = 
				{
					'naziv': $('#EditNaslov').val(), 
					'tip': $('#EditTip').val()
				};	
			}
			else
			{
				IspravnaVrijednost = ProvjeraUnosa($('#EditNaslov'), 'Unesite naziv!');
			}
			break;

		case 'Modal_EditButtonOpis':
			$('#EditOpis').val($('#EditOpis').val().trim());
			if($('#EditOpis').val() != '')
			{
				oProjekt = 
				{
					'opis': $('#EditOpis').val()
				};
			}
			else
			{
				IspravnaVrijednost = ProvjeraUnosa($('#EditOpis'), 'Unesite opis!');
			}
			break;

		case 'Modal_EditButtonVoditelj':
			$('#EditIme').val($('#EditIme').val().trim());
			if($('#EditIme').val() != '')
			{
				oProjekt['voditelj_ime'] = $('#EditIme').val();
				$('#EditIme').css('border-color', '#CED4DA');
			}
			else
			{
				IspravnaVrijednost = ProvjeraUnosa($('#EditIme'), 'Unesite ime!');
			}
			$('#EditPrezime').val($('#EditPrezime').val().trim());
			if($('#EditPrezime').val() != '')
			{
				oProjekt["voditelj_prezime"] = $('#EditPrezime').val();
				$('#EditPrezime').css('border-color', '#CED4DA');
			}
			else
			{
				IspravnaVrijednost = ProvjeraUnosa($('#EditPrezime'), 'Unesite prezime!');
			}			
			break;

		case 'Modal_EditButtonVrijednost':
			$('#EditVrijednost').val($('#EditVrijednost').val().trim());
			if ($('#EditVrijednost').val() == '')
			{
				IspravnaVrijednost = ProvjeraUnosa($('#EditVrijednost'), 'Unesite vrijednost!');
			}
			else
			{
				oProjekt = 
				{
					'vrijednost': $('#EditVrijednost').val() + ' ' + $('#EditVrijednostValuta').val()
				};
			}
			break;

		case 'Modal_EditButtonStatus':
			oProjekt = 
			{
				'status': $('#EditStatus').val()
			};
			break;
	}
	
	if(IspravnaVrijednost == true)
	{
		oProjektRef.update(oProjekt);	
		ModalData($('#exampleModal').attr('aria-labelledby'), null, false);
		$('#EditSvojstvaModal').modal('toggle');

		ObrisiNedavno();
	}
});

function ObrisiNedavno()
{
	$('#NedavnoUpdate').remove();
	var ProjektId = $('#exampleModal').attr('aria-labelledby');
	$('#' + ProjektId).append('<i class="fas fa-check-circle" id="NedavnoUpdate"></i>');
}

$('.modal-body').on('click', '#SpremiAktivnost', function()
{	
	var IspravnaVrijednost = true;
	var IdAktivnosti = $('#EditAktivnostiModal').attr('aria-labelledby').split('_')[2];
	var oAktivnostRef = oDb.ref('Aktivnosti/' + IdAktivnosti);
	var Atribut = $('#EditAktivnostiModal').attr('aria-labelledby').split('_')[1];
	var oAktivnost;

	switch(Atribut)
	{
		case 'EditButtonAktivnostOpis':
			$('#EditAktivnostOpis').val($('#EditAktivnostOpis').val().trim());
			if($('#EditAktivnostOpis').val() != '')
			{
				oAktivnost = 
				{
					'opis': $('#EditAktivnostOpis').val(), 
				};	
			}
			else
			{
				IspravnaVrijednost = ProvjeraUnosa($('#EditAktivnostOpis'), 'Unesite opis!');
			}
			break;

		case 'EditButtonAktivnostVrijemeKreiranja':
			$('#date').val($('#date').val().trim());
			if($('#date').val() == '')
			{
				IspravnaVrijednost = ProvjeraUnosa($('#date'), 'Unesite datum!');
			}
			else if(moment($('#date').val(), 'DD/MM7YYYY').isValid() == false)
			{
				IspravnaVrijednost = ProvjeraUnosa($('#date'), 'Neispravan datum!');
			}
			else
			{
				oAktivnost = 
				{
					'vrijeme_kreiranja': $('#date').val(),
					'rok': RazlikaDatuma($('#AktivnostDatumRok_' + IdAktivnosti).text(), $('#date').val())
				};
			}
			break;	

		case 'EditButtonAktivnostRok':
			$('#date').val($('#date').val().trim());
			if($('#date').val() == '' || $('#rok').val() == '')
			{
				IspravnaVrijednost = ProvjeraUnosa($('#date'), 'Unesite datum!');
				IspravnaVrijednost = ProvjeraUnosa($('#rok'), 'Unesite rok!');
			}
			else if(moment($('#date').val(), 'DD/MM/YYYY').isValid() == false)
			{
				IspravnaVrijednost = ProvjeraUnosa($('#date'), 'Neispravan datum!');
			}
			else
			{
				oAktivnost = 
				{
					'datum_rok': $('#date').val(),
					'rok': RazlikaDatuma($('#date').val(), $('#AktivnostVrijemeK_' + IdAktivnosti).text())
				};
			}
			break;			
	}
	if(IspravnaVrijednost == true)
	{
		oAktivnostRef.update(oAktivnost);
		ModalData($('#exampleModal').attr('aria-labelledby'), IdAktivnosti, true);
		$('#EditAktivnostiModal').modal('toggle');
		ObrisiNedavno();
	}	
});

$('.modal-body').on('click', '.EditButtonAktivnostStatus', function()
{	
	var oAktivnostRef = oDb.ref('Aktivnosti/' + $(this).attr('id'));
	var oAktivnost;

	var Ikona = $(this).children().first();
	switch(Ikona.attr('class'))
	{
		case 'fas fa-hourglass-half':
			Ikona.attr('class', 'fas fa-hourglass-end');
			Ikona.css('color', '#FFEE66');
			oAktivnost =
			{
				'status': 'Završen'
			};
			break;
		case 'fas fa-hourglass-end':
			Ikona.attr('class', 'fas fa-hourglass-half');
			Ikona.css('color', '#77DD77');
			oAktivnost =
			{
				'status': 'U tijeku'
			};
			break;
	}
	
	oAktivnostRef.update(oAktivnost);
	
	var ModalOtvoren = false;

	if($(this).parents().first().siblings().first().find('.accordion-button').attr('aria-expanded') == 'true')
	{
		ModalOtvoren = true;
	}
	ModalData($('#exampleModal').attr('aria-labelledby'), $(this).attr('id'), ModalOtvoren);
	ObrisiNedavno();
});

//Vraca scrollbar... *vracao je... **vraca opet...
$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});

function progressbar()
{
	$(function() {

		$(".progress2").each(function() {
	  
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

$('.modal-body').on('mouseenter', '.EditButtonAktivnostStatus', function()
{
	switch($(this).children().first().attr('class'))
	{
		case 'fas fa-hourglass-half':
			$(this).css("box-shadow", "inset 0 10px 12px -5px #FFE700");
			break;
		case 'fas fa-hourglass-end':
			$(this).css("box-shadow", "inset 0 10px 12px -5px #77DD77");
			break;
	}
	
});
$('.modal-body').on('mouseleave', '.EditButtonAktivnostStatus', function()
{
	$(this).css("box-shadow", "inset 0 20px 12px -5px rgba(0,0,0,0)");
});

$('#HeaderButton').click(function()
{
	if(confirm('Jeste li sigurni?'))
    {
		var ProjektKey = $('#exampleModal').attr('aria-labelledby');

		oDbAktivnosti.once('value', function (oOdgovorPosluzitelja)
		{
			oOdgovorPosluzitelja.forEach(function (oAktivnostSnapshot)
			{			
				if(oAktivnostSnapshot.val().projekt_id == ProjektKey)
				{
					var oAkitvnostRef = oDb.ref('Aktivnosti/' + oAktivnostSnapshot.key);
					oAkitvnostRef.remove();
				}
			})
		});
	
		var oProjektRef = oDb.ref('Projekti/' + ProjektKey);
		oProjektRef.remove();
	
		$('#exampleModal').modal('toggle');
	}	
})

$('.modal-body').on('click', '.EditButtonAktivnostDelete', function()
{
	var AktivnostKey = $(this).attr('id').split('_')[1];
	var oAkitvnostRef = oDb.ref('Aktivnosti/' + AktivnostKey);
	oAkitvnostRef.remove();

	ModalData($('#exampleModal').attr('aria-labelledby'), AktivnostKey, false);
})

$(document).on('click', '#Dodaj10dana', function()
{
	$('#rok').val(parseInt($('#rok').val()) + 10);

	var DatumRok = moment($('#date').val(), 'DD/MM/YYYY');

	DatumRok.add(10, 'days');
	DatumRok = DatumRok.format('DD/MM/YYYY');
	
	$('#date').val(DatumRok);

	PromjenaInputaRok();
})

$(document).on('click', '#Dodaj30dana', function()
{
	$('#rok').val(parseInt($('#rok').val()) + 30);

	var AktivnostId = $('#EditAktivnostiModal').attr('aria-labelledby').split('_')[2];
	var DatumRok = moment($('#date').val(), 'DD/MM/YYYY');

	DatumRok.add(30, 'days');
	DatumRok = DatumRok.format('DD/MM/YYYY');
	
	$('#date').val(DatumRok);

	PromjenaInputaRok();
})

$('#Dodaj10dana2').click(function()
{
	$('#rokAdd').val(parseInt($('#rokAdd').val()) + 10);

	var DatumRok = moment($('#dateAdd').val(), 'DD/MM/YYYY');

	DatumRok.add(10, 'days');
	DatumRok = DatumRok.format('DD/MM/YYYY');
	
	var DatumKreiranja = moment($('#dateAddVK').val(), 'DD/MM/YYYY');
	DatumKreiranja.add(1, 'days');
	DatumKreiranja = DatumKreiranja.format('DD/MM/YYYY')
	$('#dateAdd').val(DatumRok);
	$('#NemamIdejeDatum').remove();
	$('#DatumPotvrdi').after(`<div class="input-group date mb-3" id="NemamIdejeDatum" data-date-start-date="${DatumKreiranja}">
		<span class="input-group-text">DATUM ROK</span> 
		<input class="form-control" id="dateAdd" data-date-format="dd/mm/yyyy" name="date" type="text" value="${DatumRok}"/>
		<div class="input-group-addon textarea-addon" data-date-format="dd/mm/yyyy">
		  <span><i class="far fa-calendar-alt iEditButton"></i></span>
		</div>
		</div>`);
	InicijalizirajDateTime(); 

	var DaniRok = $('#rokAdd').val();
	if(DaniRok.toString()[DaniRok.toString().length - 1] == '1' && DaniRok !='11')
	{
		$('#rokStringAdd').attr('value', 'dan');
	}
	else
	{
		$('#rokStringAdd').attr('value', 'dana');
	}
})

$('#Dodaj30dana2').click(function()
{
	$('#rokAdd').val(parseInt($('#rokAdd').val()) + 30);

	var DatumRok = moment($('#dateAdd').val(), 'DD/MM/YYYY');

	DatumRok.add(30, 'days');
	DatumRok = DatumRok.format('DD/MM/YYYY');
	
	var DatumKreiranja = moment($('#dateAddVK').val(), 'DD/MM/YYYY');
	DatumKreiranja.add(1, 'days');
	DatumKreiranja = DatumKreiranja.format('DD/MM/YYYY')
	$('#dateAdd').val(DatumRok);
	$('#NemamIdejeDatum').remove();
	$('#DatumPotvrdi').after(`<div class="input-group date mb-3" id="NemamIdejeDatum" data-date-start-date="${DatumKreiranja}">
		<span class="input-group-text">DATUM ROK</span> 
		<input class="form-control" id="dateAdd" data-date-format="dd/mm/yyyy" name="date" type="text" value="${DatumRok}"/>
		<div class="input-group-addon textarea-addon" data-date-format="dd/mm/yyyy">
		  <span><i class="far fa-calendar-alt iEditButton"></i></span>
		</div>
		</div>`);
	InicijalizirajDateTime(); 

	var DaniRok = $('#rokAdd').val();
	if(DaniRok.toString()[DaniRok.toString().length - 1] == '1' && DaniRok !='11')
	{
		$('#rokStringAdd').attr('value', 'dan');
	}
	else
	{
		$('#rokStringAdd').attr('value', 'dana');
	}
})

function PromjenaInputaDatumAdd()
{	
	console.log('pozvana');
	var DatumKreiranja = moment($('#dateAddVK').val(), 'DD/MM/YYYY');
	var DatumRok = moment($('#dateAdd').val(), 'DD/MM/YYYY');

	if(DatumRok.isValid() == true && DatumRok > DatumKreiranja)
	{		
		var Razlika = RazlikaDatuma(DatumRok, DatumKreiranja);
		$('#rokAdd').val(Razlika);

		if(Razlika.toString()[Razlika.toString().length - 1] == '1' && Razlika !='11')
		{
			$('#rokStringAdd').attr('value', 'dan');
		}
		else
		{
			$('#rokStringAdd').attr('value', 'dana');
		}
	}
} 

function PromjenaInputaRokAdd()
{
	var DatumRok = moment($('#dateAddVK').val(), 'DD/MM/YYYY');
	var DaniRok = $('#rokAdd').val();

	if($('#rokAdd').val() > 0)
	{
		DatumRok.add(DaniRok, 'days');
		DatumRok = DatumRok.format('DD/MM/YYYY');
		$('#dateAdd').val(DatumRok);

		if(DaniRok.toString()[DaniRok.toString().length - 1] == '1' && DaniRok !='11')
		{
			$('#rokStringAdd').attr('value', 'dan');
		}
		else
		{
			$('#rokStringAdd').attr('value', 'dana');
		}
	}
	else
	{
		$('#rokAdd').val('1');
		DatumRok.add(1, 'days');
		DatumRok = DatumRok.format('DD/MM/YYYY');
		$('#dateAdd').val(DatumRok);
	}

	$('.date').datepicker('update', $('#dateAdd').val()); 
}

$('#AddButtonAktivnosti').click(function()
{
	$('#DodajAktivnostNaslov').val('');
	$('#DodajAktivnostOpis').val('');
	$('#dateAddVK').val(moment().format('DD/MM/YYYY'));
	$('#dateAdd').val('');
	$('#rokAdd').val('');

	$('#DodajAktivnostNaslov').css('border-color', '#ced4da');
	$('#DodajAktivnostOpis').css('border-color', '#ced4da');
	$('#dateAdd').css('border-color', '#ced4da');
	$('#rokAdd').css('border-color', '#ced4da');

	$('#DodajAktivnostNaslov').attr('placeholder', '');
	$('#DodajAktivnostOpis').attr('placeholder', '');
	$('#dateAdd').attr('placeholder', '');
	$('#rokAdd').attr('placeholder', '');
	

	$(document).on('input', '#dateAdd', function () { 

		PromjenaInputaDatumAdd();
	});

	$(document).on('input', '#rokAdd', function () { 

		var DatumRok = moment($('#dateAddVK').val(), 'DD/MM/YYYY');

		DatumRok.add($('#rokAdd').val(), 'days');
		DatumRok = DatumRok.format('DD/MM/YYYY');
		
		var DatumKreiranja = moment($('#dateAddVK').val(), 'DD/MM/YYYY');
		DatumKreiranja.add(1, 'days');
		DatumKreiranja = DatumKreiranja.format('DD/MM/YYYY')
		$('#dateAdd').val(DatumRok);
		$('#NemamIdejeDatum').remove();
		
		$('#DatumPotvrdi').after(`<div class="input-group date mb-3" id="NemamIdejeDatum" data-date-start-date="${DatumKreiranja}">
			<span class="input-group-text">DATUM ROK</span> 
			<input class="form-control" id="dateAdd" data-date-format="dd/mm/yyyy" name="date" type="text" value="${DatumRok}"/>
			<div class="input-group-addon textarea-addon" data-date-format="dd/mm/yyyy">
			<span><i class="far fa-calendar-alt iEditButton"></i></span>
			</div>
			</div>`);
		InicijalizirajDateTime(); 

		var DaniRok = $('#rokAdd').val();
		if(DaniRok.toString()[DaniRok.toString().length - 1] == '1' && DaniRok !='11')
		{
			$('#rokStringAdd').attr('value', 'dan');
		}
		else
		{
			$('#rokStringAdd').attr('value', 'dana');
		}
		});
	
	var DarkOrWhite = $('body').css('background-color');
	DarkOrWhite = DarkOrWhite.split(')')[0];
	DarkOrWhite += '.7)';
	$('#DatumPotvrdi').after('<div id="CoverRok" style="background-color: '+ DarkOrWhite +'"></div>');
	InicijalizirajDateTime();
})

$('#DatumPotvrdi').click(function(){
	var DatumKreiranja = moment($('#dateAddVK').val(), 'DD/MM/YYYY');
	if(DatumKreiranja.isValid() != true)
	{
		ProvjeraUnosa($('#dateAddVK'), 'Unesite datum!');
	}
	else
	{
		var DarkOrWhite = $('body').css('background-color');
		DarkOrWhite = DarkOrWhite.split(')')[0];
		DarkOrWhite += '.7)';

		$('#dateAddVK').css('border-color', '#ced4da');
		$('#CoverRok').remove();
		$('#DodajAktivnostOpis').after('<div id="CoverKreiranje" style="background-color: '+ DarkOrWhite +'"></div>');

		DatumKreiranja.add(1, 'days');
		DatumKreiranja = DatumKreiranja.format('DD/MM/YYYY');

		$('#NemamIdejeDatum').remove();
		$('#DatumPotvrdi').after(`<div class="input-group date mb-3" id="NemamIdejeDatum" data-date-start-date="${DatumKreiranja}">
		<span class="input-group-text">DATUM ROK</span> 
		<input class="form-control" id="dateAdd" data-date-format="dd/mm/yyyy" name="date" type="text" value="${DatumKreiranja}"/>
		<div class="input-group-addon textarea-addon" data-date-format="dd/mm/yyyy">
		  <span><i class="far fa-calendar-alt iEditButton"></i></span>
		</div>
		</div>`);
		$('#rokAdd').val(1);
		InicijalizirajDateTime();
	}
})

$(document).on('input', '#EditVrijednost', function () { 

	if($('#EditVrijednost').val() < 1)
	{
		$('#EditVrijednost').val(1);
	}
	$('#EditVrijednost').val(Math.floor($('#EditVrijednost').val()))
});
$(document).on('input', '#DodajProjektVrijednost', function () { 

	if($('#DodajProjektVrijednost').val() < 1)
	{
		$('#DodajProjektVrijednost').val(1);
	}
	$('#DodajProjektVrijednost').val(Math.floor($('#DodajProjektVrijednost').val()))
});
$(document).on('input', '#rokAdd', function () { 

	if($('#rokAdd').val() < 1)
	{
		$('#rokAdd').val(1);
	}
	$('#rokAdd').val(Math.floor($('#rokAdd').val()))
});
$(document).on('input', '#rok', function () { 

	if($('#rok').val() < 1)
	{
		$('#rok').val(1);
	}
	$('#rok').val(Math.floor($('#rok').val()))
});

$('#ButtonDodajAktivnost').click(function()
{
	var PoljaPopunjena = true;

	if($('#DodajAktivnostNaslov').val() == '')
	{
		PoljaPopunjena = ProvjeraUnosa($('#DodajAktivnostNaslov'), 'Unesite naslov!');
	}
	if($('#DodajAktivnostOpis').val() == '')
	{
		PoljaPopunjena = ProvjeraUnosa($('#DodajAktivnostOpis'), 'Unesite opis!');
	}
	if($('#dateAdd').val() == '')
	{
		PoljaPopunjena = ProvjeraUnosa($('#dateAdd'), 'Unesite datum roka');
	}
	if($('#rokAdd').val() == '')
	{
		PoljaPopunjena = ProvjeraUnosa($('#rokAdd'), 'Unesite rok!');
	}

	if(PoljaPopunjena == true)
	{
		var sKey = firebase.database().ref().child('Aktivnosti').push().key;

		var oAktivnost = 
    	{
		naziv: $('#DodajAktivnostNaslov').val(),
        opis: $('#DodajAktivnostOpis').val(),
		vrijeme_kreiranja: $('#dateAddVK').val(),
		datum_rok: $('#dateAdd').val(),
		rok: $('#rokAdd').val(),
		status: $('#DodajAktivnostStatus').val(),
		projekt_id: $('#exampleModal').attr('aria-labelledby')
		};
		
		// Zapiši u Firebase
		var oZapis = {};
		oZapis[sKey] = oAktivnost;
		oDbAktivnosti.update(oZapis);	

		// Povećaj broj aktivnosti projekta
		var oProjektRef = oDb.ref('Projekti/' + $('#exampleModal').attr('aria-labelledby'));
		var oProjekt = 
		{
			'aktivnosti': parseInt($('#ModalBrojAktivnosti').text()) + 1
		};
		oProjektRef.update(oProjekt);


		ModalData($('#exampleModal').attr('aria-labelledby'), null, false);
		$('#DodajAktivnostModal').modal('toggle');

		ObrisiNedavno();
	}
})

$('#MenuButtonGroup').change(function(){
	
	SearchAndSort();

})

$(document).on('click', '#ButtonDodajProjektX', function()
{
	$('#DodajProjektTip').val('Društveni');
})

$(document).on('click', '#ButtonDodajProjektY', function()
{
	$('#DodajProjektTip').val('Infrastrukturni');
})

$(document).on('click', '#ButtonDodajProjektZ', function()
{
	$('#DodajProjektTip').val('Kulturni');
})

$('#ButtonDodajProjektModal').click(function(){
	$('#DodajProjektTip').val('Društveni');
})

$('#ButtonDodajProjekt').click(function()
{
	var PoljaPopunjena = true;
	$('#DodajProjektVrijednost').val($('#DodajProjektVrijednost').val().trim());

	$('#DodajProjektNaslov').val($('#DodajProjektNaslov').val().trim());
	if($('#DodajProjektNaslov').val() == '')
	{
		PoljaPopunjena = ProvjeraUnosa($('#DodajProjektNaslov'), 'Unesite naslov!');
	}

	$('#DodajProjektOpis').val($('#DodajProjektOpis').val().trim());
	if($('#DodajProjektOpis').val() == '')
	{
		PoljaPopunjena = ProvjeraUnosa($('#DodajProjektOpis'), 'Unesite opis!');
	}

	$('#DodajProjektVoditeljIme').val($('#DodajProjektVoditeljIme').val().trim());
	if($('#DodajProjektVoditeljIme').val() == '')
	{
		PoljaPopunjena = ProvjeraUnosa($('#DodajProjektVoditeljIme'), 'Unesite ime!');
	}

	$('#DodajProjektVoditeljPrezime').val($('#DodajProjektVoditeljPrezime').val().trim());
	if($('#DodajProjektVoditeljPrezime').val() == '')
	{
		PoljaPopunjena = ProvjeraUnosa($('#DodajProjektVoditeljPrezime'), 'Unesite prezime!');
	}	

	console.log($('#DodajProjektVrijednost').val());
	if(PoljaPopunjena == true)
	{
		var sKey = firebase.database().ref().child('Projekti').push().key;

		var oProjekt = 
    	{
		naziv: $('#DodajProjektNaslov').val(),
        opis: $('#DodajProjektOpis').val(),
		voditelj_ime: $('#DodajProjektVoditeljIme').val(),
		voditelj_prezime: $('#DodajProjektVoditeljPrezime').val(),
		status: $('#DodajProjektStatus').val(),
		vrijednost: $('#DodajProjektVrijednost').val() + ' ' + $('#DodajProjektVrijednostValuta').val(),
		tip: $('#DodajProjektTip').val(),
		korisnik: firebase.auth().currentUser.uid,
		aktivnosti: 0
		};
		
		// Zapiši u Firebase
		var oZapis = {};
		oZapis[sKey] = oProjekt;
		oDbProjekti.update(oZapis);	

		$('#DodajProjektModal').modal('toggle');
	}
})

$('#DodajProjektModal').on('hidden.bs.modal', function () 
{
	$('#DodajProjektNaslov').val('');
	$('#DodajProjektOpis').val('');
	$('#DodajProjektVoditeljIme').val('');
	$('#DodajProjektVoditeljPrezime').val('');
	$('#DodajProjektStatus').val('U pripremi');
	$('#DodajProjektVrijednost').val(1);
	$('#DodajProjektVrijednostValuta').val('$');
	$('#DodajProjektTip').val('Društveni');

	$('#DodajProjektNaslov').css('border-color', '#CED4DA');
	$('#DodajProjektOpis').css('border-color', '#CED4DA');
	$('#DodajProjektVoditeljIme').css('border-color', '#CED4DA');
	$('#DodajProjektVoditeljPrezime').css('border-color', '#CED4DA');
	$('#DodajProjektVrijednost').css('border-color', '#CED4DA');

	$('#DodajProjektNaslov').attr('placeholder', '');
	$('#DodajProjektOpis').attr('placeholder', '');
	$('#DodajProjektVoditeljIme').attr('placeholder', '');
	$('#DodajProjektVoditeljPrezime').attr('placeholder', '');
	$('#DodajProjektVrijednost').attr('placeholder', '');

})

$('#DodajAktivnostModal').on('hidden.bs.modal', function () 
{
	$('#CoverRok').remove();
	$('#CoverKreiranje').remove();
})

$(window).focus(function()
{
	if($('#UserPhoto').attr('src') != firebase.auth().currentUser.photoURL || $('#testBtn').text() != firebase.auth().currentUser.displayName)
	{
		$('#testBtn').html(`<img src="${firebase.auth().currentUser.photoURL}" alt="Avatar" id="UserPhoto">${firebase.auth().currentUser.displayName}`);
	}
});

function RandomNumber(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

$('#EditSvojstvaModal').on('shown.bs.modal', function() {
	$('#exampleModal').removeClass('unblur'); 
	$('#exampleModal').addClass('blur');
})

$('#EditSvojstvaModal').on('hide.bs.modal', function() { 
	$('#exampleModal').removeClass('blur'); 
	$('#exampleModal').addClass('unblur');
})