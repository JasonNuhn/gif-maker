## **Gif Maker**

**/createGif** uses FFmpeg to do the manipulations

- **VideoId:**  The id of the video.

- **Fps:** Frame per second

- **Start Time:** SS || MM:SS ||  HH:MM:SS ||  HH:MM:SS.xxx where xxx is milliseconds

	    http://yourwebsite.com/fps_24,startTime_00:00:03.500,duration_2/1.gif

- **Duration:** SS || SS.xxx where xxx is milliseconds

	    http://yourwebsite.com/fps_24,startTime_22,duration_2.300/1.gif

- **Filter**(optional)

	    http://yourwebsite.com/fps_30,startTime_00:10,duration_5,filterId=hue/1.gif


- **Resolution**(optional) Width of the gif in number of pixels, default is 720p

		http://yourwebsite.com/fps_30,startTime_00:10,duration_0.700,filterId_hue,resolution=480/1.gif

- **Text** (optional) Add text to the bottom

		http://yourwebsite.com/fps_30,startTime_00:10,duration_0.700,filter_red,resolution=480_textId=1,textStyleId=1/1.gif

AWS key = videoId-starttime-duration-fps-(filter)-(resolution)-(text)

**/createGifFromCld**

 - **VideoId, Filter, Resolution and Text are same as /createGif **
 - **Duration and Start Time**
	 SS.xxx = seconds.miliseconds (10.200)

		http://yourwebsite.com/cloudinary/fps_30,startTime_6.200,duration_3.200,resolution_480,textId=1/0.gif

	XXp = "10p" and "30p" are percantage marks for duration and starting time(10p will start a video of 30 at the 3 second mark)

		http://yourwebsite.com/cloudinary/fps_30,startTime_10p,duration=20p,resolution_480,textId=4/0.gif

 - **Fps:** Does not exist
