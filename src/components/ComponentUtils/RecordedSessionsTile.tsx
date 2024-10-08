import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import styles from "./RecordedSessionsTile.module.css";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arbitrum.jpg";
import Image, { StaticImageData } from "next/image";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
// import image from "@/assets/images/daos/thumbnail1.png";
// import user1 from "@/assets/images/user/user1.svg";
import user2 from "@/assets/images/user/user2.svg";
// import user3 from "@/assets/images/user/user3.svg";
// import user4 from "@/assets/images/user/user4.svg";
// import user5 from "@/assets/images/user/user5.svg";
// import user6 from "@/assets/images/user/user6.svg";
// import user7 from "@/assets/images/user/user7.svg";
// import user8 from "@/assets/images/user/user8.svg";
// import user9 from "@/assets/images/user/user9.svg";
import { getEnsName } from "@/utils/ENSUtils";
import logo from "@/assets/images/daos/CCLogo.png";
// import ClaimButton from "./ClaimButton";
// import EditButton from "./EditButton";
import { useAccount } from "wagmi"; 
import Link from "next/link";

interface meeting {
  meetingData: any;
  showClaimButton?: boolean;
  session?: string; 
  gridCols?: string;
}

type DaoName = "optimism" | "arbitrum";
const daoLogos: Record<DaoName, StaticImageData> = {
  optimism: oplogo,
  arbitrum: arblogo,
};
const getDaoLogo = (daoName: string): StaticImageData => {
  const normalizedName = daoName.toLowerCase() as DaoName;
  return daoLogos[normalizedName] || arblogo;
};

