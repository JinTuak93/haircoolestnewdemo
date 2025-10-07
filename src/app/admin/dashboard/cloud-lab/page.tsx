import {
  getTitle,
  getSubtitle,
  getHeaderImage,
  getProducts,
  getPartners,
} from "@/services/cloud-lab";
import { DashboardCloudLabClient } from "./form";

export default async function DashboardCloudLabPage() {
  const [title, subtitle, headerImage, products, partners] = await Promise.all([
    getTitle(),
    getSubtitle(),
    getHeaderImage(),
    getProducts(),
    getPartners(),
  ]);

  return (
    <DashboardCloudLabClient
      initialTitle={title}
      initialSubtitle={subtitle}
      initialHeaderImage={headerImage}
      initialProducts={products}
      initialPartners={partners}
    />
  );
}
