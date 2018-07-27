function openInJira(info, tab) {
    chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
    }, function(selection) {
        chrome.tabs.create({
            url: "https://vinsol.atlassian.net/browse/" + selection
        });
    });
}

var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Open in jira (vinsol)";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "onclick": openInJira
    });
    console.log("'" + context + "' item:" + id);
}
