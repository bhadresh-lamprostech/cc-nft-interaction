"use client";
import React, { useState, useEffect } from "react";
import WatchSessionVideo from "./WatchSessionVideo";
import WatchSession from "./WatchSession";
import WatchFreeCollect from "./WatchFreeCollect";
import WatchLeaderBoard from "./WatchLeaderBoard";
import WatchCollectibleInfo from "./WatchCollectibleInfo";
import WatchSocialLinks from "./WatchSocialLinks";
import WatchComponentSkeletonLoader from "../SkeletonLoader/WatchComponentSkeletonLoader";
import styles from "./WatchSession.module.css";

function WatchComponentMain({ props }: { props: { id: string } }) {
  const [data, setData] = useState<any>();
  const [collection, setCollection] = useState<any>();

  const sessionDetails = {
    title: "",
    description: "",
    image: "",
  };

  useEffect(() => {
    // Commenting out the API call
    // async function fetchData() {
    //   try {
    //     const requestOptions: any = {
    //       method: "GET",
    //       redirect: "follow",
    //     };
    //     const response = await fetch(
    //       `/api/get-watch-data/${props.id}`,
    //       requestOptions
    //     );
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     const result = await response.json();
    //     console.log("result::::", result);
    //     setData(result.data[0]);
    //     setCollection(result.collection);
    //     console.log(result.data[0].video_uri.video_uri);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    // fetchData();

    // Using dummy data instead
    const dummyData = {
      _id: "6645d930b4d3f629f369566e",
      host_address: "0xc622420AD9dE8E595694413F24731Dd877eb84E1",
      attendees: [
        {
          attendee_address: "0x0Ad71c6C880fcA2c05cb78458F0b0136fd582861",
          attendee_uid:
            "0xfa62b90e7550a1d800ba68fde4e92ee5d5738cdd1130a22aa695e92a4012fa8c",
          profileInfo: {
            _id: "6645d97ab4d3f629f369566f",
            address: "0x0Ad71c6C880fcA2c05cb78458F0b0136fd582861",
            image: "",
            description: null,
            daoName: "arbitrum",
            isDelegate: true,
            displayName: "MIles_here",
            emailId: "",
            socialHandles: {
              twitter: "",
              discord: "",
              discourse: "",
              github: "",
            },
          },
        },
      ],
      slot_time: "2024-05-16T10:00:00.000Z",
      meetingId: "bmt-pxvm-dmb",
      meeting_status: "Recorded",
      joined_status: null,
      booking_status: "Approved",
      dao_name: "arbitrum",
      title: "How to draft a better proposal?",
      description: "",
      session_type: "session",
      video_uri:
        "https://huddle01.s3.amazonaws.com/recording/bmt-pxvm-dmb/1715853678906.mp4",
      uid_host:
        "0x75fb946b66df3dff654234173430897c007af4e99ffd5077fe159dc167278c24",
      thumbnail_image: "QmdKbf84HjAwFVadmQmDQE2kno5vKUgyzk3WZqfJjg9Sst",
      hostProfileInfo: {
        _id: "65e595eb1e5dab1e05c037ac",
        address: "0xc622420AD9dE8E595694413F24731Dd877eb84E1",
        image: "QmbaU24oSvkySxijNM1qV2Eq7XDkp4swQQmStP6Fyvrmv7",
        description: null,
        daoName: "arbitrum",
        isDelegate: true,
        displayName: "Euphoria",
        socialHandles: {
          twitter: "Euphoria_0077",
          discord: "eupho.7",
          discourse: "Euphoria",
          github: "Euphoria702",
        },
        emailId: "euphoria000777@gmail.com",
      },
    };

    const dummyCollection = "meetings";
    console.log("Contract Address From Props", props.id);

    setData(dummyData);
    setCollection(dummyCollection);
  }, [props.id]);

  return (
    <>
      {
        data ? (
          <div className=" 1.7xl:ps-14 lg:ps-5 ps-4 xl:ps-10">
            <div className="grid grid-cols-3 gap-y-4 gap-x-4 1.7xl:gap-x-6 pt-6 relative 1.7xl:pr-14 pr-4 lg:pr-5 xl-pr-10">
              {/* Left side */}
              <div className="sticky top-10 z-10 col-span-2 space-y-5 font-poppins pb-10">
                {/* <WatchSessionVideo
                  data={data}
                  collection={collection}
                  autoplay={true}
                  sessionDetails={sessionDetails}
                /> */}
                <WatchSession
                  data={data}
                  collection={collection}
                  sessionDetails={sessionDetails}
                />
              </div>

              {/* Right side */}
              <div
                className={`col-span-1 pb-8 ${styles.customScrollbar} gap-y-6 flex flex-col`}
              >
                <WatchFreeCollect props={props} />
                <WatchLeaderBoard />
                <WatchCollectibleInfo />
                <WatchSocialLinks data={data} collection={collection} />
              </div>
            </div>
          </div>
        ) : null
        // <WatchComponentSkeletonLoader />
      }
    </>
  );
}
export default WatchComponentMain;
