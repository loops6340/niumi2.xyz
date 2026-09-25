import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import ChatService, { ChatsService } from '$lib/db/ChatService';
import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, beforeAll } from 'vitest';


describe("session", async () => {

    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY)


    it("iniciar sesión", async () => {
        const { data } = await supabase.auth.signInWithPassword({
            email: "loopstest@niumi.xyz",
            password: "fabio309"
        })
        expect(data.user).not.toEqual(null)
    })

    beforeAll(async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email: "loopstest@niumi.xyz",
            password: "fabio309"
        })

        expect(error).toEqual(null)
    })

    // it("sube a storage un archivo de un mensaje y lo registra en la base de datos, pero sino se puede registrar, lo borra", async () => {
    //     const user = await supabase.auth.getUser()
    //     const chatService = new ChatService(supabase, 1);
        
    //     const file = new File(["Hola que tal"], "hola.txt");
    //     const id = crypto.randomUUID()
    //     const {fileData} = await chatService.sendMessage({
    //         id,
    //         content: "",
    //         attachments: [file],
    //         authorId: user.data.user!.id
    //     })
        
    //     const response = await new StorageService(supabase).exists(fileData!.path)
        
    //     expect(response.data).toBe(false)
    // })

    it("Se deberían devolver todos los chats", async () => {
        const chatsService = new ChatsService(supabase)
        const { data, error } = await chatsService.getAll()
        expect(error).toBe(null)
        expect(data.length).toBeGreaterThan(-1)
    })

    it("Se deberian devolver todos los mensajes de un chat", async () => {
        const chatService = new ChatService(supabase, "d4f2a9c3-4e50-4b91-adbb-379bae5625cf");
        const { data, error } = await chatService.getMessages()
        expect(error).toBe(null)
        expect(data?.length).toBeGreaterThan(-1)
    })

    it("se debería dar un error al crear un chat entre usuario inexistente 1 y 2", async () => {
        const chatsService = new ChatsService(supabase)
        const error = await chatsService.createDMChat("", "")
        expect(error).not.toBe(null)
    })

    it("se debería dar un error al crear un chat entre un usuario y él mismo", async () => {
        const chatsService = new ChatsService(supabase)
        const error = await chatsService.createDMChat("20ed8825-e287-496b-8912-d48c57f4589a", "20ed8825-e287-496b-8912-d48c57f4589a")
        expect(error).not.toBe(null)
    })
    

    // it("se debería crear un chat entre usuario 1 y 2", async () => {
    //     const chatsService = new ChatsService(supabase)
    //     const error = await chatsService.createDMChat("20ed8825-e287-496b-8912-d48c57f4589a", "9244ad2f-ba2a-49e7-95f3-67b1193e8264")
    //     expect(error?.error).toBe(undefined)
    // })s
    // it("Deberia verificar que el chat entre yo y alguien exista", async () => {
    //     const chatsService = new ChatsService(supabase)
    //     const { data, error } = await chatsService.getDMChat("9244ad2f-ba2a-49e7-95f3-67b1193e8264")
    //     expect(error).toBe(null)
    //     expect(data).not.toBe(null)
    //     console.debug(data)
    // })

    // it("deberia unirse a un canal", async () => {
    //     const chatsService = new ChatsService(supabase)
    //     await chatsService.joinToDMChat("d4f2a9c3-4e50-4b91-adbb-379bae5625cf")
    //     expect
    // })
})