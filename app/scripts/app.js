$(function() {
	var sortkey = 'name';
	var isReverseSort = false;

	Handlebars.registerHelper('sortedEach', function(context, options) {
		var output = '';
		var contextSorted = context.sort(function(a, b) {
			var x = a[sortkey],
				y = b[sortkey];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
		if (isReverseSort) {
			contextSorted.reverse();
		}
		for (i = 0, len = contextSorted.length; i < len; ++i) {
			contextSorted[i].index = i;
			output += options.fn(contextSorted[i]);
		}
		return output;
	});

	// Compiling template
	var template = $('#cardsListTemplate').html();
	var handlebar = Handlebars.compile(template);

	var cardsListContent = $('#cardsList');
	var githubUser = $('#githubUser');
	var sortByNameCaret = $('#sortByNameCaret');
	var sortByLocationCaret = $('#sortByLocationCaret');
	var sortByFollowersCaret = $('#sortByFollowersCaret');
	var cardsList = [];
	// Start
	successCallback({
		'avatar_url': 'https://avatars.githubusercontent.com/u/4524705?v=3',
		'html_url': 'https://github.com/gvp-hemanthreddy',
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
			'html_url': data.html_url,
			'name': data.name,
			'location': data.location,
			'followers': data.followers
		});
		updateView();
		githubUser.val('');
	}

	function errorCallback(xhr, statusText) {
		$('#errorMessage').show();
	}

	function getUserData(userName) {
		$.ajax({
			url: 'https://api.github.com/users/' + userName,
			success: successCallback,
			error: errorCallback
		});
	}


	$("#githubUser").bind("keypress", {}, keypressInBox);

	function keypressInBox(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		//Enter keycode
		if (code == 13) {
			e.preventDefault();
			$("#addCard").click();
		}
	};

	$('#addCard').click(function() {
		var inputText = githubUser.val();
		if (inputText) {
			getUserData(inputText);
			$('#errorMessage').hide();
		}
	});

	deleteUser = function(index) {
		if (index > -1) {
			cardsList.splice(index, 1);
			updateView();
		}
	};

	function getSortKeyName(type) {
		switch (type) {
			case 1:
				return 'name';
			case 2:
				return 'location';
			case 3:
				return 'followers';
		}
	}

	function removeAllSortKeysClasses() {
		sortByNameCaret.removeClass();
		sortByLocationCaret.removeClass();
		sortByFollowersCaret.removeClass();
	}

	// Add caret or caret-reversed class.
	function addCaretClass(sortKey) {
		var className = isReverseSort ? 'caret' : 'caret-reversed';
		if (sortKey === 'name') {
			sortByNameCaret.addClass(className);
		} else if (sortKey === 'location') {
			sortByLocationCaret.addClass(className);
		} else {
			sortByFollowersCaret.addClass(className);
		}
	}

	sortBy = function(type) {
		var newSortKey = getSortKeyName(type);
		removeAllSortKeysClasses();
		if (newSortKey !== sortkey) {
			isReverseSort = false;
			sortkey = newSortKey;
		} else {
			isReverseSort = !isReverseSort;
		}
		addCaretClass(newSortKey);
		updateView();
	};
});