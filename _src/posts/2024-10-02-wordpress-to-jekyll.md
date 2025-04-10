---
layout: layouts/base.html
date: 2024-10-02
title: "Wordpress to Jekyll"
description: 
category: 
date-modified:
comments: false
tags: [wordpress, development, shell, script]
feature-image: /assets/images/posts/wordpress_to_jekyll.png
feature-image-width: 65%
feature-image-height: auto
thumbnail-image: /assets/images/posts/thumbnails/thumb_wordpress_to_jekyll.png
thumbnail-image-width: 200pt
thumbnail-image-height: auto
---
{% include 'metadata.liquid' %}

{% include 'feature-image.liquid' %}



<p>So in the past three months, I’ve been working on converting my my blog from <a href="https://www.wordpress.com/">Wordpress</a> to <a href="https://www.jekyll.com/">Jekyll</a>. Wordpress has so many requirements that I found myself spending all of my spare time managing plugins, interfaces, tables &amp; themes <strong>and not</strong> writing.</p>

<p>In Jekyll, blog posts are managed via Markdown files in a specific directory. Each post has its own file. <a href="https://jekyllrb.com/docs/front-matter/">Front matter</a> included in each file contains metadata about the post, such as the title, publishing date, category, and desired layout. Jekyll looks through those files and then generates the site resulting in a set of static HTML &amp; CSS pages that can be pushed to a web server  This flat, simple structure also makes backups simpler.</p>

<p>There’s no user interface, which I initially thought would be difficult to accept, but in fact it makes it easier by being able to use the editor of of my choice such as <a href="https://en.wikipedia.org/wiki/Vi">Vi</a> or <a href="https://notepad-plus-plus.org/">Notepad++</a>.  You have to manually create a file, ideally name the file using a slugified version of the post’s title, and then add the preamble with title and the published date in ISO format and anything else your specific setup needs to render the post;  A lot to remember and even more to forget.</p>

<p>Being the geek &amp; perfectionist that I am, manual work is highly frustrsting because the output is often different. So I created a simple shell script that uses the <a href="https://phoenixnap.com/kb/bash-read">read</a> function, then asks for the post’s title &amp; the destination domain, creates the file using the slugified version of the title for the file name, then opens the file in Vi:</p>
<pre class="bg-light p-3 rounded"><code class="language-bash">

#!/bin/sh
read -p "Title: " title
SLUG="$(echo $title | sed -r 's/[\.\, \?]+/-/g' | tr '[:upper:]' '[:lower:]')"
DATE=$(date +"%Y-%m-%d")
DATE_TIME=$(date +"%Y-%m-%dT%H:%M:%S%z")
read -p "Domain: " domain
tee -a /home/andre/jekyll-sites/$domain/_drafts/${DATE}-${SLUG}.md <<EOF
\-\-\-
layout: post
date: ${DATE_TIME}
title: ${title}
description:
category:
date-modified:
comments: true
tags: [Tag01, Multi-Word Tag02]
feature-image: /assets/images/2023-10-23-a-shell-script-to-create-new-posts-for-markdown-blogs/planning.jpg
feature-image-width: 100%
feature-image-height: auto
thumbnail-image: /assets/images/2023-10-23-a-shell-script-to-create-new-posts-for-markdown-blogs/markdown.png
thumbnail-image-width: 150px
thumbnail-image-height: auto
EOF
\-\-\-

vim /home/andre/jekyll-sites/$domain/_drafts/${DATE}-${SLUG}.md
</code></pre>

<p>This script creates new posts in the <code>_drafts</code> folder.  This is simple enough to enable, but not obvious.</p>
