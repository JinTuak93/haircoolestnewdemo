import {
  getTitle,
  getSubtitle,
  getHeaderImage,
  getServices,
  getMemberships,
  getBookingTitle,
  getBookingCtaText,
} from "@/services/ritual-menu";
import { DashboardRitualMenusClient } from "./form";

export default async function DashboardRitualMenuPage() {
  const [
    title,
    subtitle,
    headerImage,
    services,
    memberships,
    bookingTitle,
    bookingCtaText,
  ] = await Promise.all([
    getTitle(),
    getSubtitle(),
    getHeaderImage(),
    getServices(),
    getMemberships(),
    getBookingTitle(),
    getBookingCtaText(),
  ]);

  return (
    <DashboardRitualMenusClient
      initialTitle={title}
      initialSubtitle={subtitle}
      initialHeaderImage={headerImage}
      initialServices={services}
      initialMemberships={memberships}
      initialBookingTitle={bookingTitle}
      initialBookingCtaText={bookingCtaText}
    />
  );
}
