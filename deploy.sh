#!/bin/bash

DEST_DIR=/var/www/schedule

echo Deploy started...

HOST=root@31.128.44.232
NUXT_PUBLIC_API_BASE=/ NUXT_PUBLIC_WS_URL=wss://schedule.code-lab.pro/ws npm run generate &&
cd .output/public && tar -czvf /tmp/frontend.tar.gz ./* && cd ../../ &&
  scp /tmp/frontend.tar.gz "$HOST:/tmp/" &&
  ssh "$HOST" "
rm -rf $DEST_DIR &&
mkdir -p $DEST_DIR &&
tar -xzvf /tmp/frontend.tar.gz -C $DEST_DIR
" &&
  rm /tmp/frontend.tar.gz &&
  exit
