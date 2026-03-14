import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { api } from '@/apis/baseApi';
import { setRealtimePreview } from '../pages/notification/components/notification-slice';
import toast from "react-hot-toast";
import NotificationToast from '@/components/NotificationToast';

export const useNotificationSocket = () => {
    const dispatch = useDispatch();
    const getIcon = (type) => {
        switch (type) {
            case 'SYSTEM':
                return 'error_outline';

            case 'PAYMENT_SUCCESS':
                return 'check_circle';

            case 'PAYMENT_FAILURE':
                return 'payments';

            case 'APPLICATION_STATUS':
                return 'contact_page';

            case 'FLAGGED_JOB':
                return 'work_outline';

            default:
                return 'notifications';
        }
    };
    const getUserIdFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const payload = JSON.parse(jsonPayload);
            return payload.userId || payload.sub;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const socket = new SockJS("https://api.smartrecruit.tech/ws-smartrecruit");
        // const socket = new SockJS("http://localhost:8080/ws-smartrecruit");

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            onConnect: () => {
                console.log('Connected ✅');
                console.log("Connected WS 🔥");
                console.log("CONNECTED AS:", client.subscriptions);
                const userId = getUserIdFromToken(token);

                console.log("Connected ✅ - User ID:", userId);

                client.subscribe('/user/queue/notifications', (message) => {
                    console.log("🔥 WS RECEIVED:", message.body);
                    const newNoti = JSON.parse(message.body);
                    if (!newNoti?.title && !newNoti?.message) {
                        return;
                    }
                    const icon = getIcon(newNoti.notificationType);

                    toast.custom((t) => (
                        <NotificationToast
                            t={t}
                            icon={icon}
                            title={newNoti.title}
                            message={newNoti.message}
                        />
                    ), { duration: 5000 });

                    dispatch(api.util.invalidateTags(['Notifications']));
                });
            },
            onStompError: (frame) => {
                console.error('Broker error:', frame);
            }
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [dispatch]);
};