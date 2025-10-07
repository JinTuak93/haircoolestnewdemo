import {
  getTitle,
  getSubtitle,
  getHistoryText,
  getDisclaimerText,
  getHeaderImage,
  getSanctuaryImage,
  getBarbers,
  getGalleryImages,
  getVideoUrl, // legacy (tetap di-fetch agar kompatibel)
  getVideoTitle,
  getVideos,
  getMainVideo,
} from "@/services/sanctuary";
import { DashboardSanctuaryClient } from "./form";

export default async function DashboardSanctuaryPage() {
  const [
    title,
    subtitle,
    historyText,
    disclaimerText,
    headerImage,
    sanctuaryImage,
    barbers,
    galleryImages,
    legacyVideoUrl,
    videoTitle,
    videos,
    mainVideo,
  ] = await Promise.all([
    getTitle(),
    getSubtitle(),
    getHistoryText(),
    getDisclaimerText(),
    getHeaderImage(),
    getSanctuaryImage(),
    getBarbers(),
    getGalleryImages(),
    getVideoUrl(),
    getVideoTitle(),
    getVideos(),
    getMainVideo(),
  ]);

  return (
    <DashboardSanctuaryClient
      initialTitle={title}
      initialSubtitle={subtitle}
      initialHistoryText={historyText}
      initialDisclaimerText={disclaimerText}
      initialHeaderImage={headerImage}
      initialSanctuaryImage={sanctuaryImage}
      initialBarbers={barbers}
      initialGalleryImages={galleryImages}
      initialVideoUrl={legacyVideoUrl}
      initialVideoTitle={videoTitle}
      initialVideos={videos}
      initialMainVideo={mainVideo}
    />
  );
}
