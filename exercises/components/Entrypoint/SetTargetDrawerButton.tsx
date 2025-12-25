import Button from 'commons/components/elements/Button';
import { IoMdSettings } from 'react-icons/io';
import { useSetTargetDrawerContext } from './SetTargetDrawer';
import { useWindowSize } from 'usehooks-ts';

function SetTargetDrawerButton() {
    const { width } = useWindowSize();
    const { setIsDrawerOpened, setIsModalOpened } = useSetTargetDrawerContext();

    const handleClickButton = () => {
        width < 768 ? setIsModalOpened(true) : setIsDrawerOpened(true);
    };

    return (
        <Button
            size={width < 768 ? 'extraSmall' : 'small'}
            variant="custom"
            className="bg-[#333333] flex items-center gap-1.5 text-nowrap !py-2 !px-4"
            onClick={handleClickButton}>
            <IoMdSettings className="shrink-0" />
            <span className="font-semibold text-sm">Atur Target</span>
        </Button>
    );
}

export default SetTargetDrawerButton;
