#!/bin/bash
git push

ssh abel@54.169.183.159 << EOF
cd /home/leec/code/gt-frontend
git pull --no-edit
yarn
yarn build
EOF

