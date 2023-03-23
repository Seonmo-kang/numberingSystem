powershell copy "c:\numberingSystem-dev\startup\*.*" "C:\Users\$env:username\AppData\Roaming\Microsoft\Windows\Start` Menu\Programs\Startup"
powershell copy "c:\numberingSystem-dev\shortcuts\*.*" "C:\Users\$env:username\Desktop"
powershell Restart-Computer -Confirm