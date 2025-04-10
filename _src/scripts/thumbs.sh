#!/bin/bash

echo "Creating thumbnails..."

# Create directories
mkdir -p _src/assets/images/posts/thumbnails
mkdir -p _src/assets/images/private/thumbnails
mkdir -p _src/assets/images/thumbnails

# Process posts images
find _src/assets/images/posts -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) ! -path "*/thumbnails/*" | while read img; do
    filename=$(basename "$img")
    magick "$img" -thumbnail 200x200^ -gravity center -extent 200x200 "_src/assets/images/posts/thumbnails/thumb_${filename}"
    echo "Created thumbnail for $filename in posts"
done

# Process private images
find _src/assets/images/private -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) ! -path "*/thumbnails/*" | while read img; do
    filename=$(basename "$img")
    magick "$img" -thumbnail 200x200^ -gravity center -extent 200x200 "_src/assets/images/private/thumbnails/thumb_${filename}"
    echo "Created thumbnail for $filename in private"
done

# Process images directory
find _src/assets/images -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) ! -path "*/thumbnails/*" | while read img; do
    filename=$(basename "$img")
    magick "$img" -thumbnail 200x200^ -gravity center -extent 200x200 "_src/assets/images/thumbnails/thumb_${filename}"
    echo "Created thumbnail for $filename in images"
done
