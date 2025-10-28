// Cedra transaction helpers - ONLY pure functions and constants

// Cedra contract addresses (update với địa chỉ thực của bạn)
export const CEDRA_CONTRACTS = {
  LENDING_POOL: "0x...", // Your lending pool address
  USDC_TOKEN: "0x6aE8fF2Df97B9b7f52E3F1e9303c7d9c6B42E5a3",
  ETH_TOKEN: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  // Add more token addresses
};

// Transaction payload builders for Move (Pure functions - no hooks)
export const buildSupplyPayload = (
  tokenAddress: string,
  amount: bigint
) => {
  return {
    function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::supply`,
    type_arguments: [tokenAddress],
    arguments: [amount.toString()],
  };
};

export const buildBorrowPayload = (
  tokenAddress: string,
  amount: bigint
) => {
  return {
    function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::borrow`,
    type_arguments: [tokenAddress],
    arguments: [amount.toString()],
  };
};

export const buildWithdrawPayload = (
  tokenAddress: string,
  amount: bigint
) => {
  return {
    function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::withdraw`,
    type_arguments: [tokenAddress],
    arguments: [amount.toString()],
  };
};

export const buildRepayPayload = (
  tokenAddress: string,
  amount: bigint
) => {
  return {
    function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::repay`,
    type_arguments: [tokenAddress],
    arguments: [amount.toString()],
  };
};

// Query functions (read-only, pure functions)
export const getCedraBalance = async (
  address: string,
  tokenAddress: string
): Promise<bigint> => {
  try {
    const response = await fetch("https://rpc.testnet.cedra.network", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "view",
        params: {
          function: `${tokenAddress}::coin::balance`,
          type_arguments: [],
          arguments: [address],
        },
        id: 1,
      }),
    });

    const data = await response.json();
    return BigInt(data.result[0] || "0");
  } catch (error) {
    console.error("Failed to get balance:", error);
    return BigInt(0);
  }
};

export const getUserPosition = async (address: string) => {
  try {
    const response = await fetch("https://rpc.testnet.cedra.network", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "view",
        params: {
          function: `${CEDRA_CONTRACTS.LENDING_POOL}::lending::get_user_position`,
          type_arguments: [],
          arguments: [address],
        },
        id: 1,
      }),
    });

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Failed to get user position:", error);
    return null;
  }
};