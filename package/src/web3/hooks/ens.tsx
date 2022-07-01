import { useEthers } from "@usedapp/core";
import { getAddressFromEnsName, getEnsNameFromAddress } from "layer2";
import { useEffect, useState } from "react";
import uriToHttp from "../../utils";

export const useEnsName = (
  address: string | null | undefined
): string | null => {
  const [ensName, setEnsName] = useState<string | null>(null);
  const { library } = useEthers();

  useEffect(() => {
    const findName = async () => {
      if (library && address) {
        const name = await getEnsNameFromAddress(address, library);
        setEnsName(name);
      }
    };
    findName();
  }, [library, address]);

  return ensName;
};

export const useConnectEnsName = () => {
  const [ensName, setEnsName] = useState<string | null>(null);
  const { account, library } = useEthers();

  useEffect(() => {
    const findName = async () => {
      if (library && account) {
        const name = await getEnsNameFromAddress(account, library);
        setEnsName(name);
      }
    };
    findName();
  }, [account, library]);

  return ensName;
};

export const useEnsAddress = (name: string) => {
  const [address, setAddress] = useState<string | null>(null);
  const { library } = useEthers();

  useEffect(() => {
    const findAddress = async () => {
      if (name && library) {
        const ensAddress = await getAddressFromEnsName(name, library);
        ensAddress && setAddress(ensAddress);
      }
    };
    findAddress();
  }, [name, library]);

  return address;
};

export const useEnsAvatar = (
  addressOrName: Array<string | undefined | null>
) => {
  const { library } = useEthers();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const getEnsAvatar = async () => {
      if (library && addressOrName) {
        try {
          if (!(addressOrName.length > 0)) {
            throw new Error("addressOrName is required");
          } else {
            const resArray = await Promise.all(
              addressOrName.map((a) => a && library.getAvatar(a))
            );
            resArray.forEach((item) => {
              if (item) setAvatar(uriToHttp(item)[0]);
            });
          }
        } catch (error_) {
          setAvatar(null);
        }
      }
    };
    getEnsAvatar();
  }, [library, addressOrName]);

  return avatar;
};
