$(function() {
	// Compiling template
	var template = $('#cardsListTemplate').html();
	var handlebar = Handlebars.compile(template);

	var cardsListContent = $('#cardsList');
	var githubUser = $('#githubUser');
	var cardsList = [];
	// Start
	successCallback({
		'avatar_url': 'https://avatars.githubusercontent.com/u/4524705?v=3',
		'name': 'Hemanth Reddy',
		'location': 'India',
		'followers': 123
	});
	//End

	function updateView() {
		cardsListContent.html(handlebar(cardsList));
	}

	function successCallback(data) {
		cardsList.push({
			'avatar_url': data.avatar_url,
			'name': data.name,
			'location': data.location,
			'followers': data.followers
		});
		updateView();
		githubUser.val('');
	}

	function errorCallback(xhr, statusText) {
		alert('Error occured.');
	}

	function getUserData(userName) {
		$.ajax({
			url: 'https://api.github.com/users/' + userName,
			success: successCallback,
			error: errorCallback
		});
	}

	$('#addCard').click(function() {
		var inputText = githubUser.val();
		if (inputText) {
			getUserData(inputText);
		}
	});

	deleteUser = function(index) {
		cardsList.splice(index, 1);
		updateView();
	};
});