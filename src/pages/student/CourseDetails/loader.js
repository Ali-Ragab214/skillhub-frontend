import axiosInstance from "../../../services/axiosInstance";

export async function loader({ params }) {
  const [courseRes, sectionsRes] = await Promise.all([
    axiosInstance.get(`/api/v1/courses/${params.id}`),
    axiosInstance.get(`/api/courses/${params.id}/sections`),
  ]);
  return {
    course: courseRes.data.data,
    sections: sectionsRes.data.data?.content || [],
  };
}
