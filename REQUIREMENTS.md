# Functional Requirements

## Token Transfer
- Users should be able to transfer tokens between accounts.
- Transfers should be subject to buy/sell transaction limits and wallet size restrictions.

## Blacklisting
- The contract owner or team members should be able to blacklist and whitelist addresses.
- Blacklisted addresses should be prevented from transferring or receiving tokens.

## Fee Structure
- A portion of every transaction should be allocated to marketing and liquidity.
- Fees should be adjustable by the contract owner within predefined limits.

## Swap Back Mechanism
- The contract should automatically swap tokens for ETH when thresholds are met.
- The mechanism should respect a rate limit to prevent excessive swaps in a single block.

## Trading Activation
- Trading should be initially disabled and can only be activated by the contract owner or team members.

## Security
- The contract should prevent the transfer of funds to the zero address.
- The contract should ensure that only team members can perform critical functions.
