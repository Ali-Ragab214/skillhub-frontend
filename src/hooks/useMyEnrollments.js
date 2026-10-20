import { useState, useEffect, useCallback } from "react";
import { getMyEnrollments, getCourseProgress } from "../services/enrollmentService.js";

export default function useMyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyEnrollments();
      const list = Array.isArray(res) ? res : (res.data?.content || res.data || []);
      const enriched = await Promise.all(
        list.map(async (enr) => {
          try {
            const progressRes = await getCourseProgress(enr.courseId);
            const data = progressRes.data;
            if (data && !Array.isArray(data) && data.totalLessons != null) {
              return { ...enr, totalLessons: data.totalLessons };
            }
          } catch {}
          return enr;
        })
      );
      setEnrollments(enriched);
    } catch {
      setError("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithProgress();
  }, [fetchWithProgress]);

  return { enrollments, loading, error, refetch: fetchWithProgress };
}
