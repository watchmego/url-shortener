export const generateString = () => {
    let string = '';
    const strLen = 5;
    const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charLen = characters.length;
    for(let i = 0; i < strLen; i++) {
        string += characters.charAt(Math.floor(Math.random() * charLen));
    }
    return string;
}