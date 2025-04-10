---
layout: layouts/base.html
title: "A Better Edit Thanks to WSL"
date: 2024-02-21
description:
category:
tags: [notepad++, sketches]
feature-image: 
feature-image-width: 100%
feature-image-height: auto
thumbnail-image: /assets/images/posts/thumbnails/thumb_notepad++.jpg
thumbnail-image-width: 200pt
thumbnail-image-height: auto
---
{% include 'metadata.liquid' %}

<div class="mt-4">
Overview
One of the biggest problems I have in wanting to constantly learn new things, is that these learnings sometimes come at the cost of breaking/ruining thins that you’ve previously done that actually work. You learn a new or better way of doing something, like tuning your Apache config file, tweaking a php.in filr or overwriging and index.html file, only to overwrite the existing file, and now - poof! - the original file (that worked) has been overwritten and all that hard work goes down the drain.

<a href="/assets/images/notepad++.jpg" target="_blank" title="Finish Line">
<img src="/assets/images/notepad++.jpg" alt="Notepad++ Logo" class="rounded float-start border border-1" style="width: 50%; max-width: 1000px; margin-right: 6pt; margin-top:4px;"/></a>

Now add-on the fact that editing inside Ubuntu using Vi is not as easy as Notepad++. Copy, cut & paste are far less intuitive, so your less likely to do it well.

But now running Ubuntu inside of WSL on my laptop gives me options that I didnt have before by making the windows file system available to me as mounted volumes. With that new feature in mind, I set out on making my “editing” better.

Requirements
When I thought about it, my requirements were really simple:

I’d like to take a snapshot or a backup of the file I was going to edit,
I wanted it to be transparent to me, and
I’d like to edit using a tool that was easier to use than VI.
Copy the File
Before becoming aware of local file system availability, I wrote a simple script called Copy that made a backup of the file I was planning to edit:

<code>
#!/bin/bash
echo
echo Copying "$1" to "$1"-`date +"%Y%m%d-%H%M%S"`.txt.html
cp "./$1" ./"$1"-`date +"%Y%m%d-%H%M%S"`.txt.html
echo
</code>
All it did was simply copy the filename I supplied on the command line, to a hidden file name, and dropped in a date and time stamp, using and reformatting the date command.

This worked, **but** I needed to remember to run Copy before I edited the file with Vi.

Better Edit
Then, later on, I created an Alias to easily run Notepad++”:
<code>
alias npp=/mnt/c/'Google Drive'/Utilities/Notepad++/Notepad++.exe
</code>
Now all I needed to do was first fune my Copy script, then use the npp alias to edit the file in Notepad++.

Put it all Together
Finally, I put it alll together into a script called Edit which hits all my requirements; backup files before I edit them, Transparent to me, and a better editor.

The biggest change I made was the creation of .backups folders to house the backups created in each folder, keeping them out of the way (transparent) while still keeping things in order.

Her’s the final version of the file.

# !/bin/bash

NOW=$(date +"%Y.%m.%d,%H.%M.%S")

FILE="$1"

if [ -z "$FILE" ]
then
echo "ERROR: Need a file on the command line"
else

mkdir ./.backup > /dev/null 2>&1
cp "./$1" .backup/`date +"%Y%m%d-%H%M%S"`.$1 > /dev/null 2>&1
echo Editing $1 in Notepad++
/mnt/c/'Google Drive'/Utilities/Notepad++/Notepad++.exe $1

fi
Please let me know if you have suggestions on how to do this better, smarter or simpler.