function RecordedSessionsTile({ meetingData , showClaimButton,session, gridCols = "2xl:grid-cols-4" }: meeting) {

  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const videoRefs = useRef<any>([]);
  const [videoDurations, setVideoDurations] = useState<any>({});
  const router = useRouter();
  const { address } = useAccount();
  const [ensHostNames, setEnsHostNames] = useState<any>({});
  const [ensGuestNames, setEnsGuestNames] = useState<any>({});
  const [loadingHostNames, setLoadingHostNames] = useState<boolean>(true);
  const [loadingGuestNames, setLoadingGuestNames] = useState<boolean>(true);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

//   const userImages = [
//     user1,
//     user2,
//     user3,
//     user4,
//     user5,
//     user6,
//     user7,
//     user8,
//     user9,
//   ];

  const [randomUserImages, setRandomUserImages] = useState<{
    [key: string]: StaticImageData;
  }>({});
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const formatTimeAgo = (utcTime: string): string => {
    const parsedTime = new Date(utcTime);
    const currentTime = new Date();
    const differenceInSeconds = Math.abs(
      (currentTime.getTime() - parsedTime.getTime()) / 1000
    );

    if (differenceInSeconds < 60) {
      return "Just now";
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.round(differenceInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.round(differenceInSeconds / 3600);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 604800) {
      const days = Math.round(differenceInSeconds / 86400);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 31536000) {
      const weeks = Math.round(differenceInSeconds / 604800);
      return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    } else {
      const years = Math.round(differenceInSeconds / 31536000);
      return `${years} year${years === 1 ? "" : "s"} ago`;
    }
  };

  const daoLogos = {
    optimism: oplogo,
    arbitrum: arblogo,
  };

  const handleTimeUpdate = (video: HTMLVideoElement, index: number) => {
    const duration = video.duration;
    const currentTime = video.currentTime;
    const progressBar = document.querySelectorAll(".progress-bar")[index];

    if (progressBar) {
      const progressDiv = progressBar as HTMLDivElement;
      const percentage = (currentTime / duration) * 100;
      progressDiv.style.width = `${percentage}%`;
    }
  };

  useEffect(() => {
    if (hoveredVideo !== null && videoRefs.current[hoveredVideo]) {
      const videoElement = videoRefs.current[hoveredVideo];
      const progressBar = document.getElementById(
        `progressBar-${hoveredVideo}`
      );

      const handleTimeUpdate = (e: any) => {
        const { currentTime, duration } = e.target;
        const progressPercentage = (currentTime / duration) * 100;

        if (progressBar) {
          progressBar.style.width = `${progressPercentage}%`;
        }
      };

      videoElement.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [hoveredVideo]);

  const handleLoadedMetadata = (index: any, e: any) => {
    const duration = e.target.duration;
    setVideoDurations((prev: any) => ({ ...prev, [index]: duration })); // Store the duration
  };

  const formatVideoDuration = (duration: any) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const formattedDuration =
      (hours > 0 ? `${hours}:` : "") +
      `${minutes.toString().padStart(2, "0")}:` +
      `${seconds.toString().padStart(2, "0")}`;

    return formattedDuration;
  };

  useEffect(() => {
    const fetchEnsNames = async () => {
      const ensNamesMap: any = {};
      for (const data of meetingData) {
        const ensNames = await getEnsName(data.host_address.toLowerCase());
        const ensName = ensNames?.ensNameOrAddress;
        if (ensName) {
          ensNamesMap[data.host_address] = ensName;
        }
      }
      setEnsHostNames(ensNamesMap);
      setLoadingHostNames(false);
    };

    if (meetingData.length > 0) {
      fetchEnsNames();
    }
  }, [meetingData]);

  useEffect(() => {
    const fetchEnsNames = async () => {
      const ensNamesMap: any = {};
      for (const data of meetingData) {
        const ensNames = await getEnsName(
          data.attendees[0]?.attendee_address.toLowerCase()
        );
        const ensName = ensNames?.ensNameOrAddress;
        if (ensName) {
          ensNamesMap[data.attendees[0]?.attendee_address] = ensName;
        }
      }
      setEnsGuestNames(ensNamesMap);
      setLoadingGuestNames(false);
    };

    if (meetingData.length > 0) {
      fetchEnsNames();
    }
  }, [meetingData]);

  return (
    <>
      <div className={`grid min-[475px]:grid-cols- md:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-10 py-8 font-poppins`}>
        {meetingData.map((data: any, index: number) => (
          <div
            key={index}
            className="border border-[#D9D9D9] rounded-3xl cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.push(`/watch/${data.meetingId}`)}}
            onMouseEnter={() => setHoveredVideo(index)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <div
              className={`w-full h-44 rounded-t-3xl bg-black object-cover object-center relative `}
            >
              {hoveredVideo === index ? (
                <div className="relative">
                  <video
                    ref={(el: any) => (videoRefs.current[index] = el)}
                    autoPlay
                    loop
                    muted
                    onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                    src={data.video_uri}
                    className="w-full h-44 rounded-t-3xl object-cover"
                  ></video>
                  <div className={styles.videoTimeline}>
                    <div className={styles.progressArea}>
                      <div
                        id={`progressBar-${index}`}
                        className={styles.progressBar}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  poster={`https://gateway.lighthouse.storage/ipfs/${data.thumbnail_image}`}
                  ref={(el: any) => (videoRefs.current[index] = el)}
                  loop
                  muted
                  onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                  src={data.video_uri}
                  className="w-full h-44 rounded-t-3xl object-cover"
                ></video>
              )}
              <div className="absolute right-2 bottom-2 text-white text-xs bg-white px-1 bg-opacity-30 rounded-sm">
                {formatVideoDuration(videoDurations[index] || 0)}
              </div>
              <div className="absolute top-2 right-2 bg-black rounded-full">
                <Image src={logo} alt="image" width={24} />
              </div>
            </div>
            <div className="px-4 py-2">
              <div
                className={`font-semibold py-1 ${styles.truncate}`}
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                }}
              >
                {data.title}
              </div>
              <div className="flex text-sm gap-3 py-1">
                <div className="bg-[#F5F5F5] flex items-center py-1 px-3 rounded-md gap-2">
                  <div>
                    <Image
                      src={getDaoLogo(data.dao_name)}
                      alt="image"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  </div>
                  <div className="capitalize">{data.dao_name}</div>
                </div>
                <div className="bg-[#F5F5F5] py-1 px-3 rounded-md">
                  {formatTimeAgo(data.slot_time)}
                </div>
              </div>
              <div className="">
                <div className="flex items-center gap-2 py-1 ps-3 text-sm">
                  <div>
                    <Image
                      src={
                        data.hostInfo?.image
                          ? `https://gateway.lighthouse.storage/ipfs/${data.hostInfo.image}`
                          : user2
                      }
                      alt="image"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                  <span className="font-medium">Host: </span>
                    <Link
                      href={`/${data.dao_name}/${data.host_address}?active=info`}
                      onClick={(event:any) => {
                        event.stopPropagation();
                      }}
                      className="cursor-pointer hover:text-blue-shade-200 ml-1"
                    >
                      {loadingHostNames
                        ? data.host_address.slice(0, 4) +
                          "..." +
                          data.host_address.slice(-4)
                        : ensHostNames[data.host_address]}
                    </Link>
                  </div>
                  <div>
                    <Tooltip
                      content="Copy"
                      placement="right"
                      closeDelay={1}
                      showArrow
                    >
                      <span className="cursor-pointer text-sm">
                        <IoCopy
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCopy(data.host_address);
                          }}
                        />
                      </span>
                    </Tooltip>
                  </div>
                </div>
                {data.attendees[0]?.attendee_address ? (
                  <div className="flex items-center gap-2 py-1 ps-3 text-sm">
                    <div className="">
                      <Image
                        src={
                          data.guestInfo?.image
                            ? `https://gateway.lighthouse.storage/ipfs/${data.attendees[0]?.guestInfo.image}`
                            : user2
                        }
                        alt="image"
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded-full object-cover object-center"
                      />
                    </div>
                    <div>
                    <span className="font-medium">Guest: </span>
                    <span>
                      {loadingGuestNames
                        ? data.attendees[0]?.attendee_address.slice(0, 4) +
                          "..." +
                          data.attendees[0]?.attendee_address.slice(-4)
                        : ensGuestNames[data.attendees[0]?.attendee_address]}
                      </span>
                    </div>
                    <div>
                      <Tooltip
                        content="Copy"
                        placement="right"
                        closeDelay={1}
                        showArrow
                      >
                        <span className="cursor-pointer text-sm">
                          <IoCopy
                            onClick={(event) => {
                              event.stopPropagation();
                              handleCopy(data.attendees[0]?.attendee_address);
                            }}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* <div className="px-4 pb-2 flex justify-center space-x-2">
          {showClaimButton && (
              <ClaimButton
                meetingId={data.meetingId}
                meetingType={data.session_type === "session" ? 2 : 1}
                startTime={data.attestations[0]?.startTime}
                endTime={data.attestations[0]?.endTime}
                dao={data.dao_name}
                address={address || ''}
                onChainId={session === "hosted"
                  ? data.onchain_host_uid
                  : data.attendees[0]?.onchain_attendee_uid}
              />
            )}
            {session==="hosted" && (
              <EditButton sessionData={data}/>
            )}
            </div> */}
          </div>
        ))}
      </div>
    </>
  );
}

export default RecordedSessionsTile;
