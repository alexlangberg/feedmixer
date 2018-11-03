#!/usr/bin/env bash

ng build --prod &&

sudo docker login &&

sudo docker build -t alexlangberg/feedmixer:dev . &&

sudo docker push alexlangberg/feedmixer:dev
