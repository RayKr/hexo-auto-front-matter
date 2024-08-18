# hexo-auto-front-matter

[![NPM version](https://badge.fury.io/js/hexo-auto-front-matter.svg)](https://www.npmjs.com/package/hexo-auto-front-matter)

Generate hexo front-matter for every post automatically.

As a Hexo user, you must be troubled with [front matter](https://hexo.io/zh-cn/docs/front-matter.html) setting for each post.
With this plugin, you don't need to set `title`, `date`, `categories`, `tags`, `cover` one by one.
`hexo-auto-front-matter` generates static post front-matter automatically based on directory/folder name, date of now and customized configuration.

## Features

- Fully integrated all the functions of [hexo-auto-category](https://github.com/xu-song/hexo-auto-category).
- Automatically generate front-matter `title` from filename when it's empty.
- Automatically generate front-matter `date` from now when it's empty.
- Automatically append all categories to tags when the tags field is empty.
- Automatically generate front-matter `cover` image path from the customized list by choose deepest nested category.
- Flexible control: every sub module has independent swith.
- Support keep original front-matter order or sort by customized order list.

## Installation

```bash
npm install hexo-auto-front-matter --save
```

## Configuration

You can configure this plugin in Hexo `_config.yml`

```yaml
# https://github.com/RayKr/hexo-auto-front-matter
auto_front_matter:
  enable: true
  # Whether to keep the original front-matter order
  # `order` is a list, which is empty by default. In this case, the updated front-matter field keeps the order in the original text.
  # When order is not empty, front-matter will be sort by the order, support less or more than the real nums of original post front-matter.
  order:
    # - title
    # - date
    # - categories
    # - tags
    # - cover
    # - description

  # Auto add title from filename
  auto_title:
    enable: true
    # Use `mode` to control Write only if title is empty, or overwrite allways.
    # 1: auto add title only empty (default) 
    # 2: overwrite allways
    mode: 1

  # Auto add date of now if empty
  auto_date:
    enable: true
  
  # Logic same as auto_category
  # https://github.com/xu-song/hexo-auto-category
  auto_categories:
    enable: true
    multiple: false
    depth:

  # Auto append categories list to tags when tags is empty
  auto_tags:
    enable: true

  # Auto add cover image path from `per_category` list
  auto_cover:
    enable: true
    # define per category's cover image path
    # It will choose the deepest category match when exist nested categories.
    per_category:
      # - Hexo: /img/xxxx.png
```

Build & preview 

```
hexo clean && hexo g && hexo s
```

## Demo

All the front-matter in [天澄拾光](https://ihave.news) are generated automatically by [`hexo-auto-front-matter`](https://github.com/raykr/hexo-auto-front-matter).


## Thanks

- [hexo-auto-category](https://github.com/xu-song/hexo-auto-category)
- [hexo-front-matter](https://github.com/hexojs/hexo-front-matter)