import { client } from "../../utils/client";

export function storeQuizQuestion(data) {
  return client.post(`/admin/quizzes/${data.quiz_id}/questions`, {
    ...data,
  });
}

export function updateQuizQuestion(data) {
  return client.patch(`/admin/quizzes/questions/${data.id}`, {
    ...data,
  });
}

export function deleteQuizQuestion(data) {
    return client.delete(`/admin/quizzes/questions/${data.id}`);
  }

export function storeQuizNewOption(data) {
  return client.post(`/admin/quizzes/questions/${data.question_id}`, {
    ...data,
  });
}

export function updateQuizOption(data) {
  return client.patch(`/admin/quizzes/options/${data.id}`, {
    ...data,
  });
}

export function deleteQuizOption(data) {
    return client.delete(`/admin/quizzes/options/${data.id}`);
  }
  