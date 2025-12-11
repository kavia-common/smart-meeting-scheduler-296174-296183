#!/bin/bash
cd /home/kavia/workspace/code-generation/smart-meeting-scheduler-296174-296183/meeting_assistant_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

