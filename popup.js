// chrome.browserAction.onClicked.addListener(jiraPopup);

var jira_info         = document.getElementById('jira_info');
var form_error        = document.getElementById('form_error');
var options_link      = document.getElementById('go-to-options');
var open_btn          = document.getElementById('open_btn');
var issue_input       = document.getElementById('issue_id');
var setup_instruction = document.getElementById('setup_instruction');
var issue_form        = document.getElementById('issue_form');
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

