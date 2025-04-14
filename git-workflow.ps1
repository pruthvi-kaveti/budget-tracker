# Git workflow automation script
param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

# Function to run git commands with error checking
function Invoke-GitCommand {
    param(
        [string]$Command,
        [string]$Description
    )
    Write-Host "`n$Description..." -ForegroundColor Cyan
    $gitPath = "C:\Program Files\Git\bin\git.exe"
    
    # Execute git command with proper argument handling
    try {
        # Use Start-Process to properly handle arguments
        $process = Start-Process -FilePath $gitPath -ArgumentList $Command -NoNewWindow -Wait -PassThru
        
        if ($process.ExitCode -ne 0) {
            Write-Error "Git command failed: git $Command"
            exit $process.ExitCode
        }
    } catch {
        Write-Error "Error executing git command: $_"
        exit 1
    }
}

# 1. Run tests first
Write-Host "`nRunning tests..." -ForegroundColor Cyan
try {
    npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Tests failed"
        exit $LASTEXITCODE
    }
} catch {
    Write-Error "Error running tests: $_"
    exit 1
}

# 2. Check git status
Invoke-GitCommand "status" "Checking repository status"

# 3. Show changes
Write-Host "`nShowing changes..." -ForegroundColor Cyan
try {
    & "C:\Program Files\Git\bin\git.exe" diff
    Write-Host "`nPress any key to continue after reviewing changes..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} catch {
    Write-Error "Error showing changes: $_"
    exit 1
}

# 4. Stage changes one by one
Write-Host "`nStaging changes one by one..." -ForegroundColor Cyan
try {
    # Get list of modified files
    $modifiedFiles = & "C:\Program Files\Git\bin\git.exe" status --porcelain | Where-Object { $_ -match '^ M|^A ' } | ForEach-Object { ($_ -split ' ')[1] }
    
    if ($modifiedFiles.Count -eq 0) {
        Write-Host "No changes to stage." -ForegroundColor Yellow
    } else {
        Write-Host "Found $($modifiedFiles.Count) modified files:" -ForegroundColor Cyan
        $modifiedFiles | ForEach-Object { Write-Host "- $_" }
        
        foreach ($file in $modifiedFiles) {
            Write-Host "`nDo you want to stage '$file'? (Y/N)" -ForegroundColor Yellow
            $response = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            
            if ($response.Character -eq 'Y' -or $response.Character -eq 'y') {
                Write-Host "Staging '$file'..." -ForegroundColor Green
                Invoke-GitCommand "add `"$file`"" "Staging $file"
            } else {
                Write-Host "Skipping '$file'..." -ForegroundColor Yellow
            }
        }
    }
} catch {
    Write-Error "Error staging changes: $_"
    exit 1
}

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