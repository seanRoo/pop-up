import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Keyboard } from "react-native";
import { useSharedValue } from "react-native-reanimated";

interface ProviderProps {
  children: ReactNode;
}
interface AppContextType {
  isKeyboardVisible: boolean;
}

const AppContext = createContext<AppContextType>({ isKeyboardVisible: false });

export const AppProvider = ({ children }: ProviderProps) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

  return (
    <AppContext.Provider value={{ isKeyboardVisible }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => useContext(AppContext);
