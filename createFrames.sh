#!/bin/sh

videoName=$1
outputName=$2
fps=$3
startTime=$4
duration=$5
resolution=$6
quality=$7
frameCount=$8
x='x'


ffmpeg -ss $startTime -t $duration -i $videoName -vframes $frameCount -vf scale=$resolution:-1 -r $fps  $outputName-frame-%04d.png
montage -border 0 -geometry $resolution$x -tile 6x -quality $quality $outputName-frame-*.png $outputName
