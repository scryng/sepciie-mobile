export async function getFileAsBlob(fileUri: string): Promise<Blob> {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    return blob;
}