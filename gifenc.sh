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


palette="/tmp/palette.png"

if [ "$text" = "undefined" ] || [ "$fontFile" = "undefined" ]; then
  filters="fps=$fps,scale=$resolution:-1:flags=lanczos"
else
  filters="fps=$fps,scale=$resolution:-1:flags=lanczos,drawtext='fontcolor=$textColor:borderw=1:fontsize=18:fontfile=$fontFile:text=$text:x=(w-text_w)/2:y=h-th-h*0.15'"
fi

if [ "$quality" = "high" ]; then
  ffmpeg -v warning -ss $start_time -t $duration -i $videoName -filter_complex  "$filters,palettegen" -y $palette
  ffmpeg -v warning -ss $start_time -t $duration -i $videoName -i $palette -filter_complex "$filters [x]; [x][1:v] paletteuse" -y $outputName
fi

if [ "$quality" = "normal" ]; then
  ffmpeg -v warning -ss $start_time -t $duration -i $videoName -filter_complex  "$filters,palettegen" -y $palette
  ffmpeg -v warning -ss $start_time -t $duration -i $videoName -i $palette -filter_complex "$filters [x]; [x][1:v] paletteuse" -f image2pipe -vcodec ppm - | convert -delay 5 - gif:- | convert -layers Optimize - $outputName
fi

if [ "$quality" = "low" ]; then
  ffmpeg -i $videoName -ss $start_time -t $duration -filter_complex "$filters" $outputName
fi
