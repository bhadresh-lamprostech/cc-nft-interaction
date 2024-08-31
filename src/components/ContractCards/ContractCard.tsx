"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ContractProps {
  contract: {
    address: string;
    block: string;
    contractStandard: string;
    contractURI: string;
    contractVersion: string;
    createdAtBlock: string;
    creator: string;
    id: string;
    initialDefaultAdmin: string;
    likelyIsEdition: boolean | null;
    metadataIPFSID: string | null;
    mintFeePerQuantity: string;
    name: string;
    owner: string;
    timestamp: string;
    rendererContract: string | null;
    metadata: {
      name: string;
      image: string | null;
      id: string;
      description: string;
      decimals: number | null;
      animationUrl: string | null;
    } | null;
  };
}

const ContractCard: React.FC<ContractProps> = ({ contract }) => {
  const router = useRouter();

  return (
    <a
      href={`/watch/${contract.id}`}
      className="block bg-[#FDFFE2] shadow-lg rounded-xl p-6 mb-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-opacity-90 relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#1A2130] truncate">
            {contract.name}
          </h2>
          <span className="text-sm text-[#FDFFE2] bg-[#5A72A0] px-2 py-1 rounded-lg">
            {contract.contractStandard}
          </span>
        </div>
        <p className="text-[#5A72A0] text-sm mb-2 truncate">
          Address: {contract.address}
        </p>
        <p className="text-[#5A72A0] text-sm mb-2">
          Creator: {contract.creator}
        </p>
        <p className="text-[#5A72A0] text-sm mb-4">
          Mint Fee: {contract.mintFeePerQuantity}
        </p>

        {contract.metadata && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-[#1A2130]">Metadata</h3>
            <p className="text-[#5A72A0] text-sm mt-2">
              {contract.metadata.name}
            </p>
            <p className="text-[#5A72A0] text-sm mt-1">
              {contract.metadata.description}
            </p>
            {/* {contract.metadata.image && (
              <img
                src={contract.metadata.image}
                alt={contract.metadata.name}
                className="mt-4 rounded-lg w-full h-48 object-cover shadow-lg"
              />
            )} */}
          </div>
        )}
      </div>
      <div className="relative z-10 mt-4">
        <button
          className="w-full py-2 bg-[#83B4FF] text-[#1A2130] rounded-lg text-sm font-medium hover:bg-[#5A72A0] hover:text-[#FDFFE2] transition-colors duration-300"
          onClick={() => router.push(`/watch/${contract.id}`)}
        >
          View Details
        </button>
      </div>
    </a>
  );
};

export default ContractCard;
