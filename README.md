# Destra Network ERC20 Token

This project demonstrates the testing, deployment and interaction of the DestraNetwork smart contract using Hardhat. The project includes a DSync token contract, a comprehensive test suite, and instructions for running the tests on a locally forked Ethereum mainnet.

## Getting Started

To get started with this project, you'll need to have Node.js and npm (or Yarn) installed on your machine. You'll also need to install the project's dependencies.

### Installation

1. **Clone the repository:**

    ```shell
    git clone https://github.com/DestraNetwork/DSync
    cd DSync
    ```

2. **Install dependencies:**

    ```shell
    npm install
    ```

### Running a Local Hardhat Node with Mainnet Fork

This project requires you to run tests on a local Hardhat node with a fork of the Ethereum mainnet. This is because the contract uses Uniswap router address for the mainnet.

1. **Get an Infura API key:**

    Sign up for an account at [Infura](https://infura.io/), create a new project, and get your Ethereum mainnet API key.

2. **Start a local Hardhat node with Mainnet fork:**

    Use your Infura API key to fork the mainnet:

    ```shell
    npx hardhat node --fork https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
    ```

    Replace `YOUR_INFURA_PROJECT_ID` with your actual Infura project ID.

3. **Run the tests:**

    Once your local Hardhat node is running, you can run the test suite:

    ```shell
    npx hardhat test --network localhost
    ```

    This command runs the tests on your local node, which simulates the mainnet environment.

### Other Useful Commands

- **Help:**

    Get a list of available Hardhat tasks:

    ```shell
    npx hardhat help
    ```

- **Test with Gas Report:**

    Run tests and generate a gas usage report:

    ```shell
    REPORT_GAS=true npx hardhat test --network localhost
    ```

- **Deploy with Hardhat Ignition:**

    Deploy the contract using Hardhat Ignition:

    ```shell
    npx hardhat ignition deploy ./ignition/modules/Lock.js
    ```

### Notes

- **Mainnet Forking:** This project uses Hardhat's mainnet forking feature, which allows you to simulate the Ethereum mainnet on your local machine. This is essential for testing interactions with contracts deployed on the mainnet, like Uniswap's router.

- **Hardcoded Addresses:** The Uniswap router address is hardcoded for the mainnet, so the tests will only work correctly when run in an environment that mimics the mainnet.

### Resources

- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Ethereum Mainnet Forking](https://hardhat.org/hardhat-network/guides/mainnet-forking.html)
- [Infura](https://infura.io/)


