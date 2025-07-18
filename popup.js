// chrome.browserAction.onClicked.addListener(jiraPopup);
const kMillisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
const kOneWeekAgo = (new Date).getTime() - kMillisecondsPerWeek;
const kFourWeekAgo = (new Date).getTime() - (kMillisecondsPerWeek * 4) ;

var jira_info = document.getElementById('jira_info');
var form_error = document.getElementById('form_error');
var options_link = document.getElementById('go-to-options');
var open_btn = document.getElementById('open_btn');
var issue_input = document.getElementById('issue_id');
var setup_instruction = document.getElementById('setup_instruction');
var issue_form = document.getElementById('issue_form');
var recent_issues = document.getElementById('recent_issues');
var issue_separator = '--##--';
var jira_url, project_key, recent_count;

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


chrome.storage.sync.get(['recent_count'], function(items) {
    recent_count = items.recent_count;
    chrome.history.search({text: 'atlassian.net', startTime: kFourWeekAgo, maxResults: (Number(recent_count) || 10)}, function(items) {
        if (items.length > 1) { 
            recent_issues.style.display = "block"; 
        }

        for (var i = 0; i < items.length; i++) {
            var link_title = items[i].url + "\nVisit count: " + items[i].visitCount + "\nLast Visit: " + (new Date(items[i].lastVisitTime)).toLocaleString();
            recent_issues.innerHTML += "<p>\
                                        <a title='" + link_title + "' target='_blank' href='" + items[i].url + "' style='text-decoration: none; color: #4a8efb; font-size: small;'>\
                                        " + items[i].title.split(' - Jira')[0] + "\
                                        </a>\
                                      </p>";
        }
    });
});







chrome.storage.sync.get(['project_key', 'jira_url'], function(items) {
    jira_url = items.jira_url;
    project_key = items.project_key;

    if (jira_url && project_key) {
        jira_info.innerHTML = "<a href='" + jira_url + "' style='color: blue;'>" + jira_url + "</a>" + "<br><br>Please enter the issue ID (" + project_key + "-43) or 43:";

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
    } else {
        form_error.style.display = 'inline';
    }
    return false;
}

function openIssueInJira(selection) {
    selection = selection.toString();

    // if it is a url then open the url as it is
    if (selection.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
        chrome.tabs.create({
            url: selection
        });
        return;
    }

    selection = selection.replace(/\s+/g, '-').toLowerCase();

    chrome.storage.sync.get(['project_key', 'jira_url'], function(items) {
        if (items.jira_url && items.project_key) {
            var url;

            if (selection.match(/^\d+$/g)) {
                // if numeric value is selected then open in default project
                url = items.jira_url + "/browse/" + items.project_key + '-' + selection;
            } else if (selection.match(/^[A-Za-z]+-[0-9]+$/g)) {
                // if selection matches with string-number
                url = items.jira_url + "/browse/" + selection;
            } else {
                alert("Invalid Issue ID. \n\nSelection should be like 'key-123'.");
                return false;
            }

            chrome.tabs.create({
                url: url
            });
        } else {
            // If options were not set then show alert.
            alert("Please set Jira URL and default project key from extension options section.");
            chrome.runtime.openOptionsPage();
        }
    });
}

