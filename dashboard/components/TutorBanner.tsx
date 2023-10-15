import Button from 'commons/components/elements/Button';
import { CDN_URL } from 'commons/constants';
import moment, { type Moment } from 'moment-timezone';
import Image from 'next/image';
import React from 'react';

const TUTOR_LINK = 'https://linktr.ee/z4ex5rc6tvybhijno';
const TUTOR_ASSET = `${CDN_URL}/assets/tutor-banner.png`;
const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const TutorBanner = (): JSX.Element => {
    const schedule: { [course: string]: Moment } = {
        fisika: moment.tz({ hours: 19 }, 'Asia/Jakarta'),
        kimia: moment.tz({ hours: 16 }, 'Asia/Jakarta'),
        kalkulus: moment.tz({ hours: 19 }, 'Asia/Jakarta')
    };

    const displaySchedule = (course: string): string => {
        return schedule[course].clone().tz(USER_TIMEZONE).format('HH:mm z');
    };

    return (
        <div className="relative z-0 flex flex-col w-full gap-3 p-5 overflow-hidden md:gap-4 rounded-xl md:p-10 bg-accent-purple">
            <div className="absolute z-0 w-48 -right-4 sm:right-0 -bottom-2 sm:w-64 lg:w-auto">
                <Image src={TUTOR_ASSET} width={292} height={343} />
            </div>
            <h5 className="z-[1] text-lg font-extrabold md:text-2xl">
                Tutor Gradient hadir!
            </h5>
            <p className="text-sm md:text-base z-[1]">
                <b>Jadwal Tutor</b>
                <ul className="p-0 list-none">
                    <li>Fisika 1: Setiap Jumat {displaySchedule('fisika')}</li>
                    <li>Kimia 1: Setiap Minggu {displaySchedule('kimia')}</li>
                    <li>
                        Kalkulus 1: Setiap Minggu {displaySchedule('kalkulus')}
                    </li>
                </ul>
            </p>
            <Button
                variant="custom"
                href={TUTOR_LINK}
                target="blank"
                className="font-sans text-xs font-bold text-black bg-white w-fit z-[1] mt-12 min-[375px]:mt-0"
                eventName="Join Tutor Button">
                Gabung Tutor
            </Button>
        </div>
    );
};

export default TutorBanner;
