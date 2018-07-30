function jiraPopup(tab) {

    var jira_url, project_key;

    chrome.storage.sync.get(['project_key', 'jira_url'], function(items) {
        jira_url = items.jira_url;
        project_key = items.project_key;


        if (jira_url && project_key) {
            var issue_id = prompt(jira_url + "\n\nPlease enter the issue id (" + project_key + "-43) or 43:")
            if (issue_id) {
                openIssueInJira(issue_id)
            }

        } else {
            alert("Please set jira url and default project key from extension options section.");
        }
    });

}


function openInJira(info, tab) {
    chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
    }, function(selection) {

        openIssueInJira(selection);

    });
}


function openIssueInJira(selection) {

    selection = selection.toString().replace(/\s+/g, '-').toLowerCase();

    chrome.storage.sync.get(['project_key', 'jira_url'], function(items) {
        var url;
        if (selection.match(/^\d+$/g)) {
            url = items.jira_url + "/browse/" + items.project_key + '-' + selection;
        } else {
            url = items.jira_url + "/browse/" + selection;

        }
        chrome.tabs.create({
            url: url
        });
    });


}
