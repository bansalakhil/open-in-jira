chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);

    if (command === "open-in-jira-popup") {
        jiraPopup();
    }

    if (command === "open-in-jira") {
        openInJira();
    }

});



chrome.omnibox.onInputEntered.addListener(function(input){
  if(input){
    openIssueInJira(input, true);
  }
})

