const Macbook = ({ width = 38, height = 22 }): JSX.Element => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 38 22"
            fill="none">
            <path
                fill="#8C8C8C"
                fillRule="evenodd"
                d="M33.518 0H4.52c-.493 0-.892.4-.892.892v19.386c0 .492.4.892.892.892h28.997c.493 0 .892-.4.892-.893V.892c0-.493-.4-.892-.892-.892z"
                clipRule="evenodd"></path>
            <path
                fill="#fff"
                fillRule="evenodd"
                d="M33.517.082H4.52a.811.811 0 00-.81.811V20.28c0 .447.362.81.81.81h28.997a.811.811 0 00.811-.81V.893a.811.811 0 00-.811-.811z"
                clipRule="evenodd"></path>
            <path
                fill="#8C8C8C"
                d="M38 21.151a.608.608 0 00-.608-.608H.608a.608.608 0 00-.608.608h38z"></path>
            <path
                fill="#fff"
                fillRule="evenodd"
                d="M37.918 21.071c0-.246-.2-.446-.446-.446H.526c-.246 0-.446.2-.446.446h37.838z"
                clipRule="evenodd"></path>
            <path
                fill="#8C8C8C"
                fillRule="evenodd"
                d="M38 21.152H0c.4.213.845.325 1.298.325h35.404c.453 0 .899-.112 1.298-.325z"
                clipRule="evenodd"></path>
            <path
                fill="#fff"
                fillRule="evenodd"
                d="M37.879 21.152H.122c.375.16.778.244 1.186.244h35.385c.408 0 .811-.083 1.186-.244z"
                clipRule="evenodd"></path>
            <path
                fill="#8C8C8C"
                d="M21.719 20.543h-5.455c0 .235.19.426.426.426h4.603c.235 0 .426-.19.426-.426z"></path>
            <path fill="#B9B9B9" d="M33.621 1.277h-29.2v18.25h29.2z"></path>
        </svg>
    );
};

export default Macbook;
