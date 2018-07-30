// chrome.browserAction.onClicked.addListener(jiraPopup);

var jira_info         = document.getElementById('jira_info');
var form_error        = document.getElementById('form_error');
var options_link      = document.getElementById('go-to-options');
var open_btn          = document.getElementById('open_btn');
var issue_input       = document.getElementById('issue_id');
var setup_instruction = document.getElementById('setup_instruction');
var issue_form        = document.getElementById('issue_form');
var recent_issues     = document.getElementById('recent_issues');
var issue_seperator ='--##--';
var jira_url, project_key;
// handle open button click
open_btn.onclick = openIssue;

// handle enter key press on the issue input field
issue_input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    openIssue()
  }
});


options_link.addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});


chrome.storage.sync.get({"issue_history": []}, function(items) {
  var issues = items.issue_history;

  if (issues.length > 0 ) {
    recent_issues.style.display = "block";

    for (var i = issues.length - 1; i >= 0; i--) {
      var a = issues[i].split(issue_seperator);
      var issue_title = a[0];
      var issue_url = a[1];

      recent_issues.innerHTML += "<p><a title='"+issue_title + ' - ' + issue_url +"' target = '_blank' href = '"+issue_url+"' style = 'text-decoration: none; color: #4a8efb; font-size: small;'>" + issue_title + "</a></p>"
    }
  }
});



chrome.storage.sync.get(['project_key', 'jira_url'], function(items) {
    jira_url = items.jira_url;
    project_key = items.project_key;


    if (jira_url && project_key) {

        jira_info.innerHTML = "<a href = '"+ jira_url + "' style = 'color: blue;'>"+ jira_url + "</a>" + "<br> <br>Please enter the issue id (" + project_key + "-43) or 43:"

        issue_form.style.display = 'block';
        setup_instruction.style.display = 'none';
        issue_input.focus();

    } else {
        issue_form.style.display = 'none';
        setup_instruction.style.display = 'block';
    }
});


function openIssue() {
    var issue_id = issue_input.value;

    if (issue_id) {
        form_error.style.display = 'none';
        openIssueInJira(issue_id);

    }else{
        form_error.style.display = 'inline'
    }
    return false;
}

