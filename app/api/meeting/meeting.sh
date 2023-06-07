#!/bin/bash

API_KEY="hhhhhhh"
MIROTALK_URL="https://localhost:8080/api/v1/meeting"
# MIROTALK_URL="https://p2p.pigeon.com/api/v1/meeting"
# MIROTALK_URL="https://pigeon.up.railway.app/api/v1/meeting"
#MIROTALK_URL="https://pigeon.herokuapp.com/api/v1/meeting"

curl -sSLk $MIROTALK_URL \
    --header "authorization: $API_KEY" \
    --header "Content-Type: application/json" \
    --request POST
