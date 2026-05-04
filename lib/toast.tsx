import { MaterialIcons } from '@expo/vector-icons';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/theme';

type ToastVariant = 'info' | 'warning' | 'error' | 'success';

interface ToastPayload {
  title: string;
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
}

type ToastListener = (toast: Required<ToastPayload>) => void;

const listeners = new Set<ToastListener>();

export function showToast(payload: ToastPayload) {
  const toast: Required<ToastPayload> = {
    variant: 'info',
    durationMs: 4200,
    ...payload,
  };

  listeners.forEach((listener) => listener(toast));
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [toast, setToast] = useState<Required<ToastPayload> | null>(null);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const listener: ToastListener = (nextToast) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setToast(nextToast);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 190,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 140,
          useNativeDriver: true,
        }),
      ]).start();

      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, nextToast.durationMs);
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [opacity, translateY]);

  function hideToast() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setToast(null);
      }
    });
  }

  return (
    <View style={styles.root}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.overlay,
            {
              paddingTop: insets.top + theme.spacing.s,
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Pressable
            onPress={hideToast}
            style={[
              styles.toast,
              width < 380 ? styles.toastCompact : null,
              { borderLeftColor: variantColor(toast.variant) },
            ]}
          >
            <MaterialIcons
              name={variantIcon(toast.variant)}
              size={20}
              color={variantColor(toast.variant)}
            />
            <View style={styles.textContent}>
              <Text style={styles.title} numberOfLines={1}>
                {toast.title}
              </Text>
              <Text style={styles.message} numberOfLines={3}>
                {toast.message}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

function variantColor(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    case 'error':
      return theme.colors.error;
    default:
      return theme.colors.blue[400];
  }
}

function variantIcon(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return 'check-circle';
    case 'warning':
      return 'wifi-off';
    case 'error':
      return 'error-outline';
    default:
      return 'info-outline';
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  toast: {
    width: '100%',
    maxWidth: 520,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#111827',
    ...theme.shadows.strong,
  },
  toastCompact: {
    minHeight: 58,
  },
  textContent: {
    flex: 1,
  },
  title: {
    ...theme.text.body,
    color: theme.colors.text,
    fontWeight: '700',
  },
  message: {
    ...theme.text.caption,
    marginTop: 2,
  },
});
