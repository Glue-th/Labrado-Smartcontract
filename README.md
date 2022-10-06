# Documents Smart Contract

## I. Steps Deploy contract

### 1. Setup variable environment

Copy file [`.env.example`](./.env.example) to file `.env` and fill full information `.env`:

```js
BSC_TESTNET_DEPLOYER_PRIVATE_KEY=
BSC_MAINNET_DEPLOYER_PRIVATE_KEY=
BSCSCAN_API_KEY=
CHAIN_ID=
```

### 2. Determine the network to which you will deploy

All network setuped in [`hardhat.config.js`](./hardhat.config.js#L59)

```js
...
networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      gasLimit: 6000000000,
      defaultBalanceEther: "100000",
      chainId: 31337,
    },
    bsctestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [process.env.BSC_TESTNET_DEPLOYER_PRIVATE_KEY],
      gasLimit: 30000000,
      chainId: 97,
    },
    bscmainnet: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [process.env.BSC_MAINNET_DEPLOYER_PRIVATE_KEY],
      gasLimit: 30000000,
      chainId: 56,
    },
},
...
```

### 3. Scripts deploy and run scripts

Scripts in folder `/scripts` and has been numbered deploy from `01_` to `n_`.
It is also the order in which we will deploy if we want to deploy all the project's contracts. Or you can also run one of the scripts to specify deploying some contracts instead of all.

Try running some of the following tasks:

```shell
npx hardhat run --network <name-network> scripts/<file-script>
```

**Example**:

```shell
npx hardhat run --network bsctestnet scripts/01_deployLabradoToken.js
```

```shell
npx hardhat run --network bsctestnet scripts/02_deployTestUSDC.js
```

```shell
npx hardhat run --network bsctestnet scripts/03_deployNFTs.js
```

- `<name-network>` is `bsctestnet` can select `networks` in [`hardhat.config.js`](./hardhat.config.js#L59)

- `<file-script>` is `01_deployLabradoToken.js`, `02_deployTestUSDC.js`, `03_deployNFTs.js`


## II. Roles and functions change

| Smart contract 	| Role now 	| Function Change Owner 	|
|---	|---	|---	|
| <br>LabradoToken 	| <br>- Admin(mint/change Owner): Deployer 	| <br>- renounceOwnership: change to address zero<br> <br>- transferOwnership: change to address other<br> 	|
| <br>Excalibur 	| <br>- Admin(mint/change Owner): Deployer<br> 	| <br>- renounceOwnership: change to address zero<br> <br>- transferOwnership: change to address other<br> 	|
| <br>NFTs(Amulet, Weapon, Gem,..) 	| <br>- Admin(grant_role, revoke_role, setBaseURI): Deployer<br><br>- Minter(mint, mintBatch): Deployer 	| <br>- grantRole <br><br>- revokeRole<br><br>- renounceRole<br> 	|
| <br>LabradoOperator 	| <br>- Admin(grant_role, revoke_roke and all function setting): Deployer 	| <br>- grantRole <br><br>- revokeRole <br><br>- renounceRole<br> 	|
| <br>LabradoFactory 	| <br>- Admin(set_new_admin, create_pair, set_fee_to, set_fee_swap_pair, <br>set router, set public swap or add liquidity,...): Deployer<br> 	| <br>- setNewAdmin<br> 	|
| <br>LabradoRouter02 	| <br>- Admin(set_new_signer, set_new_admin, set_opent_public_swap, <br>add_liquidity, get_user_none,...)<br><br> 	| <br>- setNewAdmin<br> 	|