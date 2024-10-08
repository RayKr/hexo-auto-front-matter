'use strict';

const fs = require('hexo-fs');
const {stringify, parse} = require('./front-matter');
// debugger;
let generator = function(data) {

    if (data.layout != 'post' || !this.config.render_drafts && data.source.startsWith("_drafts/") || !this.config.auto_front_matter.enable) return data;

    let tmpPost = parse(data.raw);
    const pluginConfig = this.config.auto_front_matter;

    let updated = false;

    // parse title
    if (pluginConfig.auto_title.enable)
        updated = updated || generate_title(tmpPost, data, pluginConfig.auto_title, this.log);

    // parse date
    if (pluginConfig.auto_date.enable)
        updated = updated || generate_date(tmpPost, data, pluginConfig.auto_date, this.log);

    // parse category
    if (pluginConfig.auto_categories.enable)
        updated = updated || generate_category(tmpPost, data, pluginConfig.auto_categories, this.log);

    // parse tags
    if (pluginConfig.auto_tags.enable)
        updated = updated || generate_tags(tmpPost, data, pluginConfig.auto_tags, this.log);

    // parse cover
    if (pluginConfig.auto_cover.enable)
        updated = updated || generate_cover(tmpPost, data, pluginConfig.auto_cover, this.log);

    if (!updated) return data;

    // process post
    let postStr = stringify(tmpPost, {mode: 'yaml', prefixSeparator: '---', order: pluginConfig.order});
    fs.writeFile(data.full_source, postStr, 'utf-8');

    return data
}

let generate_category = function(tmpPost, data, conf, log) {

     // 3. generate categories from directory
    var categories = data.source.split('/');
    // 3.1 handle depth
    var depth = conf.depth || categories.length-2;
    if (depth==0) return false; // Uncategorized

    var newCategories = categories.slice(1, 1 + Math.min(depth, categories.length - 2));
    // need to see if categories was defined in front-matter
    if (tmpPost.categories) {
        let postCategories = tmpPost.categories;
        // now check if user defined categories in front-matter as an array. Otherwise if they wrote it like ```categories: work``` then it's the string type!
        if (typeof(tmpPost.categories) === "object"){
            // now convert categories to a merged string
            postCategories = tmpPost.categories.join("_"); 
        }
        // since categories is already a string, we can now compare to newCategories
        if (postCategories == newCategories.join("_")) return false;
    } 
    tmpPost.categories = newCategories
    if(conf.multiple)
        tmpPost.categories = tmpPost.categories.map(category => [category]);

    log.i("Generated: categories [%s] for post [%s]", tmpPost.categories, categories[categories.length-1]);

    return true;
}

let generate_title = function(tmpPost, data, conf, log) {
    var title = data.source.split('/');
    title = title[title.length-1].split('.')[0];

    if (conf.mode == 2) {
        if (tmpPost.title == title) return false;
        // overwrite allways
        tmpPost.title = title;
    } else if (conf.mode == 1 || conf.mode == null) {
        // overwrite only if not defined
        if (tmpPost.title) return false;
        tmpPost.title = title
    }
    log.i("Generated: title [%s] for post [%s]", tmpPost.title, title);
    return true;
}

let generate_date = function(tmpPost, data, conf, log) {
    // if date is already defined, then return
    if (tmpPost.date) return false;

    tmpPost.date = new Date();
    log.i("Generated: date [%s] for post [%s]", tmpPost.date, tmpPost.title);
    return true;
}

let generate_tags = function(tmpPost, data, conf, log) {
    if (tmpPost.tags) return false;

    // get categories from tmpPost
    let categories = tmpPost.categories || [];
    // get tags from tmpPost
    let tags = tmpPost.tags || [];
    // merge categories and tags
    let newTags = tags.concat(categories);
    // remove duplicates
    newTags = newTags.filter((item, index) => newTags.indexOf(item) === index);
    // replace tags
    tmpPost.tags = newTags;

    log.i("Generated: tags [%s] for post [%s]", tmpPost.tags, tmpPost.title);
    return true;
}

let generate_cover = function(tmpPost, data, conf, log) {
    
    // if cover is already defined, then return
    if (tmpPost.cover) return false

    // get cetoegories from tmpPost
    let categories = tmpPost.categories || [];
    // search if every category has a cover in conf.per_category, descending order
    for (let i = categories.length - 1; i >= 0; i--) {
        for (const key in conf.per_category) {
            if (conf.per_category[key][categories[i]]) {
                tmpPost.cover = conf.per_category[key][categories[i]];
                log.i("Generated: cover [%s] for post [%s]", tmpPost.cover, tmpPost.title);
                return true;
            }
        }
    }
}


module.exports = generator;