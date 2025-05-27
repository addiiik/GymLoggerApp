import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Easing,
  ActivityIndicator 
} from "react-native";
import LogoComponent from "@/components/ui/LogoComponent";
import { useRouter } from "expo-router";
import { useRef, useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const shiftAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(1)).current;

  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    const keyboardShow = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.parallel([
        Animated.timing(shiftAnim, {
          toValue: step === 1 ? -80 : -110,
          duration: 400,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        })
      ]).start();
    });

    const keyboardHide = Keyboard.addListener("keyboardWillHide", (e) => {
      Animated.parallel([
        Animated.timing(shiftAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        })
      ]).start();
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const validateStepOne = () => {
    const nameRegex = /^[A-Za-z]+$/;
    let newErrors: { firstName?: string; lastName?: string } = {};

    if (!firstName || !nameRegex.test(firstName)) newErrors.firstName = 'Only letters allowed';
    if (!lastName || !nameRegex.test(lastName)) newErrors.lastName = 'Only letters allowed';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Must be at least 6 characters';

    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStepOne()) {
      triggerShake();
      return;
    }

    Keyboard.dismiss();
    firstNameInputRef.current?.blur();
    lastNameInputRef.current?.blur();

    setStep(2);
  };

  const handleBackStep = () => {
    Keyboard.dismiss();
    setStep(1);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      triggerShake();
      return;
    }
    setErrorMessage(null);
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      await register(firstName, lastName, email, password);
      setSuccessMessage('Account created successfully');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center bg-[#1a1a1a] px-8 py-16">
        
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-[#1a1a1a]/90 z-10">
            <ActivityIndicator size="large" color="#ffffff" />
            {successMessage && (
              <View className="absolute top-1/2 mt-12 w-full items-center">
                <Text className="text-green-400 text-lg text-center px-4">
                  {successMessage}
                </Text>
              </View>
            )}
          </View>
        )}


        <Animated.View style={{ opacity: logoAnim }} className="items-center mt-6 mb-2">
          <LogoComponent />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: shiftAnim }] }} className="flex-1 w-full">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center w-full"
          >
            <View className="items-start w-full">
              <Text className="text-white font-semibold text-4xl mb-8">
                {step === 1 ? 'Introduce yourself' : 'Create an account'}
              </Text>

              <Animated.View style={{ transform: [{ translateX: shakeAnim }] }} className="w-full">
                {step === 1 ? (
                  <>
                    <View className="w-full mb-4">
                      <Text className="text-white text-base pl-1 mb-1">First Name</Text>
                      <TextInput
                        ref={firstNameInputRef}
                        className={`border-2 ${errors.firstName ? 'border-red-400' : 'border-white/40'} bg-[#363636] rounded-lg h-14 pl-3 text-white`}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder={errors.firstName ? errors.firstName : "Enter your first name"}
                        placeholderTextColor={errors.firstName ? "#f87171" : "#bebebe"}
                        autoCapitalize="words"
                      />
                    </View>
                    <View className="w-full mb-4">
                      <Text className="text-white text-base pl-1 mb-1">Last Name</Text>
                      <TextInput
                        ref={lastNameInputRef}
                        className={`border-2 ${errors.lastName ? 'border-red-400' : 'border-white/40'} bg-[#363636] rounded-lg h-14 pl-3 text-white`}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder={errors.lastName ? errors.lastName : "Enter your last name"}
                        placeholderTextColor={errors.lastName ? "#f87171" : "#bebebe"}
                        autoCapitalize="words"
                      />
                    </View>
                    <View className="w-full items-center mt-10">
                      <TouchableOpacity
                        className="w-80 h-14 bg-white justify-center rounded-full"
                        onPress={handleNextStep}
                      >
                        <Text className="text-black text-lg text-center">Next</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="w-full mb-4">
                      <Text className="text-white text-base pl-1 mb-1">Email</Text>
                      <TextInput
                        className={`border-2 ${errors.email ? 'border-red-400' : 'border-white/40'} bg-[#363636] rounded-lg h-14 pl-3 text-white`}
                        value={email}
                        onChangeText={setEmail}
                        placeholder={errors.email ? errors.email : "Enter your email"}
                        placeholderTextColor={errors.email ? "#f87171" : "#bebebe"}
                        keyboardType="email-address"
                      />
                    </View>

                    <View className="w-full mb-4">
                      <Text className="text-white text-base pl-1 mb-1">Password</Text>
                      <TextInput
                        className={`border-2 ${errors.password ? 'border-red-400' : 'border-white/40'} bg-[#363636] rounded-lg h-14 pl-3 text-white`}
                        value={password}
                        onChangeText={setPassword}
                        placeholder={errors.password ? errors.password : "Enter your password"}
                        placeholderTextColor={errors.password ? "#f87171" : "#bebebe"}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2"
                      >
                        <Icon
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="#bebebe"
                        />
                      </TouchableOpacity>
                    </View>

                    <View className="w-full">
                      <Text className="text-white text-base pl-1 mb-1">Confirm Password</Text>
                      <TextInput
                        className={`border-2 ${errors.confirmPassword ? 'border-red-400' : 'border-white/40'} bg-[#363636] rounded-lg h-14 pl-3 text-white`}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder={errors.confirmPassword ? errors.confirmPassword : "Repeat your password"}
                        placeholderTextColor={errors.confirmPassword ? "#f87171" : "#bebebe"}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2"
                      >
                        <Icon
                          name={showConfirmPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="#bebebe"
                        />
                      </TouchableOpacity>
                    </View>

                    <View className="w-full items-center mt-10">
                      <TouchableOpacity
                        className="w-80 h-14 bg-white justify-center rounded-full"
                        onPress={handleSubmit}
                      >
                        <Text className="text-black text-lg text-center">Register</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>

        {step === 2 && (
          <View className="absolute bottom-40 pb-12 w-full items-center">
            <TouchableOpacity onPress={handleBackStep} className="flex-row items-center">
              <Icon name="arrow-left" size={20} color="#ffffff" />
              <Text className="text-white text-base ml-2 pr-4">Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {errorMessage && (
          <View className="absolute bottom-20 pb-14 w-full items-center">
            <Text className="text-red-400 text-sm text-center px-4">
              {errorMessage}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-center mt-20">
          <Text className="text-sm text-white/80 mr-1">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text className="text-sm text-white">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
