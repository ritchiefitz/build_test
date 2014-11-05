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
});

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