import { InputEntryFunctionData } from "@cedra-labs/ts-sdk";

/**
 * Pad address to 64 hex chars (excluding 0x)
 */
export function padAddress(address: string): string {
  let hex = address.startsWith("0x") ? address.slice(2) : address;
  hex = hex.padStart(64, "0");
  return "0x" + hex;
}

/**
 * Convert number to padded hex string
 */
export function padNumber(num: string | number): string {
  const numValue = typeof num === "string" ? BigInt(num) : BigInt(num);
  let hex = numValue.toString(16);
  hex = hex.padStart(64, "0");
  return "0x" + hex;
}

// Pool contract address (from smart contract)
export const POOL_ADDRESS_RAW =
  "0xd5065d0af1a1adec233de5f30dc78f28f26063e387d17ab50f91bdc52e58c8e9";

export const POOL_ADDRESS = padAddress(POOL_ADDRESS_RAW);

// Cedra Coin Type
export const CEDRA_COIN_TYPE = "0x1::cedra_coin::CedraCoin";

// Decimals for Cedra
export const CEDRA_DECIMALS = 8;

/**
 * Convert human-readable amount to smallest unit
 * Example: 1 CEDRA → 100000000
 */
export function toSmallestUnit(amount: string | number): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return Math.floor(numAmount * Math.pow(10, CEDRA_DECIMALS)).toString();
}

/**
 * Convert smallest unit to human-readable
 * Example: 100000000 → 1
 */
export function fromSmallestUnit(amount: string | number): string {
  const numAmount = typeof amount === "string" ? parseInt(amount) : amount;
  return (numAmount / Math.pow(10, CEDRA_DECIMALS)).toFixed(CEDRA_DECIMALS);
}

/**
 * Build Supply Transaction
 * Calls aegis_mvp::pool::supply
 */
export function buildSupplyTransaction(amount: string): InputEntryFunctionData {
  const amountInSmallestUnit = toSmallestUnit(amount);

  console.log("🏗️ Building supply transaction:", {
    poolAddress: POOL_ADDRESS_RAW,
    humanAmount: amount,
    smallestUnit: amountInSmallestUnit,
  });

  return {
    function: `${POOL_ADDRESS_RAW}::pool::supply`,
    typeArguments: [CEDRA_COIN_TYPE],
    functionArguments: [
      POOL_ADDRESS_RAW, // pool_addr
      amountInSmallestUnit, // amount
    ],
  };
}

/**
 * Build Withdraw Transaction
 * Calls aegis_mvp::pool::withdraw
 */
export function buildWithdrawTransaction(amount: string): InputEntryFunctionData {
  const amountInSmallestUnit = toSmallestUnit(amount);

  return {
    function: `${POOL_ADDRESS_RAW}::pool::withdraw`,
    typeArguments: [CEDRA_COIN_TYPE],
    functionArguments: [POOL_ADDRESS_RAW, amountInSmallestUnit],
  };
}

/**
 * Build Borrow Transaction
 * Calls aegis_mvp::pool::borrow
 */
export function buildBorrowTransaction(amount: string): InputEntryFunctionData {
  const amountInSmallestUnit = toSmallestUnit(amount);

  return {
    function: `${POOL_ADDRESS_RAW}::pool::borrow`,
    typeArguments: [CEDRA_COIN_TYPE],
    functionArguments: [POOL_ADDRESS_RAW, amountInSmallestUnit],
  };
}

/**
 * Build Repay Transaction
 * Calls aegis_mvp::pool::repay
 */
export function buildRepayTransaction(amount: string): InputEntryFunctionData {
  const amountInSmallestUnit = toSmallestUnit(amount);

  return {
    function: `${POOL_ADDRESS_RAW}::pool::repay`,
    typeArguments: [CEDRA_COIN_TYPE],
    functionArguments: [POOL_ADDRESS_RAW, amountInSmallestUnit],
  };
}

/**
 * Pool stats interface
 */
export interface PoolStats {
  totalSupply: string;
  totalBorrows: string;
  available: string;
  interestRate: string;
}

/**
 * User position interface
 */
export interface UserPosition {
  supplied: string;
  borrowed: string;
  collateralRatio: string;
}