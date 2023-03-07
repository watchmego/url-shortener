export let urls = {};

export const store = (original, shortened) => {
    urls[shortened] = {
        id: shortened,
        "originalURL": original,
        "visitCount": 0
        };
    console.log(urls);
}