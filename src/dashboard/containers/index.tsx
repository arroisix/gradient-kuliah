import { useAuth } from 'src/authentication/contexts/AuthProvider';
import Button from 'src/commons/components/elements/Button';

const DashboardContainer = (): JSX.Element => {
    const { logout } = useAuth();
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
