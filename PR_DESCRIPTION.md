# PR Description: Fix Freighter Wallet Disconnection and Network Mismatch

## Problem

The Frontend app's `disconnect()` function only cleared the local Zustand wallet store, while failing to actually disconnect from Freighter. Furthermore, the application didn't detect when a user manually disconnected, switched accounts, or changed networks in the Freighter extension. This led to the app displaying the old address and signing transactions with the wrong account until the page was reloaded.

## Solution

This PR implements continuous polling of the Freighter wallet connection state and validates the current network. It automatically updates the local store when Freighter changes state and displays a warning banner if the wallet is connected to the wrong network.

## Changes

### Wallet Polling and State Management

- **`frontend/src/hooks/useWallet.ts`**: Introduced a `setInterval` hook that polls the `isWalletConnected()`, `getWalletAddress()`, and `verifyNetwork()` functions from `@stellar/freighter-api` every 3 seconds.
  - Automatically updates the store and invalidates React Query caches (`queryClient.invalidateQueries()`) if the user switches accounts in Freighter.
  - Automatically clears the local store if Freighter is disconnected.
- **`frontend/src/store/wallet-store.ts`**: Added a `networkMismatch` boolean flag to the Zustand store.

### UI Enhancements

- **`frontend/src/components/header.tsx`**: Added an amber `<AlertTriangle />` banner at the top of the header that displays when `networkMismatch` is true, prompting the user to switch their Freighter wallet to the expected network (`NEXT_PUBLIC_STELLAR_NETWORK`).
