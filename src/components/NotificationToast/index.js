import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NotificationToast = ({ icon, iconColor = 'text-orange-500', iconBg = 'bg-orange-100', title, message }) => {
    return (
        <div className="flex gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBg}`}>
                <FontAwesomeIcon icon={icon} className={iconColor} />
            </div>
            <div className="flex-1">
                <p className="font-bold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
        </div>
    );
};


export default NotificationToast;
