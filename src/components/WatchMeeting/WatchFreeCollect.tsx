"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import op from "@/assets/images/daos/op.png";
import Arbritrum from "@/assets/images/daos/arbCir.png";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoArrowUpOutline } from "react-icons/io5";
import styles from "./WatchSession.module.css";
import { RxCross2 } from "react-icons/rx";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { createCollectorClient } from "chora-protocol-sdk";
import { ethers } from "ethers";

const WatchFreeCollect = ({ props }: { props: { id: string } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(true);
  const [number, setNumber] = useState(1);
  const [mintFee, setMintFee] = useState("0 ETH");
  const [totalCostEth, setTotalCostEth] = useState("0 ETH");
  const [totalPurchaseCost, setTotalPurchaseCost] = useState("0 ETH");
  const [totalPurchaseCostCurrency, setTotalPurchaseCostCurrency] =
    useState("0 USD");
  const [mintComment, setMintComment] = useState("");
  const [mintReferral, setMintReferral] = useState("");
  const [ethToUsdConversionRate, setEthToUsdConversionRate] = useState(0);

  const chainId = useChainId();
  const publicClient = usePublicClient()!;
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const collectorClient = createCollectorClient({ chainId, publicClient });

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setEthToUsdConversionRate(data.ethereum.usd);
      } catch (error) {
        console.error("Failed to fetch ETH to USD conversion rate:", error);
      }
    };

    fetchEthToUsdRate();
  }, []);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const mintFeeResult = await publicClient.readContract({
          address: props.id as `0x${string}`,
          abi: [
            {
              inputs: [],
              name: "mintFee",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
          ],
          functionName: "mintFee",
        });

        const mintFeeEth = parseFloat(ethers.formatEther(mintFeeResult));
        const totalCostEthValue = mintFeeEth * number;

        setMintFee(`${mintFeeEth} ETH`);
        setTotalCostEth(`${totalCostEthValue} ETH`);
        setTotalPurchaseCost(`${totalCostEthValue} ETH`);

        if (ethToUsdConversionRate) {
          const totalPurchaseCostCurrencyValue =
            totalCostEthValue * ethToUsdConversionRate;
          setTotalPurchaseCostCurrency(
            `${totalPurchaseCostCurrencyValue.toFixed(2)} USD`
          );
        }
      } catch (error) {
        console.error("Failed to fetch costs:", error);
      }
    };

    fetchCosts();
  }, [publicClient, props.id, number, ethToUsdConversionRate]);

  const handleMint = async () => {
    console.log("Minting...", props.id);
    try {
      const mintReferralAddress =
        mintReferral.startsWith("0x") && mintReferral.length === 42
          ? (mintReferral as `0x${string}`)
          : undefined;
      // Prepare the mint transaction
      const { parameters } = await collectorClient.mint({
        tokenContract: props.id as `0x${string}`,
        mintType: "1155",
        tokenId: 1n,
        quantityToMint: BigInt(number),
        mintComment,
        mintReferral: mintReferralAddress,
        minterAccount: address!,
      });

      // Write the mint transaction to the network
      await writeContractAsync(parameters);
    } catch (error) {
      console.error("Minting failed:", error);
    }
  };

  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="white"
      width="32"
      height="32"
      style={{
        background: "blue",
        borderRadius: "50%",
        padding: "4px",
        cursor: "pointer",
      }}
      onClick={() => setNumber(number + 1)}
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  const MinusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="white"
      width="32"
      height="32"
      style={{
        background: "blue",
        borderRadius: "50%",
        padding: "4px",
        cursor: "pointer",
      }}
      onClick={() => setNumber(number > 1 ? number - 1 : 1)}
    >
      <path
        fillRule="evenodd"
        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="rounded-3xl border border-black-shade-200 font-poppins">
      <div className="flex justify-between items-center w-full rounded-t-3xl bg-blue-shade-400 py-3 px-6">
        <div className="flex">
          <p className="font-medium xl:text-base 1.7xl:text-lg text-blue-shade-100">
            💸Free
          </p>
          {showComingSoon && (
            <div className="flex items-center bg-yellow-100 border border-yellow-400 rounded-full px-2 ml-4">
              <p className="text-sm text-yellow-700 mr-2">Coming Soon</p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="text-yellow-700 hover:text-yellow-800"
              >
                <RxCross2 size={12} />
              </button>
            </div>
          )}
        </div>
        <div className="px-2 py-1 border border-blue-shade-100 bg-blue-shade-600 w-fit rounded-md">
          <p className="text-blue-shade-100 font-medium text-sm">
            14320 Collected
          </p>
        </div>
      </div>
      <div className="w-full h-[0.1px] bg-black-shade-200"></div>
      <div className="grid grid-cols-2 1.5lg:px-6 px-3">
        <div className="flex items-center">
          <MinusIcon />
          <div className="bg-black-shade-200 py-1 px-4 1.5lg:mx-3 mx-1.5 rounded w-12 flex justify-center">
            {number}
          </div>
          <PlusIcon />
        </div>

        <button
          className={`text-white bg-black rounded-full 1.5lg:py-5 py-3 1.5lg:px-6 px-0.5 text-xs font-semibold my-6 ${
            styles["blob-btn"]
          } ${isOpen ? "bg-black-shade-700" : ""}`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Collect Now
          <span className={styles["blob-btn__inner"]}>
            <span className={styles["blob-btn__blobs"]}>
              <span className={styles["blob-btn__blob"]}></span>
              <span className={styles["blob-btn__blob"]}></span>
              <span className={styles["blob-btn__blob"]}></span>
              <span className={styles["blob-btn__blob"]}></span>
            </span>
          </span>
        </button>
      </div>

      {/* collect menu */}
      <div
        className={`w-full font-poppins ${styles.slideDown} ${
          isOpen ? styles.open : ""
        }`}
      >
        {(isOpen || !isOpen) && (
          <div className="w-full font-poppins">
            <p className="mx-6 font-normal text-xs mb-2 text-black-shade-500">
              Pay Using
            </p>
            <div className="flex justify-between mx-6 items-center bg-black-shade-300 py-1 border border-black-shade-400 px-3 rounded-xl">
              <div className="flex gap-2">
                <Image
                  src={Arbritrum}
                  alt=""
                  width={29}
                  height={29}
                  className="my-2"
                />
                <div className="flex flex-col justify-center items-start">
                  <p className="font-normal text-xs">Arbitrum</p>
                  <p className="font-normal text-[10px] text-black-shade-100">
                    {totalCostEth}
                  </p>
                </div>
              </div>
              {/* <RiArrowDropDownLine className="text-2xl" /> */}
            </div>
            <div className="w-full flex justify-center mt-2">
              <p className="text-[8px] text-black-shade-100">or</p>
            </div>
            <div className="flex justify-between mx-6 items-center bg-black-shade-300 py-1 border border-black-shade-400 px-3 rounded-xl">
              <div className="flex gap-2">
                <Image
                  src={Arbritrum}
                  alt=""
                  width={29}
                  height={29}
                  className="my-2"
                />
                <div className="flex flex-col justify-center items-start">
                  <p className="font-normal text-xs">Arbitrum</p>
                  <p className="font-normal text-[10px] text-black-shade-100">
                    {totalPurchaseCostCurrency}
                  </p>
                </div>
              </div>
              {/* <RiArrowDropDownLine className="text-2xl" /> */}
            </div>

            {/* mintReferral input field */}
            <div className="mx-6 mt-4">
              <label
                htmlFor="mintReferral"
                className="font-normal text-xs text-black-shade-500"
              >
                Mint Referral (optional)
              </label>
              <input
                id="mintReferral"
                type="text"
                value={mintReferral}
                onChange={(e) => setMintReferral(e.target.value)}
                className="w-full py-2 px-3 mt-1 bg-black-shade-300 border border-black-shade-400 rounded-xl text-sm"
                placeholder="Enter referral address"
              />
            </div>

            {/* mintComment input field */}
            <div className="mx-6 mt-4">
              <label
                htmlFor="mintComment"
                className="font-normal text-xs text-black-shade-500"
              >
                Mint Comment (optional)
              </label>
              <input
                id="mintComment"
                type="text"
                value={mintComment}
                onChange={(e) => setMintComment(e.target.value)}
                className="w-full py-2 px-3 mt-1 bg-black-shade-300 border border-black-shade-400 rounded-xl text-sm"
                placeholder="Enter a comment"
              />
            </div>

            {/* Mint button */}
            <div className="mt-6 mx-6">
              <button
                onClick={handleMint}
                className="w-full py-3 text-sm text-white bg-blue-600 rounded-xl font-semibold"
              >
                Mint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchFreeCollect;
