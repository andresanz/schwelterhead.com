module.exports = function(eleventyConfig) {
  // Enable dynamic tag pages
  eleventyConfig.addFilter("filterTagList", function(tags) {
    return (tags || []).filter(tag => ["post", "private", "posts", "all"].indexOf(tag) === -1);
  });
  
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true
  });

  // Add passthrough copy for posts
  eleventyConfig.addPassthroughCopy("_src/posts");
  eleventyConfig.addPassthroughCopy("assets");

  // Add to .eleventy.js
  // const pluginRss = require("@11ty/eleventy-plugin-rss");
  // eleventyConfig.addPlugin(pluginRss);

  // Add to .eleventy.js
  // const sitemap = require("@11ty/eleventy-plugin-sitemap");
  // eleventyConfig.addPlugin(sitemap);

  // const Image = require("@11ty/eleventy-img");

  // Add a shortcode for images
  eleventyConfig.addShortcode("image", function(src, alt, className) {
    return `<img src="/images/${src}" alt="${alt}" class="${className || ''}" loading="lazy">`;
  });

  
  // Create separate collections for each blog with automatic tagging
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_src/posts/**/*.html").map(post => {
      // Automatically add post tag if not in frontmatter
      if (!post.data.tags) post.data.tags = [];
      if (typeof post.data.tags === 'string') post.data.tags = [post.data.tags];
      if (!post.data.tags.includes('post')) post.data.tags.push('post');
      return post;
    });
  });

  eleventyConfig.addCollection("private", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_src/private/**/*.html").map(post => {
      // Automatically add private tag if not in frontmatter
      if (!post.data.tags) post.data.tags = [];
      if (typeof post.data.tags === 'string') post.data.tags = [post.data.tags];
      if (!post.data.tags.includes('private')) post.data.tags.push('private');
      return post;
    });
  });

  // Create separate tag collections for each blog
  eleventyConfig.addCollection("postTags", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("_src/posts/**/*.html");
    return getAllTags(posts);
  });

  eleventyConfig.addCollection("privateTags", function(collectionApi) {
    const private = collectionApi.getFilteredByGlob("_src/private/**/*.html");
    return getAllTags(private);
  });

  function getAllTags(collection) {
    let tagSet = new Set();
    collection.forEach(item => {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        if (typeof tags === "string") {
          tags = [tags];
        }
        tags.forEach(tag => {
          // Only add non-base tags to the tag collection
          if (tag !== 'post' && tag !== 'private') {
            tagSet.add(tag);
          }
        });
      }
    });
    return [...tagSet];
  }

  return {
    dir: {
      input: "_src",
      output: "_site",
      includes: "_includes"
    }
  };
};