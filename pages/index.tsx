import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { PRIMARY_PROFILE } from "../graphql";
import { useCancellableQuery } from "../hooks/useCancellableQuery";
import { AuthContext } from "../context/auth";
import CustomConnectButton from "../components/Buttons/CustomConnectButton";
function Landing() {
  // Creating a function to connect user's wallet
  const { isConnected } = useAccount();
  const { accessToken, primaryProfile, address, isLoggedIn} = useContext(AuthContext);

  useEffect(() => {
    // Connect user's wallet
    console.log("isConnected", isConnected);
    console.log("accessToken", accessToken);
    console.log("address", address);
    console.log("isLoggedIn", isLoggedIn);
    if (isConnected && accessToken && isLoggedIn ) {
      window.location.href = "/home";
    }
  }, [isConnected, primaryProfile, address, accessToken, isLoggedIn]);

  return (
    <>
      {/* Creating a hero component with black background and centering everything in the screen */}
      <section className="relative bg-background-light dark:bg-black flex flex-col h-screen justify-center items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="text-center pb-12 md:pb-16">
              <h1
                className="text-5xl text-text-light md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 dark:text-text-dark"
                data-aos="zoom-y-out"
              >
                Decentralized video sharing platform built on ARVRtise: {" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                NFTV
                </span>
              </h1>
              <div className="max-w-3xl mx-auto">
                <p
                  className="text-xl text-gray-400 mb-8"
                  data-aos="zoom-y-out"
                  data-aos-delay="150"
                >
                  NFTV - A decentralized video sharing platform built on ARVRtise using Livepeer.
                  <br></br>
                  Create, share and watch video ads, collect them to receive discounts.
                </p>
                <div className="flex justify-center">
                </div>
                <div className="flex justify-center">
                  <ConnectButton/>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
