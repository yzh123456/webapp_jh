XCOPY .\src\*  .\build\webapp\src\ /s  /e  /y
XCOPY .\output\*  .\build\webapp\output\ /s  /e  /y
del /f /s /q .\build\webapp\src\qrcode\*.*
