import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

import { Course, ExamType, State, Subject, University, UserRole } from "@/interfaces";
import { ApiError } from "@/lib/api";
import {
  LocalAttachment,
  pickImageFromLibrary,
  pickPdfDocument,
} from "@/lib/filesystem";
import { useAuthService } from "@/services/auth/useAuthService";
import { useAuthStore } from "@/store";

import {
  SubmitExamFormData,
  submitExamSchema,
} from "../../schemas/submitExamSchema";
import { useStateService } from "@/app/(tabs)/provas/services/useStateService";
import { useUniversityService } from "@/app/(tabs)/provas/services/useUniversityService";

import { useExamSubmissionService } from "../../service/useExamSubmissionService";
import { useCourseSubjectService } from "@/app/(tabs)/provas/services/useCourseSubjectService";

const semesterOptions = [
  { id: "1", name: "1º semestre" },
  { id: "2", name: "2º semestre" },
];

const examTypeOptions = [
  { id: ExamType.PROVA1, name: "Prova 1" },
  { id: ExamType.PROVA2, name: "Prova 2" },
  { id: ExamType.PROVA3, name: "Prova 3" },
  { id: ExamType.RECUPERACAO, name: "Recuperação" },
  { id: ExamType.FINAL, name: "Final" },
];

const defaultValues: SubmitExamFormData = {
  stateId: 0,
  universityId: 0,
  courseId: 0,
  subjectId: 0,
  examYear: "",
  semester: "1",
  type: ExamType.PROVA1,
  fileUri: "",
  fileName: "",
  fileMimeType: "",
  fileKind: "",
};

