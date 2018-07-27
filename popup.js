chrome.browserAction.onClicked.addListener(function(tab) {

    var issue_id = prompt("Please enter the issue id (SOC-43) or 43:")
    if (issue_id) {
        openIssueInJira(issue_id)
    }
});
