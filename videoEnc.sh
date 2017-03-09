#!/bin/sh

videoName=$1
outputName=$2
fps=$3
start_time=$4
duration=$5
resolution=$6
quality=$7
textColor=$8
text=$9
fontFile=${10}

if [ "$text" = "undefined" ] || [ "$fontFile" = "undefined" ]; then
  filters="fps=$fps,scale=$resolution:-2:flags=lanczos"
else
  filters="fps=$fps,scale=$resolution:-2:flags=lanczos,drawtext='fontcolor=$textColor:borderw=1:fontsize=18:fontfile=$fontFile:text=$text:x=(w-text_w)/2:y=h-th-h*0.15'"
fi

ffmpeg -ss $start_time -i $videoName -t $duration -filter_complex "$filters" -strict -2 $outputName
