# clend-www

## Development

```bash
yarn
yarn dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## Web3 integration
Clone the `cLend` repo and run `yarn && yarn start`. It should start a local hardhat node with the required deployed contracts.

Then one need to connect to it with metamask on `http://localhost:8545` and work on the website using the local contracts.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.js`. The page auto-updates as you edit the file.

# Static Build
```
yarn static:build
```

# Considerations
The website should be deployable on IPFS and rely on no centralized backend server.

Once in a while, it's a good idea to verify it's still working properly in offline mode using

```
yarn static:start
```

# Fleek Deployment
Base directory: Not set

Build command:

```yarn install && yarn static:build```

Publish directory:

```out```
