"use client";

import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { Address, formatEther } from "viem";
import {
  protocolRewardsABI,
  protocolRewardsAddress,
} from "chora-protocol-deployments";

export function Balance() {
  const chainId = useChainId();
  const { address } = useAccount();

  // read the balance of an account on the ProtocolRewards contract
  const { data: accountBalance, isLoading } = useReadContract({
    abi: protocolRewardsABI,
    address:
      protocolRewardsAddress[chainId as keyof typeof protocolRewardsAddress],
    functionName: "balanceOf",
    args: [address as Address],
  });

  // account that will receive the withdrawn funds
  const recipient = address;

  // withdraw amount is half of the balance
  const withdrawAmount = BigInt(accountBalance || 0) / BigInt(2);

  const { data: hash, writeContract, isPending, isError } = useWriteContract();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // write to the withdraw function on the ProtocolRewards contract
    if (!recipient) {
      console.error("Recipient address is undefined.");
      return;
    }
    writeContract({
      abi: protocolRewardsABI,
      address:
        protocolRewardsAddress[chainId as keyof typeof protocolRewardsAddress],
      functionName: "withdraw",
      args: [recipient!, withdrawAmount],
    });
  }

  if (isLoading) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
      <h2 className="text-2xl font-semibold mb-4">Withdraw Funds</h2>
      <p className="mb-4 text-gray-700">
        Account balance: {formatEther(accountBalance || 0n)} ETH
      </p>
      <form onSubmit={submit}>
        <button
          type="submit"
          disabled={isPending || isError}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors duration-300 ${
            isPending || isError
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          Withdraw {formatEther(withdrawAmount)} ETH
        </button>
        {hash && (
          <div className="mt-4 text-sm text-gray-600">
            Transaction Hash: {hash}
          </div>
        )}
      </form>
    </div>
  );
}

export default Balance;
