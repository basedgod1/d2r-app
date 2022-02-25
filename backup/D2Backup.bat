@echo off
echo Backing up Diablo II saves...
set "SRC=C:\Users\Preston\SAVEDG~1\"
set "D2DIR=Diablo II Resurrected"
set "GMDIR=GoMule"
set "TS=%DATE:~-4%%DATE:~-10,2%%DATE:~-7,2%%TIME:~-11,2%%TIME:~-8,2%%TIME:~-5,2%"
set "DEST=Diablo II Backups\d2bak%TS%\"
mkdir "%SRC%%DEST%"
xcopy "%SRC%%D2DIR%" "%SRC%%DEST%%D2DIR%" /v /i /s /e /h
xcopy "%SRC%%GMDIR%" "%SRC%%DEST%%GMDIR%" /v /i /s /e /h /EXCLUDE:%SRC%%GMDIR%\exclude.txt
mkdir "E:\%DEST%"
xcopy "%SRC%%D2DIR%" "E:\%DEST%%D2DIR%" /v /i /s /e /h
xcopy "%SRC%%GMDIR%" "E:\%DEST%%GMDIR%" /v /i /s /e /h /EXCLUDE:%SRC%%GMDIR%\exclude.txt
echo Complete!
pause
