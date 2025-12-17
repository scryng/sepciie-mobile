import { Alert } from "react-native";

type ConfirmationArgs = {
    title?: string,
    message: string
}

export namespace AlertService {
    export function showConfirmation(args: ConfirmationArgs) {
        const title = args.title ?? "Atenção";
        const message = args.message;

        return new Promise((resolve) => {
            Alert.alert(
                title,
                message,
                [
                    {
                        text: "Cancelar",
                        onPress: () => resolve(false),
                        style: "cancel"
                    },
                    {
                        text: "Confirmar",
                        onPress: () => resolve(true)
                    }
                ],
                {
                    cancelable: true,
                }
            );
        });
    }
}