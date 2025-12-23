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
            className="bg-graphite-700 flex flex-row gap-[6px] items-center"
            onClick={handleClickButton}>
            <IoMdSettings />
            <span className="size-sm font-semibold">Atur Target</span>
        </Button>
    );
}

export default SetTargetDrawerButton;
