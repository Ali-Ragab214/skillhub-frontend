import axiosInstance from "../../../services/axiosInstance";

export async function loader({ params }) {
  const { courseId } = params;
  const [courseRes, progressRes] = await Promise.all([
    axiosInstance.get(`/api/v1/courses/${courseId}`),
    axiosInstance.get(`/api/courses/${courseId}/progress`).catch(() => ({ data: { data: [] } })),
  ]);
  return {
    course: courseRes.data.data,
    progressRecords: progressRes.data.data || [],
  };
}
