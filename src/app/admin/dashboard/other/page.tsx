import { DashboardOtherClient } from "./form";
import { getField } from "@/services";

export default async function DashboardOtherPage() {
  const email = await getField("email");
  const instagram = await getField("instagram");
  const mapKuningan = await getField("map_kuningan");
  const mapPetojo = await getField("map_petojo");

  return (
    <>
      <DashboardOtherClient
        initialEmail={email}
        initialInstagram={instagram}
        initalMapKuningan={mapKuningan}
        initalMapPetojo={mapPetojo}
      />
    </>
  );
}
