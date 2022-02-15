export const getLocalStrTime = (time: string) => {
    return new Date(time).toLocaleString()
}

export const byteToMb = (byte: number) => {
    return byte/1000000;
}