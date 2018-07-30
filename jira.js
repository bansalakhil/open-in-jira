// chrome.webNavigation.onCompleted.addListener(function(details) {
//     chrome.tabs.executeScript(details.tabId, {
//         code: ' if (document.body.innerText.indexOf("Cat") !=-1) {' +
//             '     alert("Cat not found!");' +
//             ' }'
//     });
// }, {});

var issue_seperator ='--##--';
var matches = document.location.toString().match(/^(https:\/\/.*\.atlassian\.net)\/.*[\/|=](\w+-\d+)$/)

if (matches.length) {
    // alert(matches[1]);

    chrome.storage.sync.get({
        "issue_history": []
    }, function(items) {
        // console.log(items.issue_history);
        var title = document.title.split(' - JIRA').shift();
        var entry = title + issue_seperator + matches[1] + '/browse/' + matches[2];

        var index = items.issue_history.indexOf(entry);

        if (index != -1) {

            items.issue_history.splice(index, 1);
        }

        items.issue_history.push(entry)

        if (items.issue_history.length >= 12) {
            items.issue_history.length = 12
        }

        chrome.storage.sync.set({
            "issue_history": items.issue_history
        })
    })

    // chrome.storage.sync.set({project_key: project_key, jira_url: jira_url})
}
