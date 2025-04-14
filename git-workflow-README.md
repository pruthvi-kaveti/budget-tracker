# Git Workflow Automation Script

This script automates the git workflow process with proper error checking and verification steps.

## Features

- Runs tests before committing
- Shows repository status
- Displays changes for review
- Stages all changes
- Verifies staged changes
- Commits with a provided message
- Pulls latest changes
- Pushes changes
- Performs final status check
- Error checking at each step

## Usage

1. Make sure you're in your project directory
2. Run the script with a commit message:

```powershell
.\git-workflow.ps1 -CommitMessage "Your commit message here"
```

## Example

```powershell
.\git-workflow.ps1 -CommitMessage "Fix failing tests in AddExpense component"
```

## What the Script Does

1. Runs `npm test` to ensure all tests pass
2. Shows current git status
3. Displays all changes for review
4. Stages all changes
5. Verifies staged changes
6. Commits with the provided message
7. Pulls latest changes from remote
8. Pushes changes to remote
9. Performs final status check

## Error Handling

- The script will stop if any step fails
- Shows clear error messages
- Prevents incomplete commits
- Ensures all changes are properly tracked

## Requirements

- PowerShell 5.0 or higher
- Git installed at `C:\Program Files\Git\bin\git.exe`
- Node.js and npm for running tests 