"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Redirect = () => {
  const router = useRouter();
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
      <h2 className="text-2xl font-semibold mb-4">Create Contract</h2>

      <button
        className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors duration-300 bg-blue-600`}
        onClick={() => router.push(`/create-session`)}
      >
        Create Session
      </button>
    </div>
  );
};

export default Redirect;
