// src/lib/aegis-lending.ts
import { buildAegisFunction, AEGIS_MODULES } from "./aegis-contract";
export const supplyAsset = async (
  signAndSubmitTransaction: any,
  coinType: string,
  amount: string
) => {
  try {
    const response = await signAndSubmitTransaction({
      data: {
        function: buildAegisFunction(AEGIS_MODULES.LENDING, "supply"),
        typeArguments: [coinType],
        functionArguments: [amount],
      },
    });
    
    console.log("Supply successful:", response.hash);
    return response;
  } catch (error) {
    console.error("Supply failed:", error);
    throw error;
  }
};