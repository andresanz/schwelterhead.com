const markdownIt = require("markdown-it");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // Keep existing markdown and liquid config...
  // (up until the filters section)
  eleventyConfig.addPlugin(pluginRss);

  // Add absoluteUrl filter
  eleventyConfig.addFilter('absoluteUrl', function(url, base) {
    try {
      return new URL(url, base).toString();
    } catch(e) {
      return base + url;
    }
  });

  // Modified filter for counting posts with a specific tag
  eleventyConfig.addFilter("postsWithTag", function(posts, tag) {
    return posts.filter(post => {
      if (!post.data.tags) return false;
      return post.data.tags.some(t => t.url === tag);
    }).length;
  });

  // Asset handling
  eleventyConfig.addPassthroughCopy("_src/assets");
  eleventyConfig.addPassthroughCopy("_src/private/.htaccess");
  eleventyConfig.addPassthroughCopy("_src/.htaccess");
  eleventyConfig.addPassthroughCopy("CNAME");


  // Keep global data and asset handling...
  // (until the collections)

  eleventyConfig.addGlobalData('localdata', () => require('./_src/_data/siteinfo.json'));

  eleventyConfig.addFilter("relative_url", function(url) {
    if (!url) return '';
    
    // Convert to string if not already
    url = url.toString();
    
    // Remove leading slash if it exists
    if (url.startsWith('/')) {
      url = url.slice(1);
    }
    
    // Remove trailing slash if it exists
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    
    return url;
  });

  // Private collection
  eleventyConfig.addCollection("private", function(collectionApi) {
    return collectionApi.getFilteredByGlob([
      "_src/private/*.html",
      "_src/private/*.liquid",
      "_src/private/*.md"
    ]).map(post => {
      // Initialize tags array
      if (!post.data.tags) post.data.tags = [];
      
      // Convert string tags to array
      if (typeof post.data.tags === 'string') {
        post.data.tags = post.data.tags.split(',').map(tag => tag.trim());
      }
      
      // Ensure tags is an array
      if (!Array.isArray(post.data.tags)) {
        post.data.tags = [post.data.tags];
      }
      
      // Convert each tag to object with display and url properties
      post.data.tags = post.data.tags
        .filter(tag => tag && tag !== 'private')
        .map(tag => {
          let cleanTag = typeof tag === 'string' ? tag.trim() : tag.toString().trim();
          return {
            display: cleanTag.replace(/%20/g, ' '),
            url: cleanTag
              .replace(/%20/g, '-')
              .replace(/\s+/g, '-')
              .toLowerCase()
          };
        });

      return post;
    });
  });

  // Posts collection (similar structure)
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob([
      "_src/posts/*.html",
      "_src/posts/*.liquid",
      "_src/posts/*.md"
    ]).map(post => {
      if (!post.data.tags) post.data.tags = [];
      
      if (typeof post.data.tags === 'string') {
        post.data.tags = post.data.tags.split(',').map(tag => tag.trim());
      }
      
      if (!Array.isArray(post.data.tags)) {
        post.data.tags = [post.data.tags];
      }
      
      post.data.tags = post.data.tags
        .filter(tag => tag && !['post', 'posts'].includes(tag))
        .map(tag => {
          let cleanTag = typeof tag === 'string' ? tag.trim() : tag.toString().trim();
          return {
            display: cleanTag.replace(/%20/g, ' '),
            url: cleanTag
              .replace(/%20/g, '-')
              .replace(/\s+/g, '-')
              .toLowerCase()
          };
        });

      return post;
    });
  });

  // Tag collections
  eleventyConfig.addCollection("postTags", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob([
      "_src/posts/*.html",
      "_src/posts/*.liquid",
      "_src/posts/*.md"
    ]);
    let tagSet = new Set();
    
    posts.forEach(post => {
      if (post.data.tags) {
        post.data.tags.forEach(tag => {
          if (tag.url && !['post', 'posts'].includes(tag.url)) {
            tagSet.add(tag.url);
          }
        });
      }
    });
    
    return [...tagSet].sort();
  });

  eleventyConfig.addCollection("privateTags", function(collectionApi) {
    const private = collectionApi.getFilteredByGlob([
      "_src/private/*.html",
      "_src/private/*.liquid",
      "_src/private/*.md"
    ]);
    let tagSet = new Set();
    
    private.forEach(post => {
      if (post.data.tags) {
        post.data.tags.forEach(tag => {
          if (tag.url && tag.url !== 'private') {
            tagSet.add(tag.url);
          }
        });
      }
    });
    
    return [...tagSet].sort();
  });

  return {
    dir: {
      input: "_src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["html", "liquid", "md"]
  };
};