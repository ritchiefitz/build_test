$( document ).ready(function() {

	groupRadioButtons();

	$("#testTake").click(function() {
		var value = $(this).attr("value");
		console.log(value);

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
		console.log(id);
		var name = $(this).text();
		console.log(name);

		$("[name*=mySelect]").append("<option value=" + id + ">" + name + "</option>");
	});

	$(".chapter-questions").each(function () {
		$("b", this).html(function (index) {
			return (index + 1) + ".&nbsp;";
		});
	});

	stickyChapters();
});

function stickyChapters() {
	var allChapters = []
	$('[id*=chapt]').each(function () {
		var eachChapter = {}
		eachChapter["id"] = $(this).attr("id");
		eachChapter["scroll"] = $(this).offset().top;
		eachChapter["change"] = false;
		eachChapter["element"] = $(this);
		
		allChapters.push(eachChapter);
	});

	allChapters[0]["element"].addClass("sticky");

	var timer;
    $(window).bind('scroll',function () {
        clearTimeout(timer);
        timer = setTimeout(checkSticky, 10);
    });

	var checkSticky = function() {                  // assign scroll event listener

    	var currentScroll = $(window).scrollTop(); // get current position

    	for (var i = allChapters.length - 1; i >= 0; i--) {
    		if (allChapters[i].scroll < currentScroll) {
				allChapters[i]["element"].addClass("sticky");

				for (var j = 0; j < i; j++) {
					allChapters[j]["element"].removeClass("sticky");
				}

				for (var k = i+1; k < allChapters.length; k++) {
					allChapters[k]["element"].removeClass("sticky");
				}

				break;
			}
    	}

	};
}

function shuffleQuestions() {
	$(".examAnswerTable").each(function () {
		var questionArray = [];
		var $trs = $(this).find("tbody > tr");
		$trs.each(function () {
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
			$(this).find("tbody").append(questionArray[i].element);
		}
	});
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

	console.log(correct);
	console.log(correct/total);
}

function gotoPage(){
  var list = document.myForm.mySelect;
  location.href = list.options[list.selectedIndex].value;
  $(window).scrollTop($(window).scrollTop() - 47);
}