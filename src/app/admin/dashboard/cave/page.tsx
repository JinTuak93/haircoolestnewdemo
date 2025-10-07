import {
  getTitle,
  getSubtitle,
  getHeaderImage,
  getBioText,
  getBioImage,
  getDisclaimerText,
  getTaglineText,
  getGalleryImages,
  getPlaygroundItems,
  getMenuCategories,
  getMenuItems,
} from "@/services/cave";
import { DashboardCaveClient } from "./form";

export default async function DashboardCavePage() {
  const [
    title,
    subtitle,
    headerImage,
    bioText,
    bioImage,
    disclaimerText,
    taglineText,
    gallery,
    playground,
    categories,
    items,
  ] = await Promise.all([
    getTitle(),
    getSubtitle(),
    getHeaderImage(),
    getBioText(),
    getBioImage(),
    getDisclaimerText(),
    getTaglineText(),
    getGalleryImages(),
    getPlaygroundItems(),
    getMenuCategories(),
    getMenuItems(),
  ]);

  return (
    <DashboardCaveClient
      initialTitle={title}
      initialSubtitle={subtitle}
      initialHeaderImage={headerImage}
      initialBioText={bioText}
      initialBioImage={bioImage}
      initialDisclaimerText={disclaimerText}
      initialTaglineText={taglineText}
      initialGallery={gallery}
      initialPlayground={playground}
      initialCategories={categories}
      initialMenuItems={items}
    />
  );
}
