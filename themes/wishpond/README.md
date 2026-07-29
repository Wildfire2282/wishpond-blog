# Wishpond

Wishpond is a restrained, responsive Hugo theme for Chinese technical writing and personal notes.

Repository: <https://github.com/Wildfire2282/wishpond-blog>
Demo: <https://986257.xyz/>

## Requirements

- Hugo 0.164.0 or newer
- Content in the `posts` section
- The `topics` and `tags` taxonomies
- Exactly one topic and a non-empty description for every post
- Lowercase ASCII post slugs and heading IDs

## Usage

Copy this directory to `themes/wishpond`, then set:

```toml
theme = "wishpond"
```

Use `exampleSite/hugo.toml` as the minimum configuration reference. The theme supports `featured`, `toc`, `related`, and `dropCap` post parameters.

Build with:

```sh
hugo --gc --minify --panicOnWarning
```

## License

MIT. See [LICENSE](LICENSE).
