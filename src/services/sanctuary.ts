// services/sanctuary.ts
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

/** Pastikan env tersedia agar error lebih jelas */
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

  // Ambil payload (kadang bukan JSON saat error)
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

/* ======================================================================
   Firestore Refs
   ====================================================================== */
const collectionRef = collection(db, "admin");
const sanctuaryDocRef = doc(collectionRef, "sanctuary");
const barbersCollectionRef = collection(db, "barbers");
const galleryCollectionRef = collection(db, "gallery");
const videosCollectionRef = collection(db, "videos");
const awardsCollectionRef = collection(db, "awards");

/* ======================================================================
   Types (membantu editor & menjaga konsistensi)
   ====================================================================== */
export type Barber = {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
};

export type GalleryImage = {
  id: string;
  imageUrl: string;
};

export type Video = {
  id: string;
  url: string;
};

export type Award = {
  id: string;
  name: string;
  imageUrl: string;
};

/* ======================================================================
   Text Content (title, subtitle, history, disclaimer)
   ====================================================================== */
export async function getTitle() {
  try {
    const snap = await getDoc(sanctuaryDocRef);
    return snap.exists() ? (snap.data().title as string) || "" : "";
  } catch (e) {
    console.error("Error getting title:", e);
    return "";
  }
}

export async function getSubtitle() {
  try {
    const snap = await getDoc(sanctuaryDocRef);
    return snap.exists() ? (snap.data().subtitle as string) || "" : "";
  } catch (e) {
    console.error("Error getting subtitle:", e);
    return "";
  }
}

export async function getHistoryText() {
  try {
    const snap = await getDoc(sanctuaryDocRef);
    return snap.exists() ? (snap.data().historyText as string) || "" : "";
  } catch (e) {
    console.error("Error getting history text:", e);
    return "";
  }
}

export async function getDisclaimerText() {
  try {
    const snap = await getDoc(sanctuaryDocRef);
    return snap.exists() ? (snap.data().disclaimerText as string) || "" : "";
  } catch (e) {
    console.error("Error getting disclaimer text:", e);
    return "";
  }
}

