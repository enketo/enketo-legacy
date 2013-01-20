$(document).ready(function(){
	var connection = new Connection();
	$('.url-helper')
		.click(function(){
			var placeholder;
			$(this).parent().addClass('active').siblings().removeClass('active');
			$('#url-helper-selected').attr('data-value', $(this).attr('data-value')).text($(this).text());
			placeholder = ($(this).attr('data-value') === 'formhub') ? 'e.g. martijnr' : 'e.g. formhub.org/formhub_u';
			$('#launch input').attr('placeholder', placeholder);
		})
		.addBack().find('[data-value="https"]').click();

	$('#launch input').change(goToLaunch);

	function goToLaunch(){
		var val = $('#launch input').val(),
			type = $('#url-helper-selected').attr('data-value'),
			server_url = ( type === 'formhub' ) ? 'https://formhub.org/'+val : type+'://'+val;

		//TODO add isValidUrl() check	
		location.href = '/formtester?server='+server_url;
		return false;
	}

	$('.features li a').on('click', function(){
		var feature = $(this).parent().attr('id'),
			$featureDetail = $('.features-detail .'+feature);
		$(this).toggleClass('active').parent().siblings().find('a').removeClass('active');
		$featureDetail.toggleClass('show').siblings().removeClass('show');
		return false;
	});

	connection.getNumberFormsLaunched({
		success: function(resp){
			if (typeof resp === 'object' && resp.total && resp.total > 0){
				$('.form-count .counter').text(resp.total).parent().show(500);
			}
		}
	});
});