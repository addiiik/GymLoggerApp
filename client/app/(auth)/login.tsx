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
  ActivityIndicator } from "react-native";
import LogoComponent from "@/components/ui/LogoComponent";
import { useRouter } from "expo-router";
import { useRef, useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const shiftAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(1)).current;
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
          toValue: -90,
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

  const validateForm = () => {
    let newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      await login(email, password);
    } catch (err: any) {
      setErrorMessage('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center bg-[#1a1a1a] px-8 py-16">

        {isLoading && (
          <View className="absolute inset-0 justify-center items-center bg-[#1a1a1a]/90 z-10">
            <ActivityIndicator size="large" color="#ffffff" />
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
              <Text className="text-white font-semibold text-4xl mb-8">Welcome back</Text>

              <Animated.View style={{ transform: [{ translateX: shakeAnim }] }} className={'w-full'}>
                <View className="w-full mb-4">
                  <Text className="text-white text-base pl-1 mb-1">Email</Text>
                  <TextInput 
                    className={`border-2 ${errors.email ? 'border-red-400' : 'border-white/40'} bg-[#363636] rounded-lg h-14 pl-3 text-white`}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={errors.email ? errors.email : "Enter your email"}
                    placeholderTextColor={errors.email ? "#f87171" : "#bebebe"}
                    keyboardType="email-address"
                  >
                  </TextInput>
                </View>

                <View className="w-full">
                  <Text className="text-white text-base pl-1 mb-1">Password</Text>
                  <TextInput 
                    className={`border-2 ${errors.password ? 'border-red-400' : 'border-white/40'} bg-[#363636] rounded-lg h-14 pl-3 text-white`}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={errors.password ? errors.password : "Enter your password"}
                    placeholderTextColor={errors.password ? "#f87171" : "#bebebe"}
                    secureTextEntry={!showPassword}
                  >
                  </TextInput>
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
              </Animated.View>

              <View className="w-full items-end mt-4">
                <TouchableOpacity>
                  <Text className="text-sm text-white/70 pr-1">Forgot your password?</Text>
                </TouchableOpacity>
              </View>

              <View className="w-full items-center mt-10">
                <TouchableOpacity 
                className="w-80 h-14 bg-white justify-center rounded-full"
                onPress={handleSubmit}
                >
                  <Text className="text-black text-lg text-center">
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>

        {errorMessage && (
          <View className="absolute bottom-20 pb-14 w-full items-center">
            <Text className="text-red-400 text-sm text-center px-4">
              {errorMessage}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-center mt-20">
          <Text className="text-sm text-white/80 mr-1">Don't have an account?</Text>
          <TouchableOpacity onPress={() => {router.replace('/(auth)/register')}}>
            <Text className="text-sm text-white">
            Sign up
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}
