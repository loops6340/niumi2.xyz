import path from "node:path";
import { supabase } from "./supabaseClient";

export async function uploadAvatar(file: File) {
    const { data, error } = await supabase.storage.from('niumi').upload(path.join("/avatars/", file.name + "_" + crypto.randomUUID()), file)
    console.log(data, error)
    return { data, error }
}

export function getAvatarPublicURL(path: string) {

    const url = supabase.storage.from('niumi').getPublicUrl(path)
    return url.data.publicUrl;
}