import { Cedra, CedraConfig, Network, AccountAddress } from "@cedra-labs/ts-sdk";
import { buildAegisFunction, AEGIS_MODULES, AEGIS_RESOURCES } from "./aegis-contract";

export const getUserDeposits = async (
  userAddress: string,
  coinType: string
): Promise<string> => {
  try {
    const config = new CedraConfig({ network: Network.TESTNET });
    const cedra = new Cedra(config);
    
    // Option 1: Call view function
    const result = await cedra.view({
      payload: {
        function: buildAegisFunction(AEGIS_MODULES.POOL, "get_user_deposits"),
        typeArguments: [coinType],
        functionArguments: [userAddress],
      },
    });
    
    return result[0] as string;
  } catch (error) {
    console.error("Failed to get deposits:", error);
    return "0";
  }
};

// Option 2: Read resource directly
export const getUserDepositsFromResource = async (
  userAddress: string
): Promise<any> => {
  try {
    const config = new CedraConfig({ network: Network.TESTNET });
    const cedra = new Cedra(config);
    
    const address = AccountAddress.from(userAddress);
    const resource = await cedra.getAccountResource({
      accountAddress: address,
      resourceType: AEGIS_RESOURCES.USER_DEPOSITS,
    });
    
    return resource.data;
  } catch (error) {
    console.error("Failed to get resource:", error);
    return null;
  }
};