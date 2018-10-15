# How to Contribute #

## Documentation ##
Setup guides, FAQ, the more information we have on the wiki the better.

## Development ##

### Tools required ###
- git
- VSCode
- Node
- [Chrome Dev Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- use fontawesome 4.7.0 icons [Fontawesome](https://fontawesome.com/v4.7.0/icons/) 
### Getting started ###

1.  Fork this project
2.  Clone (develop branch) 
3.  Run `npm install`
4.  Run `npm start` - Used to compile the UI components and copy them.
5.  Alternatively use vs code and run the Server or All builds.

### Contributing Code ###
- If you're adding a new, already requested feature, please comment on [Github Issues](https://github.com/ic3y808/MediaServerUI/issues "Github Issues") so work is not duplicated (If you want to add something not already on there, please talk to us first)
- Rebase from develop branch, don't merge
- Make meaningful commits, or squash them
- Feel free to make a pull request before work is complete, this will let us see where its at and make comments/suggest improvements
- Commit with *nix line endings for consistency (We checkout Windows and commit *nix)
- One feature/bug fix per pull request to keep things clean and easy to understand
- Use 2 spaces instead of tabs

### Pull Requesting ###
- Only make pull requests to develop, never master
- You're probably going to get some comments or questions from us, they will be to ensure consistency and maintainability
- We'll try to respond to pull requests as soon as possible, if its been a day or two, please reach out to us, we may have missed it
- Each PR should come from its own [feature branch](http://martinfowler.com/bliki/FeatureBranch.html) not develop in your fork, it should have a meaningful branch name (what is being added/fixed)
  - new-feature (Good)
  - fix-bug (Good)
  - patch (Bad)
  - develop (Bad)

If you have any questions about any of this, please let us know.