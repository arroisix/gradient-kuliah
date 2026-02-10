import Button from 'commons/components/elements/Button';
import {
    downloadICSFile,
    generateGoogleCalendarLink,
    generateOutlookCalendarLink,
    generateYahooCalendarLink,
    openCalendarLink
} from 'commons/utils/calendar';
import { FaApple, FaGoogle, FaMicrosoft, FaYahoo } from 'react-icons/fa';

type AddToCalendarModalProps = {
    liveClassName: string;
    liveClassDescription: string;
    startTime: Date;
    duration: number; // in minutes
    meetLink: string;
};

function AddToCalendarModal({
    liveClassName,
    liveClassDescription,
    startTime,
    duration,
    meetLink
}: AddToCalendarModalProps): JSX.Element {
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const calendarEvent = {
        title: `Live Class: ${liveClassName}`,
        description: `${liveClassDescription}\n\nLink Meeting: ${meetLink}`,
        location: meetLink,
        startTime,
        endTime
    };

    const handleAddToCalendar = (
        provider: 'google' | 'outlook' | 'yahoo' | 'apple'
    ) => {
        switch (provider) {
            case 'google':
                openCalendarLink(generateGoogleCalendarLink(calendarEvent));
                break;
            case 'outlook':
                openCalendarLink(generateOutlookCalendarLink(calendarEvent));
                break;
            case 'yahoo':
                openCalendarLink(generateYahooCalendarLink(calendarEvent));
                break;
            case 'apple':
                downloadICSFile(
                    calendarEvent,
                    `${liveClassName.replace(/\s+/g, '-')}.ics`
                );
                break;
        }
    };

    const calendarOptions = [
        {
            name: 'Apple Calendar',
            icon: FaApple,
            color: 'text-white',
            provider: 'apple' as const
        },
        {
            name: 'Google Calendar',
            icon: FaGoogle,
            color: 'text-[#4285F4]',
            provider: 'google' as const
        },
        {
            name: 'Outlook Calendar',
            icon: FaMicrosoft,
            color: 'text-[#0078D4]',
            provider: 'outlook' as const
        },
        {
            name: 'Yahoo Calendar',
            icon: FaYahoo,
            color: 'text-[#6001D2]',
            provider: 'yahoo' as const
        }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h3 className="text-white font-semibold text-lg">
                    Tambah ke Kalendar
                </h3>
                <p className="text-neutral-400 text-sm">
                    Pilih aplikasi kalendar untuk menambahkan pengingat Live
                    Class ini
                </p>
            </div>

            <div className="flex flex-col gap-2">
                {calendarOptions.map((option) => (
                    <Button
                        key={option.provider}
                        variant="custom"
                        className="w-full bg-[#282B3C] hover:bg-[#333640] transition-colors border-[2px] border-[#333333] flex flex-row items-center gap-3 justify-start px-4 py-3"
                        onClick={() => handleAddToCalendar(option.provider)}>
                        <option.icon className={`${option.color} text-xl`} />
                        <span className="text-white font-medium">
                            {option.name}
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default AddToCalendarModal;
