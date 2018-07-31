chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);

    if (command === "open-in-jira-popup") {
        jiraPopup();
    }

    if (command === "open-in-jira") {
        openInJira();
    }

});


// when user enter query in omnibox
chrome.omnibox.onInputEntered.addListener(function(input){
  if(input){
    openIssueInJira(input, true);
  }
})


// when user is typing in omnibox
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {

    var query = "atlassian.net " + text;
    chrome.history.search({text: query}, function(items){

        var suggestions = [];

        for (var i = items.length - 1; i >= 0; i--) {
            suggestions.push({content: items[i].url, description: items[i].title })
        }
        suggest(suggestions);
    })

  });
