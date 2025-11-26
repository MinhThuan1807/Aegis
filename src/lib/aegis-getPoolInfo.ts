import { Cedra, CedraConfig, Network, AccountAddress } from "@cedra-labs/ts-sdk";
import { buildAegisFunction, AEGIS_MODULES } from "./aegis-contract";
export const getPoolInfo = async (
  coinType: string
): Promise<any> => {
  try {
    const config = new CedraConfig({ network: Network.TESTNET });
    const cedra = new Cedra(config);
    
    const result = await cedra.view({
      payload: {
        function: buildAegisFunction(AEGIS_MODULES.POOL, "get_pool_info"),
        typeArguments: [coinType],
        functionArguments: [],
      },
    });
    
    return {
      totalSupply: result[0],
      totalBorrowed: result[1],
      utilizationRate: result[2],
      // ... other fields
    };
  } catch (error) {
    console.error("Failed to get pool info:", error);
    return null;
  }
};