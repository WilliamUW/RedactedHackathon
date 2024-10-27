# Near Go Contract

https://testnet.nearblocks.io/address/neargoredacted.testnet

https://hallowed-wizard-xrvgvxjvrx4fpw6q.github.dev/

## How to Build Locally?

```bash
cargo near build --no-locked --no-docker
```

## How to Deploy?

```bash
# Create a new account
cargo near create-dev-account

# Deploy the contract on it
cargo near deploy neargoredacted.testnet --no-locked --no-docker
```