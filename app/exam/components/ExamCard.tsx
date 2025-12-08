import { Exam, ExamType } from '@/interfaces';
import { theme } from '@/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

interface ExamCardProps {
  exam: Exam;
  index: number; // Usado para escalonar a animação (stagger)
}

const typeLabels: Record<ExamType, string> = {
  PROVA1: 'P1',
  PROVA2: 'P2',
  PROVA3: 'P3',
  RECUPERACAO: 'REC',
  FINAL: 'FINAL',
};

const typeColors: Record<ExamType, string> = {
  PROVA1: theme.colors.blue[100],
  PROVA2: theme.colors.blue[100],
  PROVA3: theme.colors.blue[100],
  RECUPERACAO: theme.colors.orange ? theme.colors.orange[100] : '#FFEDD5', // Fallback se não tiver orange
  FINAL: theme.colors.red[100],
};

const textTypeColors: Record<ExamType, string> = {
  PROVA1: theme.colors.blue[700],
  PROVA2: theme.colors.blue[700],
  PROVA3: theme.colors.blue[700],
  RECUPERACAO: theme.colors.orange ? theme.colors.orange[700] : '#C2410C',
  FINAL: theme.colors.red[700],
};

export function ExamCard({ exam, index }: ExamCardProps) {
  // Animação: Opacidade e Posição Y
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100, // Efeito cascata
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function handleOpenPdf() {
    if (exam.pdfUrl) {
      Linking.openURL(exam.pdfUrl).catch((err) =>
        console.error('Não foi possível abrir o PDF', err)
      );
    }
  }

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
    >
      <Pressable
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        onPress={handleOpenPdf}
      >
        {/* Ícone PDF Simulado */}
        <View style={styles.iconContainer}>
          <Text style={styles.pdfText}>PDF</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{exam.name}</Text>
          <Text style={styles.subtitle}>
            Semestre {exam.examYear}.{exam.semester}
          </Text>
        </View>

        {/* Badge do Tipo (P1, P2...) */}
        <View style={[styles.badge, { backgroundColor: typeColors[exam.type] }]}>
          <Text style={[styles.badgeText, { color: textTypeColors[exam.type] }]}>
            {typeLabels[exam.type]}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  pressed: {
    backgroundColor: theme.colors.surfaceAlt,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.red[50], // Fundo vermelho bem claro
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.red[100],
  },
  pdfText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.pdf,
  },
  content: {
    flex: 1,
  },
  name: {
    ...theme.text.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.text.caption,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: theme.spacing.s,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
