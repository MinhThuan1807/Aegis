// Cedra Transaction Helpers - Using @cedra-labs/ts-sdk

import { Cedra, CedraConfig, Network, Account } from "@cedra-labs/ts-sdk";

// Initialize Cedra client
export const getCedraClient = () => {
  const network = process.env.NEXT_PUBLIC_CEDRA_NETWORK === "mainnet"
    ? Network.MAINNET
    : Network.TESTNET;
  
  const config = new CedraConfig({ network });
  return new Cedra(config);
};

// Cedra contract addresses
export const CEDRA_CONTRACTS = {
  LENDING_POOL: process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS || "0x...",
  USDC_TOKEN: process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS || "0x...",
  ETH_TOKEN: process.env.NEXT_PUBLIC_ETH_TOKEN_ADDRESS || "0x...",
  NATIVE_COIN: "0x1::cedra_coin::CedraCoin" as const,
};

export type CoinType = `${string}::${string}::${string}`;

// Transaction payload builders for Cedra lending protocol
export const buildSupplyPayload = (tokenAddress: string, amount: bigint) => {
  return {
    function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::supply`,
    typeArguments: [tokenAddress],
    functionArguments: [amount.toString()],
  };
};

export const buildBorrowPayload = (tokenAddress: string, amount: bigint) => {
  return {
    function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::borrow`,
    typeArguments: [tokenAddress],
    functionArguments: [amount.toString()],
  };
};

export const buildWithdrawPayload = (tokenAddress: string, amount: bigint) => {
  return {
    function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::withdraw`,
    typeArguments: [tokenAddress],
    functionArguments: [amount.toString()],
  };
};

export const buildRepayPayload = (tokenAddress: string, amount: bigint) => {
  return {
    function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::repay`,
    typeArguments: [tokenAddress],
    functionArguments: [amount.toString()],
  };
};

// Build transfer transaction
export const buildTransferPayload = (
  recipientAddress: string,
  amount: bigint
) => {
  return {
    function: "0x1::cedra_account::transfer",
    typeArguments: [],
    functionArguments: [recipientAddress, amount.toString()],
  };
};

// Query functions using Cedra SDK

// Get account balance
export const getCedraBalance = async (
  address: string,
  coinType: CoinType = CEDRA_CONTRACTS.NATIVE_COIN
): Promise<bigint> => {
  try {
    const client = getCedraClient();
    const balance = await client.getAccountCoinAmount({
      accountAddress: address,
      coinType,
    });
    return BigInt(balance);
  } catch (error) {
    console.error("Failed to get balance:", error);
    return BigInt(0);
  }
};

// Get user lending position
export const getUserPosition = async (address: string) => {
  try {
    const client = getCedraClient();
    const result = await client.view({
      payload: {
        function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::get_user_position`,
        typeArguments: [],
        functionArguments: [address],
      },
    });
    return result;
  } catch (error) {
    console.error("Failed to get user position:", error);
    return null;
  }
};

// Get market data
export const getMarketData = async (tokenAddress: string) => {
  try {
    const client = getCedraClient();
    const result = await client.view({
      payload: {
        function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::get_market_data`,
        typeArguments: [tokenAddress],
        functionArguments: [],
      },
    });
    return result;
  } catch (error) {
    console.error("Failed to get market data:", error);
    return null;
  }
};

// Get account resources
export const getAccountResources = async (address: string) => {
  try {
    const client = getCedraClient();
    const resources = await client.getAccountResources({
      accountAddress: address,
    });
    return resources;
  } catch (error) {
    console.error("Failed to get account resources:", error);
    return [];
  }
};

// Get transaction by hash
export const getTransaction = async (txHash: string) => {
  try {
    const client = getCedraClient();
    const transaction = await client.getTransactionByHash({
      transactionHash: txHash,
    });
    return transaction;
  } catch (error) {
    console.error("Failed to get transaction:", error);
    return null;
  }
};

// Wait for transaction confirmation
export const waitForTransaction = async (
  txHash: string,
  timeoutSecs: number = 30
) => {
  try {
    const client = getCedraClient();
    const result = await client.waitForTransaction({
      transactionHash: txHash,
      options: {
        timeoutSecs,
      },
    });
    return result;
  } catch (error) {
    console.error("Transaction timeout or failed:", error);
    throw error;
  }
};

// Simulate transaction
export const simulateTransaction = async (
  senderAddress: string,
  payload: any
) => {
  try {
    const client = getCedraClient();
    
    // Create a dummy account for simulation
    const dummyAccount = Account.generate();
    
    const transaction = await client.transaction.build.simple({
      sender: senderAddress,
      data: payload,
    });

    const [simulationResult] = await client.transaction.simulate.simple({
      signerPublicKey: dummyAccount.publicKey,
      transaction,
    });

    return {
      success: simulationResult.success,
      gasUsed: parseInt(simulationResult.gas_used),
      gasUnitPrice: parseInt(simulationResult.gas_unit_price),
      totalGasCost: parseInt(simulationResult.gas_used) * parseInt(simulationResult.gas_unit_price),
      vmStatus: simulationResult.vm_status,
    };
  } catch (error) {
    console.error("Failed to simulate transaction:", error);
    return null;
  }
};

// Get chain info
export const getChainInfo = async () => {
  try {
    const client = getCedraClient();
    const chainId = await client.getChainId();
    const ledgerInfo = await client.getLedgerInfo();
    
    return {
      chainId,
      blockHeight: ledgerInfo.block_height,
      epoch: ledgerInfo.epoch,
      ledgerTimestamp: ledgerInfo.ledger_timestamp,
    };
  } catch (error) {
    console.error("Failed to get chain info:", error);
    return null;
  }
};

// Fund account from faucet (testnet only)
export const fundAccountFromFaucet = async (
  address: string,
  amount: number = 100_000_000 // 1 CEDRA
) => {
  try {
    const client = getCedraClient();
    await client.faucet.fundAccount({
      accountAddress: address,
      amount,
    });
    return true;
  } catch (error) {
    console.error("Failed to fund account:", error);
    return false;
  }
};

// Helper: Format amount for display
export const formatCedraAmount = (amount: bigint | number): string => {
  const value = Number(amount) / 100_000_000; // 1 CEDRA = 100M sub-units
  return value.toLocaleString('en-US', { 
    maximumFractionDigits: 8,
    minimumFractionDigits: 2 
  });
};

// Helper: Parse user input to sub-units
export const parseCedraAmount = (amount: string): bigint => {
  const value = parseFloat(amount) * 100_000_000;
  return BigInt(Math.floor(value));
};

// Get explorer URL
export const getExplorerUrl = (
  type: 'tx' | 'address' | 'block',
  value: string
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_CEDRA_NETWORK === "mainnet"
    ? "https://cedrascan.com"
    : "https://testnet.cedrascan.com";
  
  switch (type) {
    case 'tx':
      return `${baseUrl}/txn/${value}`;
    case 'address':
      return `${baseUrl}/account/${value}`;
    case 'block':
      return `${baseUrl}/block/${value}`;
    default:
      return baseUrl;
  }
};