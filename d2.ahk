#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

Players(x)
{
  SendInput {enter}
  Sleep 100
  SendInput `/players%x%{enter}
}

+F8::+RButton
^F8::^RButton
!F8::RButton
#IfWinActive Diablo II: Resurrected
wheeldown::Players(1)
+wheeldown::Players(3)
wheelup::Players(7)
+wheelup::Players(5)
