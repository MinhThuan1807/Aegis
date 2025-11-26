
export const AEGIS_PROTOCOL = {
  ADDRESS: "0xfdf893d3830f5b427bb00663f6771011aafbd6f8485ad84417a464faed5969dba",
  PACKAGE_NAME: "aegis",
} as const;

// Module names
export const AEGIS_MODULES = {
  LENDING: "lending",
  BORROWING: "borrowing",
  WITHDRAW: "withdraw",
  COLLATERAL: "collateral",
  POOL: "pool",
  POOL_MANAGER: "pool_manager",
  ORACLE: "oracle",
  INTEREST_PAYMENT: "interest_payment",
  INTEREST_REPAYMENT: "interest_repayment",
  CONSTANTS: "constants",
} as const;

// Helper to build function ID
export const buildAegisFunction = (
  moduleName: string,
  functionName: string
) => {
  return `${AEGIS_PROTOCOL.ADDRESS}::${moduleName}::${functionName}` as const;
};

// Resource types
export const AEGIS_RESOURCES = {
  POOL: `${AEGIS_PROTOCOL.ADDRESS}::pool::Pool`,
  USER_DEPOSITS: `${AEGIS_PROTOCOL.ADDRESS}::pool::UserDeposits`,
} as const;

// Supported coins (cần xem trong code để biết chính xác)
export const SUPPORTED_COINS = {
  CEDRA: "0x1::cedra_coin::CedraCoin",
  // Thêm các coins khác sau khi xem code
} as const;