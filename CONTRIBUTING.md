# How to Contribute #

## Documentation ##
Setup guides, FAQ, the more information we have on the wiki the better.

## Development ##

### Tools required ###
-  git
-  VSCode
-  Node
-  [Chrome Dev Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
-  [Test Explorer UI](https://github.com/hbenl/vscode-test-explorer)

### Getting started ###

1.  Fork this project
2.  Clone 
3.  Run `npm i -g --production windows-build-tools` *windows users
4.  Run `node setup.js -i`
5.  Alternatively use vs code and run the Debug all or Release all builds.

### Icons
-  All icons should go in the common/icons directory and be in .svg format
-  after adding icons you need to run `node setup.js -f` or use vs code's rebuild fonts command

### database migrations
-  It is important to add migrations for database changes.
```
db-migrate create my-migration-name --config database.json -e dev 
```

### Contributing Code ###
-  If you're adding a new, already requested feature, please comment on [Github Issues](https://github.com/ic3y808/Alloy/issues "Github Issues") so work is not duplicated (If you want to add something not already on there, please talk to us first)
-  Rebase from develop branch, don't merge
-  Make meaningful commits, or squash them
-  Feel free to make a pull request before work is complete, this will let us see where its at and make comments/suggest improvements
-  Commit with *nix line endings for consistency (We checkout Windows and commit *nix)
-  One feature/bug fix per pull request to keep things clean and easy to understand
-  Use 2 spaces instead of tabs

### Pull Requesting ###
-  Only make pull requests to develop, never master
-  You're probably going to get some comments or questions from us, they will be to ensure consistency and maintainability
-  We'll try to respond to pull requests as soon as possible, if its been a day or two, please reach out to us, we may have missed it
-  Each PR should come from its own [feature branch](http://martinfowler.com/bliki/FeatureBranch.html) not develop in your fork, it should have a meaningful branch name (what is being added/fixed)
  -  new-feature (Good)
  -  fix-bug (Good)
  -  patch (Bad)
  -  develop (Bad)

If you have any questions about any of this, please let us know.