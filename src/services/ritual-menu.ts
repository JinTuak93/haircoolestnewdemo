import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

/* ======================================================================
   Cloudinary Config & Helpers (konsisten dgn sanctuary)
   ====================================================================== */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

function assertCloudinaryEnv() {
  if (!CLOUD_NAME) {
    throw new Error(
      "Cloudinary cloud name tidak ditemukan. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME."
    );
  }
  if (!UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary upload preset tidak ditemukan. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }
}

async function cloudinaryUpload(
  file: File,
  folder: string,
  resource: "auto" | "image" | "video" = "auto"
): Promise<string> {
  assertCloudinaryEnv();

  const form = new FormData();
  form.append("file", file);
  form.append("cloud_name", `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);
  form.append(
    "upload_preset",
    `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
  );
  if (folder) form.append("folder", folder);

  const endpoint =
    resource === "video"
      ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
      : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  const res = await fetch(endpoint, { method: "POST", body: form });

  let payload: any = null;
  try {
    payload = await res.clone().json();
  } catch {
    try {
      payload = await res.text();
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    throw new Error(
      `Gagal upload ke Cloudinary (${res.status}). ${
        typeof payload === "string" ? payload : JSON.stringify(payload || {})
      }`
    );
  }

  const secureUrl = (payload && payload.secure_url) as string | undefined;
  if (!secureUrl) {
    throw new Error("Cloudinary tidak mengembalikan secure_url.");
  }
  return secureUrl;
}

/* Exposed upload for form */
export async function uploadImage(file: File, folder: string) {
  try {
    return await cloudinaryUpload(file, folder, "auto");
  } catch (e) {
    console.error("Error uploading image (ritual-menu):", e);
    throw e;
  }
}

/* ======================================================================
   Firestore Refs
   ====================================================================== */
const adminCol = collection(db, "admin");
const ritualMenuDocRef = doc(adminCol, "ritual-menus");
const servicesCol = collection(db, "ritual-services");
const membershipsCol = collection(db, "ritual-memberships");

/* ======================================================================
   Types
   ====================================================================== */
export type Service = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  order?: number;
};

export type Membership = {
  id: string;
  duration: string;
  benefits: string[];
  imageUrl?: string;
};

/* ======================================================================
   Header Text/Image
   ====================================================================== */
export async function getTitle() {
  try {
    const snap = await getDoc(ritualMenuDocRef);
    return snap.exists() ? (snap.data().title as string) || "" : "";
  } catch (e) {
    console.error("Error getting title:", e);
    return "";
  }
}
export async function setTitle(newTitle: string) {
  try {
    await setDoc(ritualMenuDocRef, { title: newTitle }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating title:", e);
    return false;
  }
}

export async function getSubtitle() {
  try {
    const snap = await getDoc(ritualMenuDocRef);
    return snap.exists() ? (snap.data().subtitle as string) || "" : "";
  } catch (e) {
    console.error("Error getting subtitle:", e);
    return "";
  }
}
export async function setSubtitle(newSubtitle: string) {
  try {
    await setDoc(ritualMenuDocRef, { subtitle: newSubtitle }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating subtitle:", e);
    return false;
  }
}

export async function getHeaderImage() {
  try {
    const snap = await getDoc(ritualMenuDocRef);
    return snap.exists() ? (snap.data().headerImage as string) || "" : "";
  } catch (e) {
    console.error("Error getting header image:", e);
    return "";
  }
}
export async function setHeaderImage(imageUrl: string) {
  try {
    await setDoc(ritualMenuDocRef, { headerImage: imageUrl }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating header image:", e);
    return false;
  }
}

/* ======================================================================
   Services CRUD
   ====================================================================== */
export async function getServices(): Promise<Service[]> {
  try {
    const q = query(servicesCol, orderBy("order", "asc"));
    const qs = await getDocs(q);
    return qs.docs.map((d) => {
      const data = d.data() as Omit<Service, "id">;
      return { id: d.id, ...data };
    });
  } catch (e) {
    console.error("Error getting services:", e);
    return [];
  }
}
export async function addService(data: {
  name: string;
  description: string;
  imageUrl: string;
  order?: number;
}) {
  try {
    const ref = await addDoc(servicesCol, data);
    return ref.id;
  } catch (e) {
    console.error("Error adding service:", e);
    throw e;
  }
}
export async function updateService(
  id: string,
  data: Partial<Omit<Service, "id" | "imageUrl">> & { imageUrl?: string }
) {
  try {
    const ref = doc(servicesCol, id);
    await updateDoc(ref, data as any);
    return true;
  } catch (e) {
    console.error("Error updating service:", e);
    throw e;
  }
}
export async function deleteService(id: string) {
  try {
    const ref = doc(servicesCol, id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("Error deleting service:", e);
    throw e;
  }
}

/* ======================================================================
   Memberships CRUD
   ====================================================================== */
export async function getMemberships(): Promise<Membership[]> {
  try {
    const qs = await getDocs(membershipsCol);
    return qs.docs.map((d) => {
      const data = d.data() as Omit<Membership, "id">;
      return { id: d.id, ...data };
    });
  } catch (e) {
    console.error("Error getting memberships:", e);
    return [];
  }
}
export async function addMembership(data: {
  duration: string;
  benefits: string[];
  imageUrl?: string;
}) {
  try {
    const ref = await addDoc(membershipsCol, data);
    return ref.id;
  } catch (e) {
    console.error("Error adding membership:", e);
    throw e;
  }
}
export async function updateMembership(
  id: string,
  data: Partial<Omit<Membership, "id">>
) {
  try {
    const ref = doc(membershipsCol, id);
    await updateDoc(ref, data as any);
    return true;
  } catch (e) {
    console.error("Error updating membership:", e);
    throw e;
  }
}
export async function deleteMembership(id: string) {
  try {
    const ref = doc(membershipsCol, id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("Error deleting membership:", e);
    throw e;
  }
}

/* ======================================================================
   Footer / CTA (booking)
   ====================================================================== */
export async function getBookingTitle() {
  try {
    const snap = await getDoc(ritualMenuDocRef);
    return snap.exists() ? (snap.data().bookingTitle as string) || "" : "";
  } catch (e) {
    console.error("Error getting bookingTitle:", e);
    return "";
  }
}
export async function setBookingTitle(v: string) {
  try {
    await setDoc(ritualMenuDocRef, { bookingTitle: v }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setting bookingTitle:", e);
    return false;
  }
}
export async function getBookingCtaText() {
  try {
    const snap = await getDoc(ritualMenuDocRef);
    return snap.exists() ? (snap.data().bookingCtaText as string) || "" : "";
  } catch (e) {
    console.error("Error getting bookingCtaText:", e);
    return "";
  }
}
export async function setBookingCtaText(v: string) {
  try {
    await setDoc(ritualMenuDocRef, { bookingCtaText: v }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setting bookingCtaText:", e);
    return false;
  }
}
