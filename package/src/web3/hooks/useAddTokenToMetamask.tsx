import { useEthers } from "@usedapp/core";
import { isMetaMaskProvider, TokenInfo } from "layer2";
import { useCallback, useState } from "react";
import uriToHttp from "../../utils";

export const useAddTokenToMetamask = (
  token: TokenInfo
): {
  addToken: () => void;
  success: boolean | null;
} => {
  const [success, setSuccess] = useState<boolean | null>(null);
  const { library } = useEthers();

  const addToken = useCallback(() => {
    if (library && isMetaMaskProvider(library) && token) {
      const { address, symbol, decimals, logoURI } = token;
      const logoURL = logoURI ? uriToHttp(logoURI)[0] : "";
      library.provider
        .request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: address,
              symbol: symbol,
              decimals: decimals,
              image: logoURL,
            },
          },
        })
        .then((success: any) => {
          setSuccess(success);
        })
        .catch(() => setSuccess(false));
    } else {
      setSuccess(false);
    }
  }, [library, token]);

  return { addToken, success };
};
