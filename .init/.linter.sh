#!/bin/bash
cd /home/kavia/workspace/code-generation/academic-query-assistant-186377-186386/study_assistant_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

