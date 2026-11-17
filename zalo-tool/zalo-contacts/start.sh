#!/bin/bash
cd "$(dirname "$0")"
PROFILE="${1:-default}"
ZALO_PROFILE="$PROFILE" node server.mjs
