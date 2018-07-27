function openInJira(info, tab) {
    chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
    }, function(selection) {

        openIssueInJira(selection);

    });
}

var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Open in jira '%s' ";

    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "onclick": openInJira
    });
    console.log("'" + context + "' item:" + id);
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
