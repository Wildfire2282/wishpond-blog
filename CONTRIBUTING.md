# Contributing

## Development

Use Hugo 0.164.0 or newer. Run the local server with:

```sh
hugo server -D
```

Before opening a pull request, run:

```sh
hugo --gc --minify --cleanDestinationDir --panicOnWarning --printPathWarnings
hugo --source themes/wishpond/exampleSite --themesDir ../.. --theme wishpond --gc --minify --panicOnWarning
```

## Content Rules

- Keep public URLs and Markdown heading IDs ASCII-only.
- Every post needs a non-empty description, a lowercase ASCII slug, and exactly one topic.
- Preserve keyboard access, reduced-motion behavior, and mobile layouts.
- Do not commit `public/`, generated resources, credentials, or local environment files.

Keep changes focused and include screenshots when visual behavior changes.
