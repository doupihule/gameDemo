

@echo off 
set a=0 
setlocal EnableDelayedExpansion 
for /f "delims=" %%a in ('dir /b/s/a-d *.skel') do ( 
	echo rename "%%a" *.skel.bytes
	rename "%%a" *.skel.bytes
)
