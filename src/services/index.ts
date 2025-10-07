import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const docRef = doc(collection(db, "admin"), "other");

export async function getField(field: string): Promise<string> {
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data()[field] || "" : "";
  } catch (error) {
    console.error(`Error getting ${field}:`, error);
    return "";
  }
}

export async function setField(field: string, value: string): Promise<boolean> {
  try {
    await setDoc(docRef, { [field]: value }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Error setting ${field}:`, error);
    return false;
  }
}
