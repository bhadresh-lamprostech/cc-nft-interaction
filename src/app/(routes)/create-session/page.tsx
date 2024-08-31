"use client";
import React, { useState, ChangeEvent } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { createCreatorClient } from "chora-protocol-sdk";
import { TransactionReceipt } from "viem";

// import { useRouter } from "next/navigation";

function Page() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setIsLoading] = useState(false);
  const [jsonUri, setJsonUri] = useState("");
  const [contractAddress, setContractAddress] = useState(null);
  const [contractUri, setContractUri] = useState<string | null>(null);

  const chainId = useChainId();
  const publicClient = usePublicClient();
  // const router = useRouter();

  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  const apiKey = "86ba1fec.216b5626254a406ba2c9801db2b4f8b7";

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!image) {
      alert("Please select an image");
      return;
    }
    try {
      setIsLoading(true);
      console.log("Uploading image:", image);

      // Upload image to Lighthouse
      const imageUploadResponse = await lighthouse.upload([image], apiKey);
      const imageCid = imageUploadResponse.data.Hash;
      console.log("Image uploaded with CID:", imageCid);

      // Create JSON object
      const jsonData = {
        name: name,
        description: description,
        imageCid: imageCid,
      };

      // Convert JSON to Blob
      const jsonBlob = new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      });

      // Create a File from the Blob
      const jsonFile = new File([jsonBlob], "metadata.json", {
        type: "application/json",
      });

      // Upload JSON to Lighthouse
      const jsonUploadResponse = await lighthouse.upload([jsonFile], apiKey);
      const jsonCid = jsonUploadResponse.data.Hash;

      setJsonUri(jsonCid);
      setContractUri(`ipfs://${jsonCid}`);
      setIsLoading(false);

      console.log("Form submitted with JSON URI:", jsonCid);
    } catch (error) {
      console.error("Error uploading to Lighthouse:", error);
      alert("Error uploading data. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCreateContract = async () => {
    if (chainId && publicClient && address) {
      setIsLoading(true);
      console.log("Starting contract creation process...");

      await handleSubmit(); // Wait for handleSubmit to complete

      const creatorClient = createCreatorClient({ chainId, publicClient });

      console.log("Creating contract with URI:", contractUri);
      const { parameters } = await creatorClient.create1155({
        contract: {
          name: name,
          uri: contractUri || "",
        },
        token: {
          tokenMetadataURI:
            "ipfs://bafkreibp5oimmwewsutwlkk4yriqxhcldzuj4hrwchq5fo4shamkw7gpue",
        },
        account: address,
      });
      console.log("Contract created with parameters:", parameters);

      try {
        // Send the transaction and get the transaction hash
        const txHash: `0x${string}` = await writeContractAsync(parameters);

        console.log("Transaction Hash:", txHash);

        // // Retrieve the transaction receipt
        // const transactionReceipt: TransactionReceipt =
        //   await publicClient.getTransactionReceipt({
        //     hash: txHash,
        //   });
        // console.log("Transaction Receipt:", transactionReceipt);

        // Wait for the transaction to be processed
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 60 seconds (1 minute)

        // Retrieve the transaction receipt
        const transactionReceipt: TransactionReceipt =
          await publicClient.getTransactionReceipt({
            hash: txHash,
          });

        console.log("Transaction Receipt:", transactionReceipt);

        // Access the event logs
        const eventLogs = transactionReceipt.logs;
        console.log("Event Logs:", eventLogs);
        console.log("Extract address from event Logs:", eventLogs[0].address);

        setContractAddress(contractAddress);
        /*
         if (eventLogs[0].address) {
          router.push(`/watch/${eventLogs[0].address}`);
        }
        */
        console.log("Contract address set to:", contractAddress);
      } catch (error) {
        console.error("Error handling transaction:", error);
      } finally {
        setIsLoading(false);
        console.log("Contract creation process completed.");
      }
    } else {
      console.error("Chain ID, public client, or address is missing.");
    }
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
      console.log("Image selected:", files[0].name);
    } else {
      setImage(null);
      console.log("No image selected.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Contract
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Choose Image:
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
        </form>
        <button
          onClick={handleCreateContract}
          disabled={loading}
          className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? "Creating Contract..." : "Create Contract"}
        </button>
      </div>
    </div>
  );
}

export default Page;
