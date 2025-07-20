// Constants for time calculations
const kMillisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
const kOneWeekAgo = (new Date).getTime() - kMillisecondsPerWeek;
const kFourWeekAgo = (new Date).getTime() - (kMillisecondsPerWeek * 4);

// Command listeners
chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);

    if (command === "open-in-jira-popup") {
        jiraPopup();
    }

    if (command === "open-in-jira") {
        // Get the active tab and then open in Jira
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                openInJira(null, tabs[0]);
            }
        });
    }
});

// Omnibox input entered listener
chrome.omnibox.onInputEntered.addListener(function(input) {
    if (input) {
        openIssueInJira(input, true);
    }
});

// Omnibox input changed listener
chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
        var query = "atlassian.net " + text;
        chrome.history.search({text: query, startTime: kFourWeekAgo}, function(items) {
            var suggestions = [];
            for (var i = items.length - 1; i >= 0; i--) {
                suggestions.push({content: items[i].url, description: items[i].title});
            }
            suggest(suggestions);
        });
    }
);

// Context menu creation
var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Open in Jira '%s'";

    var id = chrome.contextMenus.create({
        "id": "open-in-jira-context",
        "title": title,
        "contexts": [context]
    });
    console.log("'" + context + "' item:" + id);
}

// Context menu click handler
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "open-in-jira-context") {
        openInJira(info, tab);
    }
});

// Jira popup function
function jiraPopup(tab) {
    var jira_url, project_key;

    chrome.storage.sync.get(['project_key', 'jira_url'], function(items) {
        jira_url = items.jira_url;
        project_key = items.project_key;

        if (jira_url && project_key) {
            var issue_id = prompt(jira_url + "\n\nPlease enter the issue id (" + project_key + "-43) or 43:");
            if (issue_id) {
                openIssueInJira(issue_id);
            }
        } else {
            alert("Please set Jira URL and default project key from extension options section.");
            chrome.runtime.openOptionsPage();
        }
    });
}

// Open in Jira function
function openInJira(info, tab) {
    executeScriptAndOpenJira(tab);
}

// Helper function to execute script and open Jira
function executeScriptAndOpenJira(tab) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
    }, function(results) {
        if (results && results[0] && results[0].result) {
            openIssueInJira(results[0].result);
        } else {
            // If no text is selected, show the popup
            jiraPopup();
        }
    });
}

// Open issue in Jira function
function openIssueInJira(selection, current_tab) {
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

            // if current_tab is true then open issue in current tab else open in new tab.
            if (current_tab) {
                chrome.tabs.update({
                    url: url
                });
            } else {
                chrome.tabs.create({
                    url: url
                });
            }
        } else {
            // If options were not set then show alert.
            alert("Please set Jira URL and default project key from extension options section.");
            chrome.runtime.openOptionsPage();
        }
    });
} 
