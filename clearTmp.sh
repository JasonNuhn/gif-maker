#!/bin/sh
find /tmp/*.gif -mmin 5 -type f -delete
find /tmp/*.png -mmin 5 -type f -delete
find /tmp/*.mp4 -mmin 5 -type f -delete
find /tmp/*.webm -mmin 5 -type f -delete
find /tmp/*.jpg -mmin 5 -type f -delete

