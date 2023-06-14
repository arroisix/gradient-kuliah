import { removeUser } from 'authentication/redux/slices/userSlice';
import Button from 'commons/components/elements/Button';
import ContinueLearning from 'dashboard/components/ContinueLearning';
import MyClass from 'dashboard/components/MyClass';
import { useDispatch } from 'react-redux';

const DashboardContainer = (): JSX.Element => {
    const dispatch = useDispatch();

    const logout = (): void => {
        dispatch(removeUser());
    };

    return (
        <section className="min-h-screen pt-24 px-4 md:px-[7.5rem]">
            <h1>HALO</h1>
            <Button variant="primary" onClick={logout}>
                Logout
            </Button>
            <div className="flex flex-col md:flex-row-reverse gap-[2rem]">
                <MyClass className="w-full md:w-3/12" />
                <ContinueLearning className="w-full md:w-9/12" />
            </div>
        </section>
    );
};

export default DashboardContainer;
