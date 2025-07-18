# Jira Issue Quick Open

A Google Chrome extension that allows you to quickly open Jira issues using keyboard shortcuts, context menus, or the omnibox.

## Features

- **Keyboard Shortcuts**: Use `Alt+J` to open the popup or `Alt+Shift+J` to open selected text as a Jira issue
- **Context Menu**: Right-click on selected text to open it as a Jira issue
- **Omnibox**: Type `j` followed by your search query in the address bar
- **Recently Visited**: View and access recently visited Jira issues
- **Customizable**: Set your Jira URL and default project key

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder

## Configuration

1. Click on the extension icon in your toolbar
2. Click the "options" link to configure your settings
3. Enter your Jira URL (e.g., `https://your-account.atlassian.net`)
4. Enter your default project key (e.g., `PROJ`)
5. Set the limit for recently visited issues (default: 10)
6. Click "Save"

## Usage

### Opening Issues

- **By Issue ID**: Enter just the number (e.g., `123`) to open `PROJ-123`
- **By Full Issue Key**: Enter the full issue key (e.g., `PROJ-123`)
- **By URL**: Paste a Jira URL to open it directly

### Keyboard Shortcuts

- `Alt+J`: Open the extension popup
- `Alt+Shift+J`: Open selected text as a Jira issue

### Context Menu

1. Select any text on a webpage
2. Right-click and choose "Open in Jira '[selected text]'"

### Omnibox

1. Type `j` in the address bar
2. Press Tab or Space
3. Type your search query
4. Press Enter to open the selected issue

## Version History

### Version 12 (Latest)
- Updated to Manifest V3 for better security and performance
- Fixed typos and improved code formatting
- Updated to use modern Chrome extension APIs
- Improved error handling and user experience

### Previous Versions
- Version 11: Original Manifest V2 implementation

## Technical Details

- **Manifest Version**: 3
- **Permissions**: contextMenus, activeTab, tabs, storage, history, scripting
- **Background**: Service Worker
- **Content Scripts**: Runs on Atlassian.net domains

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 
