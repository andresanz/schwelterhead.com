module.exports = function(eleventyConfig) {
  // Configure Liquid (keep existing options)
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strictFilters: false  // Add this for more flexibility
  });

  // Front Matter parsing options
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  // Filters (keep existing)
  eleventyConfig.addFilter("filterTagList", function(tags) {
    return (tags || []).filter(tag => ["post", "private", "posts", "all"].indexOf(tag) === -1);
  });

  // Global data - keep as is
  eleventyConfig.addGlobalData('site', require('./_data/siteinfo.json'));

  // Asset handling (update paths if needed)
  eleventyConfig.addPassthroughCopy("_src/assets");
  
  // Image shortcode (keep as is)
  eleventyConfig.addShortcode("image", function(src, alt = "", type = "posts", className = "") {
    return `<img src="/assets/images/${type}/${src}" 
                 alt="${alt}" 
                 class="${className}" 
                 loading="lazy">`;
  });

  // Collections - modify to support both HTML and Liquid
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob([
      "_src/posts/*.html",
      "_src/posts/*.liquid",
      "_src/posts/*.md"
    ]).map(post => {
      if (!post.data.tags) post.data.tags = [];
      if (typeof post.data.tags === 'string') post.data.tags = [post.data.tags];
      if (!post.data.tags.includes('post')) post.data.tags.push('post');
      return post;
    });
  });

  eleventyConfig.addCollection("private", function(collectionApi) {
    return collectionApi.getFilteredByGlob([
      "_src/private/*.html",
      "_src/private/*.liquid",
      "_src/private/*.md"
    ]).map(post => {
      if (!post.data.tags) post.data.tags = [];
      if (typeof post.data.tags === 'string') post.data.tags = [post.data.tags];
      if (!post.data.tags.includes('private')) post.data.tags.push('private');
      return post;
    });
  });

  // Tag collections (keep as is)
  eleventyConfig.addCollection("postTags", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob([
      "_src/posts/*.html",
      "_src/posts/*.liquid",
      "_src/posts/*.md"
    ]);
    return getAllTags(posts);
  });

  eleventyConfig.addCollection("privateTags", function(collectionApi) {
    const private = collectionApi.getFilteredByGlob([
      "_src/private/*.html",
      "_src/private/*.liquid",
      "_src/private/*.md"
    ]);
    return getAllTags(private);
  });

  // getAllTags function (keep as is)
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

  // Update template formats
  return {
    dir: {
      input: "_src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["html", "liquid", "md"]
  };
};