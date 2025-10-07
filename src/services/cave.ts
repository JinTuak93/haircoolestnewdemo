// services/cave.ts
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

const eventsCol = collection(db, "cave-events"); // atau `collection(caveRef, "events")` jika nested

export async function getEvents() {
  // kalau nested: const col = collection(caveRef, "events")
  const snap = await getDocs(query(eventsCol, orderBy("date", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
}

// CRUD admin (opsional kalau kamu perlukan di dashboard)
export async function addEvent(payload: {
  title: string;
  date?: string;
  location?: string;
  imageUrl?: string;
  description?: string;
  linkUrl?: string;
}) {
  const docRef = await addDoc(eventsCol, payload);
  return docRef.id;
}
export async function updateEvent(
  id: string,
  payload: Partial<{
    title: string;
    date?: string;
    location?: string;
    imageUrl?: string;
    description?: string;
    linkUrl?: string;
  }>
) {
  await updateDoc(doc(eventsCol, id), payload);
  return true;
}
export async function deleteEvent(id: string) {
  await deleteDoc(doc(eventsCol, id));
  return true;
}

/* ======================================================================
   Cloudinary Config & Helpers
   ====================================================================== */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

function assertCloudinaryEnv() {
  if (!CLOUD_NAME)
    throw new Error(
      "Cloudinary cloud name tidak ditemukan. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME."
    );
  if (!UPLOAD_PRESET)
    throw new Error(
      "Cloudinary upload preset tidak ditemukan. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
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
  if (!secureUrl) throw new Error("Cloudinary tidak mengembalikan secure_url.");
  return secureUrl;
}

export async function uploadImage(file: File, folder: string) {
  try {
    return await cloudinaryUpload(file, folder, "auto");
  } catch (e) {
    console.error("Error uploading image:", e);
    throw e;
  }
}

/* ======================================================================
   Firestore Refs
   ====================================================================== */
const adminCol = collection(db, "admin");
const caveDocRef = doc(adminCol, "cave");

const galleryCol = collection(db, "cave-gallery");
const playgroundCol = collection(db, "cave-playground");
const menuCategoriesCol = collection(db, "cave-menu-categories");
const menuItemsCol = collection(db, "cave-menu-items");

/* ======================================================================
   Types
   ====================================================================== */
export type GalleryImage = { id: string; imageUrl: string };
export type PlaygroundItem = { id: string; name: string; imageUrl: string };
export type MenuCategory = { id: string; name: string; order?: number };
export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
};

/* ======================================================================
   Header/Bio/Texts
   ====================================================================== */
export async function getTitle() {
  try {
    const snap = await getDoc(caveDocRef);
    return snap.exists() ? (snap.data().title as string) || "" : "";
  } catch (e) {
    console.error("Error getTitle:", e);
    return "";
  }
}
export async function getSubtitle() {
  try {
    const snap = await getDoc(caveDocRef);
    return snap.exists() ? (snap.data().subtitle as string) || "" : "";
  } catch (e) {
    console.error("Error getSubtitle:", e);
    return "";
  }
}
export async function setTitle(newTitle: string) {
  try {
    await setDoc(caveDocRef, { title: newTitle }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setTitle:", e);
    return false;
  }
}
export async function setSubtitle(newSubtitle: string) {
  try {
    await setDoc(caveDocRef, { subtitle: newSubtitle }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setSubtitle:", e);
    return false;
  }
}

export async function getHeaderImage() {
  try {
    const snap = await getDoc(caveDocRef);
    return snap.exists() ? (snap.data().headerImage as string) || "" : "";
  } catch (e) {
    console.error("Error getHeaderImage:", e);
    return "";
  }
}
export async function setHeaderImage(imageUrl: string) {
  try {
    await setDoc(caveDocRef, { headerImage: imageUrl }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setHeaderImage:", e);
    return false;
  }
}

export async function getBioText() {
  try {
    const snap = await getDoc(caveDocRef);
    return snap.exists() ? (snap.data().bioText as string) || "" : "";
  } catch (e) {
    console.error("Error getBioText:", e);
    return "";
  }
}
export async function setBioText(bioText: string) {
  try {
    await setDoc(caveDocRef, { bioText }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setBioText:", e);
    return false;
  }
}

export async function getDisclaimerText() {
  try {
    const snap = await getDoc(caveDocRef);
    return snap.exists() ? (snap.data().disclaimerText as string) || "" : "";
  } catch (e) {
    console.error("Error getDisclaimerText:", e);
    return "";
  }
}
export async function setDisclaimerText(disclaimerText: string) {
  try {
    await setDoc(caveDocRef, { disclaimerText }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setDisclaimerText:", e);
    return false;
  }
}

export async function getTaglineText() {
  try {
    const snap = await getDoc(caveDocRef);
    return snap.exists() ? (snap.data().taglineText as string) || "" : "";
  } catch (e) {
    console.error("Error getTaglineText:", e);
    return "";
  }
}
export async function setTaglineText(taglineText: string) {
  try {
    await setDoc(caveDocRef, { taglineText }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setTaglineText:", e);
    return false;
  }
}

export async function getBioImage() {
  try {
    const snap = await getDoc(caveDocRef);
    return snap.exists() ? (snap.data().bioImage as string) || "" : "";
  } catch (e) {
    console.error("Error getBioImage:", e);
    return "";
  }
}
export async function setBioImage(imageUrl: string) {
  try {
    await setDoc(caveDocRef, { bioImage: imageUrl }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error setBioImage:", e);
    return false;
  }
}

/* ======================================================================
   Gallery
   ====================================================================== */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const qs = await getDocs(galleryCol);
    return qs.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<GalleryImage, "id">),
    }));
  } catch (e) {
    console.error("Error getGalleryImages:", e);
    return [];
  }
}
export async function addGalleryImage(imageUrl: string) {
  try {
    const ref = await addDoc(galleryCol, { imageUrl });
    return ref.id;
  } catch (e) {
    console.error("Error addGalleryImage:", e);
    throw e;
  }
}
export async function deleteGalleryImage(id: string) {
  try {
    await deleteDoc(doc(galleryCol, id));
    return true;
  } catch (e) {
    console.error("Error deleteGalleryImage:", e);
    throw e;
  }
}

/* ======================================================================
   Playground
   ====================================================================== */
export async function getPlaygroundItems(): Promise<PlaygroundItem[]> {
  try {
    const qs = await getDocs(playgroundCol);
    return qs.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<PlaygroundItem, "id">),
    }));
  } catch (e) {
    console.error("Error getPlaygroundItems:", e);
    return [];
  }
}
export async function addPlaygroundItem(data: {
  name: string;
  imageUrl: string;
}) {
  try {
    const ref = await addDoc(playgroundCol, data);
    return ref.id;
  } catch (e) {
    console.error("Error addPlaygroundItem:", e);
    throw e;
  }
}
export async function updatePlaygroundItem(
  id: string,
  data: { name?: string }
) {
  try {
    await updateDoc(doc(playgroundCol, id), data);
    return true;
  } catch (e) {
    console.error("Error updatePlaygroundItem:", e);
    throw e;
  }
}
export async function deletePlaygroundItem(id: string) {
  try {
    await deleteDoc(doc(playgroundCol, id));
    return true;
  } catch (e) {
    console.error("Error deletePlaygroundItem:", e);
    throw e;
  }
}

