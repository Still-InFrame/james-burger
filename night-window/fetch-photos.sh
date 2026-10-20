#!/bin/sh
# Downloads the generated concept photos into assets/ and converts them to
# web-sized JPEGs. Needs curl and ffmpeg. Run from anywhere:
#   sh night-window/fetch-photos.sh
set -eu
cd "$(dirname "$0")/assets"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

fetch() { # name url width
  curl -fsSL -o "$tmp/$1.png" "$2"
  ffmpeg -v error -y -i "$tmp/$1.png" -vf "scale=$3:-2:flags=lanczos" -q:v 4 "$1.jpg"
  echo "assets/$1.jpg"
}

BASE=https://d8j0ntlcm91z4.cloudfront.net/user_3996WY5xBRVHGjDlDvLnVrNlQ5k
fetch hero-lit  "$BASE/hf_20261020_061252_b8df5d98-0776-479e-98e6-e5903aa4c684.png"  1920
fetch hero-shut "$BASE/hf_20261020_061333_6066aec3-b8d3-4a4d-a2c8-fa0717494f8b.png" 1920
fetch burger    "$BASE/hf_20261020_061254_94912d5f-b2d8-46e5-b952-72d793b544f4.png"    1080
fetch handoff   "$BASE/hf_20261020_061256_b27f0e3e-1acd-4e36-b97a-af31d138e5b8.png"   1080
