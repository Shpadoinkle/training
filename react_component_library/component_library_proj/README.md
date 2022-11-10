## Component Library Project
In this repo, the package is created.

### Training material used
- https://dev.to/alexeagleson/how-to-create-and-publish-a-react-component-library-2oe
  - Note: Refer to his git repo source code.  So much will fail if not using the exact package versions he uses.  
  - Note: use NPM as well.. so many issues using yarn that i couldnt be bothered trying to figure out.

### Npm deployment requirements
- a local `~/.npmrc` file.
  - On mac, `touch` to create if not already there.  Then `open`
  - ```
    registry=https://registry.npmjs.org/
    @Shpadoinkle:registry=https://npm.pkg.github.com/
    //npm.pkg.github.com/:_authToken=YOUR_AUTH_TOKEN
    ```
- Generate a temp token for this publish
    - create a token here: https://github.com/settings/tokens
    - only grant a short lived token, with `repo` and `write:packages` enabled. 
    - note: if creating a package from a private repo.  It will not be authorized.
        - For granting access, you can create another token with read only permissions, and give it to who needs access

### Npm deployment
- once ready, and rollup have build the package into the dist folder.
  - use `npm publish`