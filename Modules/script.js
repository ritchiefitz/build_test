$( document ).ready(function() {

	groupRadioButtons();

	$("#testTake").click(function() {
		var value = $(this).attr("value");

		if (value == 'Take Test'){
			$(this).attr("value", "Grade");
			$("tr img").css("display", "none");
			$(".question-image").attr("src", "../Images/check.png");
			$(".examAnswerTable tr img[src*=delete]").remove();
			$(".radio").removeAttr("disabled").removeAttr("checked");
			shuffleQuestions();
		}
		else {
			$(this).attr("value", "Take Test");
			checkAnswers();
			scrollErrors();
			$("tr img").css("display", "inline-block");
			$(".radio").attr("disabled", "disabled");
		}
	});

	$(".examAnswerTable img[src*=check]").each(function () {
		$(this).closest("tr").find(".radio").attr("checked", "checked").attr("value", "answer");
	});

	$(".grade .close").click(function () {
		$(".grade").css("display", "none");
		location.reload();
	});

	$("[id*=chapt]").each(function () {
		var id = "#" + $(this).attr("id");
		var name = $(this).text();

		$("[name*=mySelect]").append("<option value=" + id + ">" + name + "</option>");
	});

	numberQuestions();
	stickyChapters();
});

function numberQuestions() {
	$(".chapter-questions").each(function () {
		$("b", this).html(function (index) {
			return (index + 1) + ".&nbsp;";
		});
	});
}

function stickyChapters() {
	// Save information for each chapter heading into a map into array.
	var allChapters = []
	$('[id*=chapt]').each(function () {
		var eachChapter = {}
		eachChapter["scroll"] = $(this).offset().top;
		eachChapter["element"] = $(this);
		
		allChapters.push(eachChapter);
	});

	// Start the first chapter as sticky.
	allChapters[0]["element"].addClass("sticky");

	// Use this to execute checkSticky smoothly.
	// Not choppy.
	var timer;
    $(window).bind('scroll',function () {
        clearTimeout(timer);
        timer = setTimeout(checkSticky, 10);
    });

    // Make the highest indexed chapter heading sticky.
	var checkSticky = function() {

		// get current scroll position.
    	var currentScroll = $(window).scrollTop() + $("header").outerHeight();

    	// check all chapters to see which one should be sticky.
    	for (var i = allChapters.length - 1; i >= 0; i--) {
    		if (allChapters[i].scroll < currentScroll) {
    			// make header sticky.
				allChapters[i]["element"].addClass("sticky");

				// remove the sticky class from the rest.
				for (var j = 0; j < allChapters.length; j++) {
					if (j != i) {
						allChapters[j]["element"].removeClass("sticky");
					}
				}

				// This makes sure we break on the highest scolled chapter.
				// Also makes the program a little faster :)
				break;
			}
    	}

	};
}

// show red error line on right like google find.
function scrollErrors() {
	var errors = []
	$(".examQuestionTable > tbody > tr:first-child > td:first-child img[src*=delete]").each(function (){
		error = {};
		error["scroll"] = $(this).closest(".examQuestionTable").offset().top;
		error["element"] = $(this).closest(".examQuestionTable");

		errors.push(error);
		// console.log($(this));
		console.log(error["scroll"]);
	});

	var windowHeight = $(window).height();   // returns height of browser viewport

	var documentHeight = $(document).height(); // returns height of HTML document

	for (i in errors) {
		var heightPer = errors[i].scroll / documentHeight;
		$("body").append("<div class='error" + i + "'></div>");
		$(".error"+ i).css("top", (heightPer * windowHeight) + "px");
	}

	console.log(windowHeight);
	console.log(documentHeight);
}

function shuffleQuestions() {
	// Shuffle Questions
	$(".chapter-questions").each(function () {
		var questionArray = [];
		var $questions = $(this).find(".examQuestionTable");

		$questions.each(function () {
			var questionInfo = {};

			// assign random value that won't equal another number.
			questionInfo["number"] = Math.floor(Math.random() * 100000) + 1;
			questionInfo["element"] = this;         // save table row.
			questionArray.push(questionInfo);

			// remove element from DOM to be readded later.
			this.remove();
		});

		questionArray.sort(function (a,b) { return a.number > b.number});

		for (i in questionArray) {
			$(this).append(questionArray[i].element);
		}
	});

	// Shuffle Answers
	$(".examAnswerTable").each(function () {
		var choiceArray = [];
		var $trs = $(this).find("tbody > tr");
		$trs.each(function () {
			var choiceInfo = {};

			// assign random value that won't equal another number.
			choiceInfo["number"] = Math.floor(Math.random() * 100000) + 1;
			choiceInfo["element"] = this;         // save table row.
			choiceArray.push(choiceInfo);

			// remove element from DOM to be readded later.
			this.remove();
		});

		choiceArray.sort(function (a,b) { return a.number > b.number});

		for (i in choiceArray) {
			$(this).find("tbody").append(choiceArray[i].element);
		}
	});

	numberQuestions();
}

function groupRadioButtons() {
	var i = 1;
	$(".examAnswerTable").each(function() {
		$(".radio", this).attr("name", "question-"+i);
		i++;
	});
}

function checkAnswers() {
	var correct = 0;
	var total = $(".radio:checked").length;

	$(".radio:checked").each(function () {
		if ($(this).attr("value") != "answer") {
			$(this).parent().prev().append("<img src='../Images/delete.png' />");
			$(this).closest(".examQuestionTable").find(".question-image").attr("src", "../Images/delete.png");
		}
		else {
			correct++;
		}
	});

	$(".grade").css("display", "block");
	$(".correct").text(correct);
	$(".total").text(total);
	$(".answer").text(((correct/total) * 100).toFixed(0));
}

function gotoPage(){
  var list = document.myForm.mySelect;
  location.href = list.options[list.selectedIndex].value;
  $(window).scrollTop($(window).scrollTop() - 47);
}