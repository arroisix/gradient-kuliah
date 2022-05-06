import { removeUser } from 'authentication/redux/slices/userSlice';
import Button from 'commons/components/elements/Button';
import { useDispatch } from 'react-redux';

const DashboardContainer = (): JSX.Element => {
    const dispatch = useDispatch();

    const logout = (): void => {
        dispatch(removeUser());
    };

    return (
        <section className="min-h-screen pt-24 px-[7.5rem]">
            <h1>HALO</h1>
            <Button variant="primary" onClick={logout}>
                Logout
            </Button>
        </section>
    );
};

export default DashboardContainer;
