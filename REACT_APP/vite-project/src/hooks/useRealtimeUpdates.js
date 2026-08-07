import { useEffect, useRef } from "react";
import Cookies from "js-cookie";

const useRealtimeUpdates = (onMessage) => {
    const callbackRef = useRef(onMessage);

    useEffect(() => {
        callbackRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        const token = Cookies.get("sylluIQTokens");
        if (!token) return undefined;
        const socketUrl = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:7000/ws?token=${encodeURIComponent(token)}`;
        const socket = new WebSocket(socketUrl);
        socket.onmessage = (event) => {
            try {
                callbackRef.current(JSON.parse(event.data));
            } catch {
                // Ignore malformed realtime messages.
            }
        };
        return () => socket.close();
    }, []);
};

export default useRealtimeUpdates;
