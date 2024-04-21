import React, {
  createContext,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
  MutableRefObject,
  useContext,
} from "react";
import { Animated, Platform } from "react-native";

const FadeOutCtx = createContext((cb: () => void) => cb());

export function useFadeOut(cb: () => void) {
  const exitCb = useContext(FadeOutCtx);
  return useCallback(() => exitCb(cb), [cb, exitCb]);
}

const duration = 300;
const useNativeDriver = Platform.OS !== "web";

const ShouldAnimateContext = createContext<MutableRefObject<boolean>>({
  current: true,
});

function useShouldAnimate() {
  const ref = useContext(ShouldAnimateContext);
  return ref.current;
}

export function SkipAnimateOnMount({ children }: { children: ReactNode }) {
  const mounting = useRef(false);
  useEffect(() => {
    mounting.current = true;
  }, []);
  return (
    <ShouldAnimateContext.Provider value={mounting}>
      {children}
    </ShouldAnimateContext.Provider>
  );
}

export function ListAnim(props: any) {
  const animate = useShouldAnimate();
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;
  useEffect(() => {
    if (!animate) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver,
      }),
    ]).start();
  }, [animate, opacity]);
  const value = useCallback(
    (cb: () => void) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          useNativeDriver,
        }),
      ]).start(cb);
    },
    [opacity],
  );
  return (
    <FadeOutCtx.Provider value={value}>
      <Animated.View {...props} style={{ opacity }} />
    </FadeOutCtx.Provider>
  );
}
