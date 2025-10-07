// services/cloud-lab.ts
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
} from "firebase/firestore";

/* ======================================================================
   Cloudinary Config & Helpers
   ====================================================================== */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/** Pastikan ENV ada supaya error jelas */
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

/** Upload helper generik */
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
  if (!secureUrl) throw new Error("Cloudinary tidak mengembalikan secure_url.");
  return secureUrl;
}

/* ======================================================================
   Firestore Refs
   ====================================================================== */
const adminCol = collection(db, "admin");
const cloudLabDocRef = doc(adminCol, "cloud-lab");

// Koleksi khusus Cloud Lab
const productsCollectionRef = collection(db, "cloudlab-products");
const partnersCollectionRef = collection(db, "cloudlab-partners");

/* ======================================================================
   Types
   ====================================================================== */
export type CLProduct = {
  id: string;
  name: string;
  imageUrl: string;
  shopee?: string;
  tokped?: string;
};
export type CLPartner = {
  id: string;
  name: string;
  imageUrl: string;
  shopee?: string;
  tokped?: string;
};

/* ======================================================================
   Header: title, subtitle, headerImage
   ====================================================================== */
export async function getTitle() {
  try {
    const snap = await getDoc(cloudLabDocRef);
    return snap.exists() ? (snap.data().title as string) || "" : "";
  } catch (e) {
    console.error("Error getTitle:", e);
    return "";
  }
}
export async function getSubtitle() {
  try {
    const snap = await getDoc(cloudLabDocRef);
    return snap.exists() ? (snap.data().subtitle as string) || "" : "";
  } catch (e) {
    console.error("Error getSubtitle:", e);
    return "";
  }
}
export async function getHeaderImage() {
  try {
    const snap = await getDoc(cloudLabDocRef);
    return snap.exists() ? (snap.data().headerImage as string) || "" : "";
  } catch (e) {
    console.error("Error getHeaderImage:", e);
    return "";
  }
}
export async function setTitle(newTitle: string) {
  try {
    await setDoc(cloudLabDocRef, { title: newTitle }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setTitle:", e);
    return false;
  }
}
export async function setSubtitle(newSubtitle: string) {
  try {
    await setDoc(cloudLabDocRef, { subtitle: newSubtitle }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setSubtitle:", e);
    return false;
  }
}
export async function setHeaderImage(imageUrl: string) {
  try {
    await setDoc(cloudLabDocRef, { headerImage: imageUrl }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setHeaderImage:", e);
    return false;
  }
}

/* ======================================================================
   Uploads
   ====================================================================== */
export async function uploadImage(file: File, folder: string) {
  try {
    return await cloudinaryUpload(file, folder, "auto");
  } catch (e) {
    console.error("Error uploading image:", e);
    throw e;
  }
}

/* ======================================================================
   Products (CRUD)
   ====================================================================== */
export async function getProducts(): Promise<CLProduct[]> {
  try {
    const qs = await getDocs(productsCollectionRef);
    return qs.docs.map((d) => {
      const data = d.data() as Omit<CLProduct, "id">;
      return { id: d.id, ...data };
    });
  } catch (e) {
    console.error("Error getProducts:", e);
    return [];
  }
}
export async function addProduct(p: {
  name: string;
  imageUrl: string;
  shopee?: string;
  tokped?: string;
}) {
  try {
    const ref = await addDoc(productsCollectionRef, p);
    return ref.id;
  } catch (e) {
    console.error("Error addProduct:", e);
    throw e;
  }
}
export async function updateProduct(
  id: string,
  data: { name?: string; shopee?: string; tokped?: string }
) {
  try {
    const ref = doc(productsCollectionRef, id);
    await updateDoc(ref, data);
    return true;
  } catch (e) {
    console.error("Error updateProduct:", e);
    throw e;
  }
}
export async function deleteProduct(id: string) {
  try {
    const ref = doc(productsCollectionRef, id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("Error deleteProduct:", e);
    throw e;
  }
}

/* ======================================================================
   Partners (CRUD)
   ====================================================================== */
export async function getPartners(): Promise<CLPartner[]> {
  try {
    const qs = await getDocs(partnersCollectionRef);
    return qs.docs.map((d) => {
      const data = d.data() as Omit<CLPartner, "id">;
      return { id: d.id, ...data };
    });
  } catch (e) {
    console.error("Error getPartners:", e);
    return [];
  }
}
export async function addPartner(p: {
  name: string;
  imageUrl: string;
  shopee?: string;
  tokped?: string;
}) {
  try {
    const ref = await addDoc(partnersCollectionRef, p);
    return ref.id;
  } catch (e) {
    console.error("Error addPartner:", e);
    throw e;
  }
}
export async function updatePartner(
  id: string,
  data: { name?: string; shopee?: string; tokped?: string }
) {
  try {
    const ref = doc(partnersCollectionRef, id);
    await updateDoc(ref, data);
    return true;
  } catch (e) {
    console.error("Error updatePartner:", e);
    throw e;
  }
}
export async function deletePartner(id: string) {
  try {
    const ref = doc(partnersCollectionRef, id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("Error deletePartner:", e);
    throw e;
  }
}
