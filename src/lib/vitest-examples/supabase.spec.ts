import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import ChatService from '$lib/db/ChatService';
import StorageService from '$lib/db/StorageService';
import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, beforeAll } from 'vitest';


describe("session", async () => {

    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY)


    it("iniciar sesión", async () => {
        const { data } = await supabase.auth.signInWithPassword({
            email: "loops@niumi.xyz",
            password: "fabio309309309"
        })
        expect(data.user).not.toEqual(null)
    })
    beforeAll(async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email: "loops@niumi.xyz",
            password: "fabio309309309"
        })

        expect(error).toEqual(null)
    })

    it("sube a storage un archivo de un mensaje y lo registra en la base de datos, pero sino se puede registrar, lo borra", async () => {
        const user = await supabase.auth.getUser()
        const chatService = new ChatService(supabase, 1);
        
        const file = new File(["Hola que tal"], "hola.txt");
        const {fileData} = await chatService.sendMessage({
            content: "",
            attachments: [file],
            authorId: user.data.user!.id
        })
        
        const response = await new StorageService(supabase).exists(fileData!.path)
        
        expect(response.data).toBe(false)
    })
})