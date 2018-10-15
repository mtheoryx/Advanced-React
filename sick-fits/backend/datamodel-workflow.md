# Steps to get changes into data models

## Pure backend data model

1. datamodel.graphql edits
2. Deploy to prisma, and pull down new schema (post deploy hook)
3. Verify changes in src/generated/prisma.graphql

## Schema (for public-facing api)

_This is what your js interfaces with_

1. edit src/schema.graphl


## Tips

Use cents when storing prices to make math easier

