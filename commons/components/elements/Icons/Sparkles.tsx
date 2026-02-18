function Sparkles({
    isActive = true
}: {
    isActive?: boolean;
}): JSX.Element {
    if (!isActive) {
        return (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.58332 4.08332L5.25 3.20832L7.58332 2.33245L8.45832 0L9.33414 2.33245L11.6666 3.20832L9.33414 4.08332L8.45832 6.41665L7.58332 4.08332ZM2.91665 8.75L0 7.58332L2.91665 6.41665L4.08332 3.5L5.25 6.41665L8.16665 7.58332L5.25 8.75L4.08332 11.6666L2.91665 8.75Z" fill="#737373"/>
            </svg>
        )
    }

    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.58332 4.08332L5.25 3.20832L7.58332 2.33245L8.45832 0L9.33414 2.33245L11.6666 3.20832L9.33414 4.08332L8.45832 6.41665L7.58332 4.08332ZM2.91665 8.75L0 7.58332L2.91665 6.41665L4.08332 3.5L5.25 6.41665L8.16665 7.58332L5.25 8.75L4.08332 11.6666L2.91665 8.75Z" fill="url(#paint0_linear_40008754_87585)"/>
            <defs>
                <linearGradient id="paint0_linear_40008754_87585" x1="0" y1="0" x2="11.7834" y2="1.2278" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#741F86"/>
                    <stop offset="0.465" stop-color="#965085"/>
                    <stop offset="1" stop-color="#A82C56"/>
                </linearGradient>
            </defs>
        </svg>

    )
}

export default Sparkles;