export async function setTitle(newTitle: string) {
  try {
    await setDoc(sanctuaryDocRef, { title: newTitle }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating title:", e);
    return false;
  }
}

export async function setSubtitle(newSubtitle: string) {
  try {
    await setDoc(sanctuaryDocRef, { subtitle: newSubtitle }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating subtitle:", e);
    return false;
  }
}

export async function setHistoryText(newHistoryText: string) {
  try {
    await setDoc(
      sanctuaryDocRef,
      { historyText: newHistoryText },
      { merge: true }
    );
    return true;
  } catch (e) {
    console.error("Error updating history text:", e);
    return false;
  }
}

export async function setDisclaimerText(newDisclaimerText: string) {
  try {
    await setDoc(
      sanctuaryDocRef,
      { disclaimerText: newDisclaimerText },
      { merge: true }
    );
    return true;
  } catch (e) {
    console.error("Error updating disclaimer text:", e);
    return false;
  }
}

/* ======================================================================
   Uploads (Image/Video)
   ====================================================================== */
export async function uploadImage(file: File, folder: string) {
  try {
    return await cloudinaryUpload(file, folder, "auto");
  } catch (e) {
    console.error("Error uploading image:", e);
    throw e;
  }
}

export async function uploadVideo(file: File) {
  try {
    return await cloudinaryUpload(file, "videos", "video");
  } catch (e) {
    console.error("Error uploading video:", e);
    throw e;
  }
}

/* ======================================================================
   Image Fields (headerImage, sanctuaryImage)
   ====================================================================== */
export async function getHeaderImage() {
  try {
    const snap = await getDoc(sanctuaryDocRef);
    return snap.exists() ? (snap.data().headerImage as string) || "" : "";
  } catch (e) {
    console.error("Error getting header image:", e);
    return "";
  }
}

export async function getSanctuaryImage() {
  try {
    const snap = await getDoc(sanctuaryDocRef);
    return snap.exists() ? (snap.data().sanctuaryImage as string) || "" : "";
  } catch (e) {
    console.error("Error getting sanctuary image:", e);
    return "";
  }
}

export async function setHeaderImage(imageUrl: string) {
  try {
    await setDoc(sanctuaryDocRef, { headerImage: imageUrl }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating header image:", e);
    return false;
  }
}

export async function setSanctuaryImage(imageUrl: string) {
  try {
    await setDoc(
      sanctuaryDocRef,
      { sanctuaryImage: imageUrl },
      { merge: true }
    );
    return true;
  } catch (e) {
    console.error("Error updating sanctuary image:", e);
    return false;
  }
}

/* ======================================================================
   Barbers (CRUD)
   ====================================================================== */
export async function getBarbers(): Promise<Barber[]> {
  try {
    const qs = await getDocs(barbersCollectionRef);
    return qs.docs.map((d) => {
      const data = d.data() as Omit<Barber, "id">;
      return { id: d.id, ...data };
    });
  } catch (e) {
    console.error("Error getting barbers:", e);
    return [];
  }
}

export async function addBarber(barberData: {
  name: string;
  position: string;
  imageUrl: string;
}) {
  try {
    const ref = await addDoc(barbersCollectionRef, barberData);
    return ref.id;
  } catch (e) {
    console.error("Error adding barber:", e);
    throw e;
  }
}

export async function updateBarber(
  id: string,
  data: { name: string; position: string }
) {
  try {
    const ref = doc(barbersCollectionRef, id);
    await updateDoc(ref, data);
    return true;
  } catch (e) {
    console.error("Error updating barber:", e);
    throw e;
  }
}

export async function deleteBarber(id: string) {
  try {
    const ref = doc(barbersCollectionRef, id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("Error deleting barber:", e);
    throw e;
  }
}

/* ======================================================================
   Gallery (CRUD)
   ====================================================================== */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const qs = await getDocs(galleryCollectionRef);
    return qs.docs.map((d) => {
      const data = d.data() as Omit<GalleryImage, "id">;
      return { id: d.id, ...data };
    });
  } catch (e) {
    console.error("Error getting gallery images:", e);
    return [];
  }
}

export async function addGalleryImage(imageUrl: string) {
  try {
    const ref = await addDoc(galleryCollectionRef, { imageUrl });
    return ref.id;
  } catch (e) {
    console.error("Error adding gallery image:", e);
    throw e;
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    const ref = doc(galleryCollectionRef, id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("Error deleting gallery image:", e);
    throw e;
  }
}

/* ======================================================================
   Video Title & Main Video
   ====================================================================== */
export async function getVideoTitle() {
  try {
    const snap = await getDoc(sanctuaryDocRef);
    return snap.exists() ? (snap.data().videoTitle as string) || "" : "";
  } catch (e) {
    console.error("Error getting video title:", e);
    return "";
  }
}

export async function setVideoTitle(videoTitle: string) {
  try {
    await setDoc(sanctuaryDocRef, { videoTitle }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating video title:", e);
    return false;
  }
}

export async function getMainVideo(): Promise<{
  id: string;
  url: string;
} | null> {
  try {
    const snap = await getDoc(sanctuaryDocRef);
    if (!snap.exists()) return null;

    const mv = snap.data().mainVideo;
    if (!mv) return null;

    if (typeof mv === "object" && mv.id && mv.url)
      return mv as { id: string; url: string };
    if (typeof mv === "string") return { id: "main-video", url: mv }; // legacy support
    return null;
  } catch (e) {
    console.error("Error getting main video:", e);
    return null;
  }
}

export async function setMainVideo(
  videoData: { id: string; url: string } | null
) {
  try {
    await setDoc(sanctuaryDocRef, { mainVideo: videoData }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating main video:", e);
    return false;
  }
}

/* ======================================================================
   Videos (list)
   ====================================================================== */
export async function getVideos(): Promise<Video[]> {
  try {
    const qs = await getDocs(videosCollectionRef);
    return qs.docs.map((d) => {
      const data = d.data() as Omit<Video, "id">;
      return { id: d.id, ...data };
    });
  } catch (e) {
    console.error("Error getting videos:", e);
    return [];
  }
}

export async function addVideo(videoUrl: string) {
  try {
    const ref = await addDoc(videosCollectionRef, { url: videoUrl });
    return ref.id;
  } catch (e) {
    console.error("Error adding video:", e);
    throw e;
  }
}

export async function deleteVideo(id: string) {
  try {
    const ref = doc(videosCollectionRef, id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("Error deleting video:", e);
    throw e;
  }
}

/* ======================================================================
   Legacy single video url (dipertahankan untuk kompatibilitas)
   ====================================================================== */
export async function getVideoUrl() {
  try {
    const snap = await getDoc(sanctuaryDocRef);
    return snap.exists() ? (snap.data().videoUrl as string) || "" : "";
  } catch (e) {
    console.error("Error getting video url:", e);
    return "";
  }
}

export async function setVideoUrl(videoUrl: string) {
  try {
    await setDoc(sanctuaryDocRef, { videoUrl }, { merge: true });
    return true;
  } catch (e) {
    console.error("Error updating video url:", e);
    return false;
  }
}

/* ======================================================================
   Awards (CRUD)
   ====================================================================== */
export async function getAwards(): Promise<Award[]> {
  try {
    const qs = await getDocs(awardsCollectionRef);
    return qs.docs.map((d) => {
      const data = d.data() as Omit<Award, "id">;
      return { id: d.id, ...data };
    });
  } catch (e) {
    console.error("Error getting awards:", e);
    return [];
  }
}

export async function addAward(awardData: { name: string; imageUrl: string }) {
  try {
    const ref = await addDoc(awardsCollectionRef, awardData);
    return ref.id;
  } catch (e) {
    console.error("Error adding award:", e);
    throw e;
  }
}

export async function updateAward(id: string, data: { name: string }) {
  try {
    const ref = doc(awardsCollectionRef, id);
    await updateDoc(ref, data);
    return true;
  } catch (e) {
    console.error("Error updating award:", e);
    throw e;
  }
}

export async function deleteAward(id: string) {
  try {
    const ref = doc(awardsCollectionRef, id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("Error deleting award:", e);
    throw e;
  }
}
