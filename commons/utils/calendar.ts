type CalendarEvent = {
    title: string;
    description: string;
    location: string;
    startTime: Date;
    endTime: Date;
};

/**
 * Format date to YYYYMMDDTHHmmssZ format for calendar links
 */
const formatDateForCalendar = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * Generate Google Calendar link
 */
export const generateGoogleCalendarLink = (event: CalendarEvent): string => {
    const { title, description, location, startTime, endTime } = event;

    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        details: description,
        location: location,
        dates: `${formatDateForCalendar(startTime)}/${formatDateForCalendar(
            endTime
        )}`
    });

    return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate Outlook Calendar link
 */
export const generateOutlookCalendarLink = (event: CalendarEvent): string => {
    const { title, description, location, startTime, endTime } = event;

    const baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';
    const params = new URLSearchParams({
        subject: title,
        body: description,
        location: location,
        startdt: startTime.toISOString(),
        enddt: endTime.toISOString(),
        path: '/calendar/action/compose',
        rru: 'addevent'
    });

    return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate Yahoo Calendar link
 */
export const generateYahooCalendarLink = (event: CalendarEvent): string => {
    const { title, description, location, startTime, endTime } = event;

    const baseUrl = 'https://calendar.yahoo.com/';
    const params = new URLSearchParams({
        v: '60',
        title: title,
        desc: description,
        in_loc: location,
        st: formatDateForCalendar(startTime),
        et: formatDateForCalendar(endTime)
    });

    return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate ICS file content for Apple Calendar and other calendar apps
 */
export const generateICSFile = (event: CalendarEvent): string => {
    const { title, description, location, startTime, endTime } = event;

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Gradient//Live Class//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${formatDateForCalendar(startTime)}`,
        `DTEND:${formatDateForCalendar(endTime)}`,
        `DTSTAMP:${formatDateForCalendar(new Date())}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
        `LOCATION:${location}`,
        `UID:${new Date().getTime()}@gradient.com`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
};

/**
 * Download ICS file for Apple Calendar
 */
export const downloadICSFile = (
    event: CalendarEvent,
    filename: string = 'event.ics'
): void => {
    const icsContent = generateICSFile(event);
    const blob = new Blob([icsContent], {
        type: 'text/calendar;charset=utf-8'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

/**
 * Open calendar link in new tab
 */
export const openCalendarLink = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer');
};
