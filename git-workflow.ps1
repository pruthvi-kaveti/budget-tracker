# Git workflow automation script
param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

# Function to check if a command succeeded
function Test-CommandSuccess {
    param($LastExitCode)
    if ($LastExitCode -ne 0) {
        Write-Error "Command failed with exit code $LastExitCode"
        exit $LastExitCode
    }
}

# Function to run git commands with error checking
function Invoke-GitCommand {
    param(
        [string]$Command,
        [string]$Description
    )
    Write-Host "`n$Description..." -ForegroundColor Cyan
    & "C:\Program Files\Git\bin\git.exe" $Command
    Test-CommandSuccess $LASTEXITCODE
}

# 1. Run tests first
Write-Host "`nRunning tests..." -ForegroundColor Cyan
npm test
Test-CommandSuccess $LASTEXITCODE

# 2. Check git status
Invoke-GitCommand "status" "Checking repository status"

# 3. Show changes
Write-Host "`nShowing changes..." -ForegroundColor Cyan
& "C:\Program Files\Git\bin\git.exe" diff
Write-Host "`nPress any key to continue after reviewing changes..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 4. Stage all changes
Invoke-GitCommand "add ." "Staging all changes"

# 5. Verify staged changes
Invoke-GitCommand "status" "Verifying staged changes"

# 6. Commit changes
Invoke-GitCommand "commit -m `"$CommitMessage`"" "Committing changes"

# 7. Pull latest changes
Invoke-GitCommand "pull" "Pulling latest changes"

# 8. Push changes
Invoke-GitCommand "push" "Pushing changes"

# 9. Final status check
Invoke-GitCommand "status" "Final status check"

Write-Host "`nWorkflow completed successfully! 🎉" -ForegroundColor Green 