import { buildAegisFunction, AEGIS_MODULES } from "./aegis-contract";

export const borrowAsset = async (
  signAndSubmitTransaction: any,
  borrowCoinType: string,
  collateralCoinType: string,
  borrowAmount: string,
  collateralAmount: string
) => {
  try {
    const response = await signAndSubmitTransaction({
      data: {
        function: buildAegisFunction(AEGIS_MODULES.BORROWING, "borrow"),
        typeArguments: [borrowCoinType, collateralCoinType],
        functionArguments: [borrowAmount, collateralAmount],
      },
    });
    
    console.log("Borrow successful:", response.hash);
    return response;
  } catch (error) {
    console.error("Borrow failed:", error);
    throw error;
  }
};