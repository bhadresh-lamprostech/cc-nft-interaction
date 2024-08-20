import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "80f19bcb7aed4906ef514af63222daa8",
  chains: [arbitrumSepolia],
  ssr: true,
});
