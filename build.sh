#!/bin/bash
tag=$1

[ ! -z "$tag" ] && docker build -t stripe-server:$tag . && exit 1

docker build -t stripe-server .