import { buildAegisFunction, AEGIS_MODULES } from "./aegis-contract";

export const withdrawAsset = async (
  signAndSubmitTransaction: any,
  coinType: string,
  amount: string
) => {
  try {
    const response = await signAndSubmitTransaction({
      data: {
        function: buildAegisFunction(AEGIS_MODULES.WITHDRAW, "withdraw"),
        typeArguments: [coinType],
        functionArguments: [amount],
      },
    });
    
    console.log("Withdraw successful:", response.hash);
    return response;
  } catch (error) {
    console.error("Withdraw failed:", error);
    throw error;
  }
};