"use client";
import React, { useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { createCreatorClient } from "chora-protocol-sdk";

const Create1155Contract = () => {
  const chainId = useChainId();

  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [contractAddress, setContractAddress] = useState(null);
  const [contractUri, setContractUri] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract } = useWriteContract();

  const handleCreateContract = async () => {
    if (chainId && publicClient && address) {
      setIsLoading(true);

      const creatorClient = createCreatorClient({ chainId, publicClient });

      try {
        const { parameters, contractAddress } = await creatorClient.create1155({
          contract: {
            name: "Chora Club : Stone Garden2",
            uri: "ipfs://bafkreigzpzwwdx3xwl6fn7z2nzt636v3ih43com374fbdi6cxkst2v63oa",
          },
          token: {
            tokenMetadataURI:
              "ipfs://bafkreibp5oimmwewsutwlkk4yriqxhcldzuj4hrwchq5fo4shamkw7gpue",
          },
          account: address,
        });
        console.log("client createdddd", parameters);

        writeContract(parameters);
        setContractAddress(contractAddress);
      } catch (error) {
        console.error("Error creating contract:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleCreateContract}
        style={{
          padding: "10px 20px",
          backgroundColor: isLoading ? "#ccc" : "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
        disabled={isLoading}>
        {isLoading ? "Creating..." : "Create 1155 Contract"}
      </button>

      {contractAddress && <p>Contract created at: {contractAddress}</p>}
    </div>
  );
};

export default Create1155Contract;
