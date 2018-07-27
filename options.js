// Saves options to chrome.storage
function save_options() {
    var project_key = document.getElementById('project_key').value;
    var jira_url = document.getElementById('jira_url').value;
    chrome.storage.sync.set({
        project_key: project_key,
        jira_url: jira_url
    }, function() {

        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 2000);
    });
}

// Restores preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value project_key = 'red' and jira_url = true.
    chrome.storage.sync.get({
        project_key: 'SOC',
        jira_url: 'https://vinsol.atlassian.net'
    }, function(items) {
        document.getElementById('project_key').value = items.project_key;
        document.getElementById('jira_url').value = items.jira_url;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
