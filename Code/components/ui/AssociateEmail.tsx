import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { verifyBeforeUpdateEmail} from 'firebase/auth';
import Input from './Input';
import { LoadingStateTypes } from '../redux/types';
import { useAuth } from '../useAuth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import LoadingButton from '@/components/ui/LoadingButton';

const AssociateEmail = () => {
    const router = useRouter();
    const auth = useAuth();

    const [email, setEmail] = useState('');

    const handleReload = async () => {
        if (auth.type !== LoadingStateTypes.LOADED) return;
        router.refresh();
    };

    const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (auth.type !== LoadingStateTypes.LOADED) return;

        try {
            if (firebaseAuth.currentUser) {
                verifyBeforeUpdateEmail(firebaseAuth.currentUser, email)
                alert('Verification email sent successfully! Please verify your email and press Done below to Sign-In again');
                //firebaseAuth.currentUser.reload();
            } else {
            console.error('No user signed in');
            }
        } catch (error) {
            console.error('Error associating email with user:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Please provide an Email you would like to associate with your account</h2>
            <form onSubmit={handleEmailSubmit}>
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    name="email"
                    type="email"
                />
                <LoadingButton type="submit">Submit Email</LoadingButton>
            </form>
            <br></br>
            <LoadingButton
                onClick={handleReload}
            >
                Done
            </LoadingButton>
        </div>
    );
};

export default AssociateEmail;
