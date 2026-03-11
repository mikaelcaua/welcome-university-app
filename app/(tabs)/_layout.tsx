import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";

import { UserRole } from "@/interfaces";
import { useAuthStore } from "@/store";
import { theme } from "@/theme";

export default function TabsLayout() {
  const pathname = usePathname();
  const isInProvasFlow = pathname.startsWith("/provas");
  const isProvasInitialScreen = pathname === "/provas";
  const { hasHydrated, user } = useAuthStore();
  const canAccessReviewTab =
    hasHydrated &&
    (user?.role === UserRole.APPROVER ||
      user?.role === UserRole.ADMIN ||
      user?.role === UserRole.DEV);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.textInverted,
        tabBarInactiveTintColor: theme.colors.textLight,
        tabBarShowLabel: true,
        tabBarStyle: {
          display: isInProvasFlow && !isProvasInitialScreen ? "none" : "flex",
          position: "absolute",
          height: 84,
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 32,
          borderTopWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          paddingHorizontal: 12,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarItemStyle: {
          borderRadius: 26,
          marginHorizontal: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.6,
        },
        tabBarActiveBackgroundColor: "#F59E0B",
      }}
    >
      <Tabs.Screen
        name="provas"
        options={{
          title: "PROVAS",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-books" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="enviar"
        options={{
          title: "ENVIAR",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="upload-file" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="aprovar"
        options={{
          title: "APROVAR",
          href: canAccessReviewTab ? "/aprovar" : null,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="fact-check" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "PERFIL",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