export function useExamSubmissionViewModel() {
  const router = useRouter();
  const [states, setStates] = useState<State[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingCascade, setLoadingCascade] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refresh } = useAuthService();
  const { accessToken, refreshToken, isAuthenticated, user, setSession, clearSession } =
    useAuthStore();
  const { getAllStates } = useStateService();
  const { getUniversitiesByState } = useUniversityService();
  const { getCoursesByUniversity, getSubjectsByCourse } =
    useCourseSubjectService();
  const { submitExam } = useExamSubmissionService();

  const form = useForm<SubmitExamFormData>({
    resolver: zodResolver(submitExamSchema),
    defaultValues,
  });

  const loadStates = useCallback(async () => {
    try {
      setLoadingCascade(true);
      const data = await getAllStates();
      setStates(data);
    } catch (error) {
      Alert.alert("Erro ao carregar estados", getErrorMessage(error));
    } finally {
      setLoadingCascade(false);
    }
  }, [getAllStates]);

  useEffect(() => {
    void loadStates();
  }, [loadStates]);

  async function handleStateSelect(stateId: number | string) {
    try {
      setLoadingCascade(true);
      setUniversities([]);
      setCourses([]);
      setSubjects([]);
      form.setValue("universityId", 0);
      form.setValue("courseId", 0);
      form.setValue("subjectId", 0);

      const data = await getUniversitiesByState(Number(stateId));
      setUniversities(data);
    } catch (error) {
      Alert.alert("Erro ao carregar universidades", getErrorMessage(error));
    } finally {
      setLoadingCascade(false);
    }
  }

  async function handleUniversitySelect(universityId: number | string) {
    try {
      setLoadingCascade(true);
      setCourses([]);
      setSubjects([]);
      form.setValue("courseId", 0);
      form.setValue("subjectId", 0);

      const data = await getCoursesByUniversity(Number(universityId));
      setCourses(data);
    } catch (error) {
      Alert.alert("Erro ao carregar cursos", getErrorMessage(error));
    } finally {
      setLoadingCascade(false);
    }
  }

  async function handleCourseSelect(courseId: number | string) {
    try {
      setLoadingCascade(true);
      setSubjects([]);
      form.setValue("subjectId", 0);

      const data = await getSubjectsByCourse(Number(courseId));
      setSubjects(data);
    } catch (error) {
      Alert.alert("Erro ao carregar disciplinas", getErrorMessage(error));
    } finally {
      setLoadingCascade(false);
    }
  }

  async function submit(values: SubmitExamFormData) {
    if (!accessToken) {
      Alert.alert(
        "Login necessário",
        "Entre em uma conta autenticada para enviar provas.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await submitWithToken(accessToken, values);
    } catch (error) {
      if (isAuthenticationError(error) && refreshToken) {
        try {
          const refreshedSession = await refresh(refreshToken);
          setSession({
            ...refreshedSession,
            refreshToken: refreshedSession.refreshToken || refreshToken,
            user: refreshedSession.user,
          });
          await submitWithToken(refreshedSession.accessToken, values);
        } catch (refreshError) {
          clearSession();
          Alert.alert("Sessão inválida", getErrorMessage(refreshError));
          return;
        }
      } else {
        Alert.alert("Falha no envio", getErrorMessage(error));
        return;
      }
    } finally {
      setIsSubmitting(false);
    }

    form.reset(defaultValues);
    setUniversities([]);
    setCourses([]);
    setSubjects([]);

    Alert.alert(
      "Prova enviada",
      user?.role && user.role !== UserRole.USER
        ? "A submissão foi aprovada automaticamente para o seu perfil."
        : "A submissão foi criada com status pendente para revisão.",
    );
  }

  async function submitWithToken(currentAccessToken: string, values: SubmitExamFormData) {
    await submitExam({
      accessToken: currentAccessToken,
      examYear: Number(values.examYear),
      semester: toSemester(values.semester),
      type: values.type,
      subjectId: values.subjectId,
      file: {
        uri: values.fileUri.trim(),
        name: values.fileName.trim(),
        mimeType: values.fileMimeType.trim(),
        kind: toAttachmentKind(values.fileKind),
      },
    });
  }

  function goToProfile() {
    router.push("/perfil");
  }

  function goToCurrentPendingExams() {
    router.push("/enviar/pending");
  }

  async function handlePickImage() {
    try {
      const file = await pickImageFromLibrary();

      if (!file) {
        return;
      }

      applySelectedFile(file);
    } catch (error) {
      Alert.alert("Erro ao selecionar imagem", getErrorMessage(error));
    }
  }

  async function handlePickPdf() {
    try {
      const file = await pickPdfDocument();

      if (!file) {
        return;
      }

      applySelectedFile(file);
    } catch (error) {
      Alert.alert("Erro ao selecionar PDF", getErrorMessage(error));
    }
  }

  function clearSelectedFile() {
    form.setValue("fileUri", "", { shouldDirty: true, shouldValidate: true });
    form.setValue("fileName", "", { shouldDirty: true, shouldValidate: true });
    form.setValue("fileMimeType", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("fileKind", "", { shouldDirty: true, shouldValidate: true });
  }

  function applySelectedFile(file: LocalAttachment) {
    form.setValue("fileUri", file.uri, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("fileName", file.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("fileMimeType", file.mimeType, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("fileKind", file.kind, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  const selectedFileName = form.watch("fileName");
  const selectedFileKind = form.watch("fileKind");

  return {
    form,
    user,
    states,
    subjects,
    courses,
    universities,
    loadingCascade,
    isSubmitting,
    isAuthenticated,
    semesterOptions,
    examTypeOptions,
    handleStateSelect,
    handleUniversitySelect,
    handleCourseSelect,
    handlePickImage,
    handlePickPdf,
    clearSelectedFile,
    goToProfile,
    goToCurrentPendingExams,
    onSubmit: form.handleSubmit(submit),
    hasSelectedState: Boolean(form.watch("stateId")),
    hasSelectedUniversity: Boolean(form.watch("universityId")),
    hasSelectedCourse: Boolean(form.watch("courseId")),
    hasSelectedAttachment: Boolean(form.watch("fileUri")),
    selectedFileName,
    selectedFileKind,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado.";
}

function toSemester(value: string): 1 | 2 {
  return value === "2" ? 2 : 1;
}

function toAttachmentKind(value: string): LocalAttachment["kind"] {
  return value === "pdf" ? "pdf" : "image";
}

function isAuthenticationError(error: unknown) {
  if (error instanceof ApiError) {
    return error.status === 401 || error.status === 403;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("401") ||
      message.includes("403") ||
      message.includes("unauthorized") ||
      message.includes("forbidden") ||
      message.includes("token")
    );
  }

  return false;
}
