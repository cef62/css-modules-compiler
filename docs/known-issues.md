# Known Issues

The compiler currently have some known limitation that we are working to resolve.

* [ ] The compiler doesn't accept more than one source folder
* [ ] Composed *css* files are not processed by **postcss** which means that, for example, `@import` statements don't get replaced
* [ ] Blacklist glob patterns must be improved to support a broader set of patterns
* [ ] Is not possible to compile the *css-modules* in more than one single output file.
