"use client";

import { useQuery } from "@apollo/client";
import { CONTRACT_QUERY_BY_OWNER } from "../../utils/query";
import ContractCard from "../ContractCards/ContractCard";
import { useAccount } from "wagmi";
import { SquareLoader } from "react-spinners";

export default function AllContracts() {
  const { address } = useAccount();

  const { loading, error, data } = useQuery(CONTRACT_QUERY_BY_OWNER, {
    variables: { owner: address },
  });

  if (loading) return <SquareLoader color="#5A72A0" />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Zora Contracts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.zoraCreateContracts.map((contract: any) => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>
    </div>
  );
}
