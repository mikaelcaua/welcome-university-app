import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, FormInput } from "@/components";
import { theme } from "@/theme";

import { useProfileViewModel } from "./useProfileViewModel";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    form,
    mode,
    user,
    isSubmitting,
    isAuthenticated,
    hasHydrated,
    setMode,
    handleLogout,
    onSubmit,
  } = useProfileViewModel();

  if (!hasHydrated) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.background}
        />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isAuthenticated && user ? (
          <View style={styles.section}>
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View>
                  <Text style={styles.profileName}>
                    {user.name || "Usuário autenticado"}
                  </Text>
                  <Text style={styles.profileEmail}>{user.email}</Text>
                </View>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user.role}</Text>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <InfoItem label="ID" value={String(user.id || "-")} />
                <InfoItem label="Acesso" value={user.role} />
                <InfoItem label="Status" value="Sessão ativa" />
              </View>

              <View style={styles.actionsRow}>
                <Button
                  title="Sair"
                  onPress={handleLogout}
                  variant="outline"
                  style={styles.actionButton}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.segmentedControl}>
              <ModeButton
                label="Entrar"
                isActive={mode === "login"}
                onPress={() => setMode("login")}
              />
              <ModeButton
                label="Criar conta"
                isActive={mode === "register"}
                onPress={() => setMode("register")}
              />
            </View>

            <View style={styles.formCard}>
              {mode === "register" ? (
                <FormInput
                  control={form.control}
                  name="name"
                  label="Nome"
                  placeholder="Seu nome completo"
                  iconName="person-outline"
                  error={form.formState.errors.name?.message}
                />
              ) : null}

              <FormInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="voce@universidade.edu.br"
                keyboardType="email-address"
                autoCapitalize="none"
                iconName="mail-outline"
                error={form.formState.errors.email?.message}
              />

              <FormInput
                control={form.control}
                name="password"
                label="Senha"
                placeholder="Digite sua senha"
                secureTextEntry
                iconName="lock-outline"
                error={form.formState.errors.password?.message}
              />

              <Button
                title={mode === "register" ? "Criar conta" : "Entrar"}
                onPress={onSubmit}
                isLoading={isSubmitting}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ModeButton({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.modeButton, isActive ? styles.modeButtonActive : null]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.modeButtonText,
          isActive ? styles.modeButtonTextActive : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.l,
    paddingBottom: 132,
    gap: theme.spacing.l,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    gap: theme.spacing.s,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: theme.colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.text.body,
  },
  section: {
    gap: theme.spacing.m,
  },
  segmentedControl: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.xs,
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  modeButton: {
    flex: 1,
    borderRadius: theme.borderRadius.m,
    paddingVertical: theme.spacing.m,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  modeButtonText: {
    fontWeight: "700",
    color: theme.colors.text,
  },
  modeButtonTextActive: {
    color: theme.colors.textInverted,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    gap: theme.spacing.m,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    gap: theme.spacing.m,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.m,
  },
  profileName: {
    ...theme.text.title,
    fontSize: 22,
  },
  profileEmail: {
    ...theme.text.body,
    color: theme.colors.textLight,
  },
  roleBadge: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.l,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
  },
  roleText: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  infoGrid: {
    gap: theme.spacing.s,
  },
  actionsRow: {
    flexDirection: "row",
    gap: theme.spacing.s,
  },
  actionButton: {
    flex: 1,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.m,
  },
  infoLabel: {
    ...theme.text.body,
    color: theme.colors.textLight,
  },
  infoValue: {
    ...theme.text.body,
    fontWeight: "700",
    color: theme.colors.text,
  },
  supportCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    gap: theme.spacing.s,
  },
  supportTitle: {
    ...theme.text.title,
    fontSize: 18,
  },
  supportBody: {
    ...theme.text.body,
  },
});
