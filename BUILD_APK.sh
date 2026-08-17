#!/usr/bin/env bash
set -e
./gradlew assembleDebug
printf '\nAPK: app/build/outputs/apk/debug/app-debug.apk\n'
