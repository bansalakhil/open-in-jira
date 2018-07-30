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


