export const convertImageDataToFile = (name: string, data: Uint8Array, type:string) => {
    const imageData = atob(data);
    const byteString = new Uint8Array(imageData.length);
    for (let i = 0; i < imageData.length; i++) {
        byteString[i] = imageData.charCodeAt(i);
    }
    const blob = new Blob([data], { type: type });
    return new File([blob], name, { type: type });
};
// export const convertImageDataToFile = (name: string, data: Uint8Array, type: string) => {
//     const blob = new Blob([data], { type: type });
//     return new File([blob], name, { type: type });
// };

export function byteArrayToBase64(byteArray: Uint8Array): string {
    let binaryString = '';
    for (let i = 0; i < byteArray.length; i++) {
        binaryString += String.fromCharCode(byteArray[i]);
    }
    return btoa(binaryString);
}

export function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64); // Comment this if not using base64
    const bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
    // return bytes.map((byte, i) => binaryString.charCodeAt(i));
}

export function saveByteArray(filename, filetype, byte) {
    var blob = new Blob([byte], {type: filetype});
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};

export function createAndDownloadBlobFile(body, filename) {
    const blob = new Blob([body]);
    const fileName = `${filename}`;
    const link = document.createElement('a');
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    }
}