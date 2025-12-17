import { generateQrCode } from "@/services/qrcode/qrcode";
import { DataURL } from "@bwip-js/react-native";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

const defaultSize = 100;

type Props = {
    text: string,
    size?: number,
}

export default function QrCodeImage(props: Props) {
    const [isPending, setIsPending] = useState(true);
    const [dataUrl, setDataUrl] = useState<DataURL | null>(null);

    const size = props.size ?? defaultSize;

    useEffect(() => {
        setIsPending(true);
        generateQrCode(props.text)
            .then((url) => setDataUrl(url))
            .finally(() => setIsPending(false));
    }, [props.text])


    if (isPending || !dataUrl) {
        return <View style={{ width: size, height: size, aspectRatio: 1 / 1 }} />
    }


    return <Image source={dataUrl} width={size} height={size} />;
}