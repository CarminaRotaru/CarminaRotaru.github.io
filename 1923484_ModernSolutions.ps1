function KillThatProcess
{
    [string] $name = ""
    [string] $confirmation
    
    Write-Host "Enter the name of the process you would like to stop."
    $name = Read-Host

    [int] $numInstinces = 0
    $numInstinces = @(Get-Process -ea SilentlyContinue $name).Count

    if($numInstinces -ne 0) 
    {
        Write-Host "There is/are " -NoNewline
        Write-Host $numInstinces -NoNewline
        Write-Host " processe(s) with the name " -NoNewline
        Write-Host $name -NoNewline
        Write-Host ", proceed? Y/N"
        $confirmation = Read-Host

        if($confirmation.ToLower() -eq 'y') 
        {
            Stop-Process -Name $name
            Write-Host $name -NoNewline
            Write-Host " was successfuly closed"
        }
        else
        {
            Write-Host "KillThatProcess successfuly canceled"
        }
    }

    else
    {
        Write-Host "There is no process with the name " -NoNewline
        Write-Host $name -NoNewline
	Write-Host "running on the device"
    }
}

function Bamboozle
{
    [string] $path = "."
    [string] $letter = ("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" | Get-Random)
    [string] $lowerLetter = $letter.ToLower()
    [string] $seperator = $letter + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter  + " " + $letter
    
    $Host.UI.RawUI.BackgroundColor = 'White'
    $Host.UI.RawUI.ForegroundColor = 'Black'

    cd $path

    Get-ChildItem * -Include *$letter* -Recurse | Remove-Item -WhatIf
    Get-ChildItem * -Include *$lowerLetter* -Recurse | Remove-Item -WhatIf
    Write-Host $seperator
    Write-Host "All files containing the letter " -NoNewLine
    Write-Host $letter -NoNewLine
    Write-Host " in their name have been deleted"
}

KillThatProcess
Bamboozle