enum ChatType {
    GRUP_DM_CHANNEL,
    USER_DM_CHANNEL
}


export interface Attachment {
    filename: string;
    url: string;
    id: number,
}

export interface User {
    id: string;
    name: string;
    avatar_url: string;
    created_at: string;
}

export interface Message {
    id: string;
    content: string;
    created_at: string;
    chat_id: string;
    author: User;
    attachments: Attachment[]
}

export interface Chat {
    id: string;
    name: string;
    photo_url: string;
    type: ChatType;
    user?: User;
    members?: User[];
    last_message: Message;
    last_message_id: string;
}
