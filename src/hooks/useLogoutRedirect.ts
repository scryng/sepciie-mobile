import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useApi } from "./useApi";

export function useLogoutRedirect(): void {
    const { logout } = useApi();

    const compareTimestamps = async () => {
        try {
            const loginTimestampStr = await AsyncStorage.getItem("lastLoginTimestamp");
            const logoutTimestampStr = await AsyncStorage.getItem("lastLogoutTimestamp");
    
            if (loginTimestampStr == null || logoutTimestampStr == null) {
                return;
            }
    
            const loginTimestamp = Number.parseInt(loginTimestampStr);
            const logoutTimestamp = Number.parseInt(logoutTimestampStr);
    
            if (logoutTimestamp > loginTimestamp) {
                Alert.alert("Atenção", "Login realizado em outro dispositivo");
                await AsyncStorage.multiRemove(["lastLogoutTimestamp", "lastLoginTimestamp"]);
                await logout();
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            compareTimestamps();
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);
}