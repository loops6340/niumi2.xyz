function validateText(text?: string): text is string {
    return !!text && typeof(text) === "string";
} 

export function validateRegistration(user: { identificator: string, password: string }) {
    if(!validateText(user.identificator)) return new Error("Debes ingresar el @ de la cuenta");
    const nameRegex = /^[\w\-.]{0,20}$/
    if (!nameRegex.test(user.identificator)) return new Error("Existen caracteres inválidos en el nombre");
    return true;
}