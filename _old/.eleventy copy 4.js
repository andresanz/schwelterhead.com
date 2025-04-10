module.exports = function(eleventyConfig) {
  // Configure Liquid
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strictFilters: false  // Add this for more flexibility
  });

  // Filters
  eleventyConfig.addFilter("filterTagList", function(tags) {
    return (tags || []).filter(tag => ["post", "private", "posts", "all"].indexOf(tag) === -1);
  });

  // Global data - make siteinfo available to all templates
  eleventyConfig.addGlobalData('site', require('./_data/siteinfo.json'));


  // Asset handling
  eleventyConfig.addPassthroughCopy("_src/assets");
  
  // Image shortcode
  eleventyConfig.addShortcode("image", function(src, alt = "", type = "posts", className = "") {
    return `<img src="/assets/images/${type}/${src}" 
                 alt="${alt}" 
                 class="${className}" 
                 loading="lazy">`;
  });

  // Blog collections with automatic tagging
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_src/posts/*.html",
      "_src/posts/*.liquid",
      "_src/posts/*.md"]).map(post => {
      if (!post.data.tags) post.data.tags = [];
      if (typeof post.data.tags === 'string') post.data.tags = [post.data.tags];
      if (!post.data.tags.includes('post')) post.data.tags.push('post');
      return post;
    });
  });

  eleventyConfig.addCollection("private", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_src/private/*.html",
      "_src/private/*.liquid",
      "_src/private/*.md"
    ]).map(post => {
      if (!post.data.tags) post.data.tags = [];
      if (typeof post.data.tags === 'string') post.data.tags = [post.data.tags];
      if (!post.data.tags.includes('private')) post.data.tags.push('private');
      return post;
    });
  });

  // Tag collections
  eleventyConfig.addCollection("postTags", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("_src/posts/*.html");
    return getAllTags(posts);
  });

  eleventyConfig.addCollection("privateTags", function(collectionApi) {
    const private = collectionApi.getFilteredByGlob("_src/private/*.html");
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