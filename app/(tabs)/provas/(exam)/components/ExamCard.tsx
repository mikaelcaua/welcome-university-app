import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Exam, ExamType } from '@/interfaces';
import { theme } from '@/theme';

interface ExamCardProps {
  exam: Exam;
  index: number;
}

const typeLabels: Record<ExamType, string> = {
  EXAM: 'EX',
  PROVA1: 'P1',
  PROVA2: 'P2',
  PROVA3: 'P3',
  RECUPERACAO: 'REC',
  FINAL: 'FINAL',
};

const typeColors: Record<ExamType, string> = {
  EXAM: theme.colors.blue[100],
  PROVA1: theme.colors.blue[100],
  PROVA2: theme.colors.blue[100],
  PROVA3: theme.colors.blue[100],
  RECUPERACAO: theme.colors.orange[100],
  FINAL: theme.colors.red[100],
};

const textTypeColors: Record<ExamType, string> = {
  EXAM: theme.colors.blue[700],
  PROVA1: theme.colors.blue[700],
  PROVA2: theme.colors.blue[700],
  PROVA3: theme.colors.blue[700],
  RECUPERACAO: theme.colors.orange[700],
  FINAL: theme.colors.red[700],
};

export function ExamCard({ exam, index }: ExamCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, index, translateY]);

  function handleOpenPdf() {
    if (exam.pdfUrl) {
      Linking.openURL(exam.pdfUrl).catch((err) =>
        console.error('Não foi possível abrir o PDF', err),
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
        <View style={styles.iconContainer}>
          <FontAwesome name="file-pdf-o" size={20} color={theme.colors.pdf} />
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{exam.name}</Text>
          <Text style={styles.subtitle}>
            Semestre {exam.examYear}.{exam.semester}
          </Text>
        </View>

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
    backgroundColor: theme.colors.red[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.red[100],
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