/* ======================================================================
   Menu (Categories + Items)
   ====================================================================== */
export async function getMenuCategories(): Promise<MenuCategory[]> {
  try {
    const qs = await getDocs(menuCategoriesCol);
    return qs.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<MenuCategory, "id">),
    }));
  } catch (e) {
    console.error("Error getMenuCategories:", e);
    return [];
  }
}
export async function addMenuCategory(data: { name: string; order?: number }) {
  try {
    const ref = await addDoc(menuCategoriesCol, data);
    return ref.id;
  } catch (e) {
    console.error("Error addMenuCategory:", e);
    throw e;
  }
}
export async function updateMenuCategory(
  id: string,
  data: { name?: string; order?: number }
) {
  try {
    await updateDoc(doc(menuCategoriesCol, id), data);
    return true;
  } catch (e) {
    console.error("Error updateMenuCategory:", e);
    throw e;
  }
}
export async function deleteMenuCategory(id: string) {
  try {
    await deleteDoc(doc(menuCategoriesCol, id));
    return true;
  } catch (e) {
    console.error("Error deleteMenuCategory:", e);
    throw e;
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const qs = await getDocs(menuItemsCol);
    return qs.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<MenuItem, "id">),
    }));
  } catch (e) {
    console.error("Error getMenuItems:", e);
    return [];
  }
}
export async function addMenuItem(data: {
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
}) {
  try {
    const ref = await addDoc(menuItemsCol, data);
    return ref.id;
  } catch (e) {
    console.error("Error addMenuItem:", e);
    throw e;
  }
}
export async function updateMenuItem(
  id: string,
  data: { categoryId?: string; name?: string; description?: string }
) {
  try {
    await updateDoc(doc(menuItemsCol, id), data);
    return true;
  } catch (e) {
    console.error("Error updateMenuItem:", e);
    throw e;
  }
}
export async function deleteMenuItem(id: string) {
  try {
    await deleteDoc(doc(menuItemsCol, id));
    return true;
  } catch (e) {
    console.error("Error deleteMenuItem:", e);
    throw e;
  }
}
