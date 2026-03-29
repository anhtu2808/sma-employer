import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { api } from '@/apis/baseApi';
import { setRealtimePreview } from '../pages/notification/components/notification-slice';
import { toast } from "react-toastify";
import NotificationToast from '@/components/NotificationToast';
import {
    faBell, faCircleCheck, faCircleExclamation,
    faCreditCard, faFileLines, faBriefcase, faInbox,
} from '@/utils/icons';

export const useNotificationSocket = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('accessToken');
    const getIconConfig = (type) => {
        switch (type) {
            case 'SYSTEM':
                return { icon: faCircleExclamation, color: 'text-red-500', bg: 'bg-red-100' };
            case 'PAYMENT_SUCCESS':
                return { icon: faCircleCheck, color: 'text-green-500', bg: 'bg-green-100' };
            case 'PAYMENT_FAILURE':
                return { icon: faCreditCard, color: 'text-red-500', bg: 'bg-red-100' };
            case 'APPLICATION_STATUS':
                return { icon: faFileLines, color: 'text-blue-500', bg: 'bg-blue-100' };
            case 'FLAGGED_JOB':
                return { icon: faBriefcase, color: 'text-orange-500', bg: 'bg-orange-100' };
            case 'INVITATION':
                return { icon: faInbox, color: 'text-indigo-500', bg: 'bg-indigo-100' };
            default:
                return { icon: faBell, color: 'text-orange-500', bg: 'bg-orange-100' };
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
                    const iconConfig = getIconConfig(newNoti.notificationType);

                    toast(
                        <NotificationToast
                            icon={iconConfig.icon}
                            iconColor={iconConfig.color}
                            iconBg={iconConfig.bg}
                            title={newNoti.title}
                            message={newNoti.message}
                        />,
                        { icon: false, autoClose: 5000, hideProgressBar: true }
                    );

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
    }, [dispatch, token]);
};
