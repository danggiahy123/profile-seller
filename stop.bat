@echo off
title Dung Server

echo Dang dung tat ca server...

echo Dung backend...
taskkill /im node.exe /f >nul 2>&1

echo Dung frontend...
taskkill /f /im node.exe /fi "WINDOWTITLE eq Frontend*" >nul 2>&1
taskkill /f /im node.exe /fi "WINDOWTITLE eq Backend*" >nul 2>&1

echo Hoan thanh!
timeout /t 2 >nul
