import { useCallback, useEffect, useState } from 'react';
import Modal from './Modal';
import { useAppDispatch } from '../redux/store';
import LoadingButton from './LoadingButton';
import LoginWithGoogleButton from './LoginWithGoogleButton';
import Input from './Input';
import { isEmail } from 'validator';
import { loginWithEmail, useIsLoginWithEmailLoading } from '../redux/auth/loginWithEmail';
import { showToast } from '@/components/redux/toast/toastSlice';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { useRouter } from 'next/navigation';

interface SignUpModalProps {
    open: boolean;
    setOpen: (show: boolean) => void;
}
const SignUpModal = (props: SignUpModalProps) => {
    const dispatch = useAppDispatch();
    const auth = getAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [signUpOption, setSignUpOption] = useState<'email' | 'phoneNumber' | null>(null);
    const isLoading = useIsLoginWithEmailLoading();
    const [recaptchaResolved, setRecaptchaResolved] = useState(false);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isEmail(email) && signUpOption === 'email' && password.length >= 6|| phoneNumber.length > 0 && signUpOption === 'phoneNumber') {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }, [email, password, phoneNumber, signUpOption]);

    useEffect(() => {
        if (signUpOption === 'phoneNumber') {
            // Initialize reCAPTCHA verifier
            const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
                size: 'normal',
           callback: () => {
                setRecaptchaResolved(true);
            },

            'expired-callback': () => {
                setRecaptchaResolved(false);
                dispatch(
                    showToast({
                        message: 'Recaptcha Expired, please verify it again',
                        type: 'info',
                    })
                );
            },
        });

        verifier.render();

        setRecaptchaVerifier(verifier);
        }
    }, [signUpOption]);

    const signUpWithEmail = useCallback(async () => {
        dispatch(
            loginWithEmail({
                type: 'sign-up',
                email,
                password
            })
        );
    }, [email, password, phoneNumber, dispatch]);

    const signUpWithPhoneNumber = useCallback(async () => {
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier!);
            const otpCode = prompt('Enter the OTP code sent to your phone:');
            if (otpCode) {
                const credential = await confirmationResult.confirm(otpCode);
                console.log('Phone number authentication successful:', credential.user);
            } else {
                console.error('No OTP code entered.');
            }
        } catch (error) {
            console.error('Error signing in with phone number:', error);
        }
    }, [phoneNumber, recaptchaVerifier]);

    const handleOptionSelect = (option: 'email' | 'phoneNumber') => {
        setSignUpOption(option);
    };

    return (
        <Modal show={props.open} setShow={props.setOpen}>
            <div className="max-w-md w-full bg-white py-6 rounded-lg">
                <h2 className="text-lg font-semibold text-center mb-10">Sign Up</h2>
                <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
                    <div className="grid grid-cols-1 gap-3">
                        <LoadingButton onClick={() => handleOptionSelect('email')}>
                            Sign Up with Email
                        </LoadingButton>
                        {signUpOption === 'email' && (
                            <>
                                <Input
                                    value={email}
                                    onChange={(e) => {setEmail(e.target.value), setPhoneNumber("")}}
                                    placeholder="Email"
                                    name="email"
                                    type="text"
                                />
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    name="password"
                                    type="password"
                                />
                                <LoadingButton
                                    onClick={signUpWithEmail}
                                    disabled={disableSubmit}
                                    loading={isLoading}
                                >
                                    Sign Up
                                </LoadingButton>
                            </>
                        )}
                        <LoadingButton onClick={() => handleOptionSelect('phoneNumber')}>
                            Sign Up with Phone Number
                        </LoadingButton>
                        {signUpOption === 'phoneNumber' && (
                            <>
                                <Input
                                    value={phoneNumber}
                                    onChange={(e) => {setPhoneNumber(e.target.value); setEmail("");}}
                                    placeholder="Phone Number"
                                    name="phoneNumber"
                                    type="text"
                                />
                                {/* <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    name="password"
                                    type="password"
                                /> */}
                                <div id="recaptcha-container" />
                                <LoadingButton
                                    onClick={signUpWithPhoneNumber}
                                    disabled={disableSubmit || !recaptchaVerifier}
                                    loading={isLoading}
                                >
                                    Sign Up
                                </LoadingButton>
                                
                            </>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-3">
                        <LoginWithGoogleButton />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SignUpModal;
