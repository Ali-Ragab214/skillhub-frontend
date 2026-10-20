import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useAuthStore from "../../../../store/authStore.js";

vi.mock("react-router-dom", () => ({
  useLoaderData: vi.fn(),
  useNavigate: vi.fn(),
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

vi.mock("../../../../services/enrollmentService.js", () => ({
  getEnrollmentStatus: vi.fn(),
  getCourseProgress: vi.fn(),
  enrollInCourse: vi.fn(),
  markLessonComplete: vi.fn(),
}));

vi.mock("../../../../services/reviewService.js", () => ({
  submitReview: vi.fn(),
  getMyReview: vi.fn(),
  getCourseReviews: vi.fn(),
}));

vi.mock("../../../../components/ui/Spinner.jsx", () => ({
  default: () => <div data-testid="spinner" />,
}));

import { useLoaderData } from "react-router-dom";
import {
  getEnrollmentStatus,
  getCourseProgress,
} from "../../../../services/enrollmentService.js";
import {
  submitReview,
  getMyReview,
  getCourseReviews,
} from "../../../../services/reviewService.js";
import StudentCourseDetails from "../index.jsx";

const mockCourse = {
  id: 1,
  title: "Test Course",
  description: "A test course",
  instructor: { name: "John Doe" },
  price: 49.99,
  averageRating: 4.2,
  level: "INTERMEDIATE",
  totalEnrollments: 25,
};

const mockSections = [
  {
    id: 101,
    title: "Section 1",
    orderIndex: 0,
    lessons: [
      { id: 201, title: "Lesson 1", orderIndex: 0, duration: 10 },
      { id: 202, title: "Lesson 2", orderIndex: 1, duration: 15 },
    ],
  },
  {
    id: 102,
    title: "Section 2",
    orderIndex: 1,
    lessons: [
      { id: 203, title: "Lesson 3", orderIndex: 0, duration: 20 },
    ],
  },
];

function setupMocks({
  enrolled = true,
  progressOverrides = {},
  myReview = null,
  reviews = [],
} = {}) {
  getEnrollmentStatus.mockResolvedValue({ data: { enrolled } });

  const defaultProgress = {
    completionPercentage: 33,
    completedLessons: 1,
    totalLessons: 3,
    records: [
      { lessonId: 201, completed: true },
      { lessonId: 202, completed: false },
      { lessonId: 203, completed: false },
    ],
    sectionProgress: [
      { sectionId: 101, completedLessons: 1, totalLessons: 2 },
      { sectionId: 102, completedLessons: 0, totalLessons: 1 },
    ],
    ...progressOverrides,
  };
  getCourseProgress.mockResolvedValue({ data: defaultProgress });
  getMyReview.mockResolvedValue({ data: myReview });
  getCourseReviews.mockResolvedValue({ data: { content: reviews } });
}

function renderComponent() {
  return render(<StudentCourseDetails />);
}

describe("StudentCourseDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: { id: 1, name: "Test User" },
      token: "test-token",
    });
    useLoaderData.mockReturnValue({ course: mockCourse, sections: mockSections });
  });

  describe("Review Submission", () => {
    it("shows the review form when user is enrolled and has not reviewed", async () => {
      setupMocks();
      renderComponent();
      expect(await screen.findByText("Rate This Course")).toBeInTheDocument();
    });

    it("submits review successfully and displays it", async () => {
      const newReview = {
        id: 301,
        rating: 5,
        comment: "Great!",
        createdAt: new Date().toISOString(),
        studentName: "Test User",
      };
      const allReviews = [
        {
          id: 301,
          rating: 5,
          comment: "Great!",
          studentName: "Test User",
          createdAt: new Date().toISOString(),
        },
      ];

      setupMocks();
      submitReview.mockResolvedValue({ data: newReview });
      getCourseReviews.mockResolvedValue({ data: { content: allReviews } });

      const { container } = renderComponent();
      await screen.findByText("Rate This Course");

      const stars = container.querySelectorAll('[class*="cursor-pointer"]');
      await userEvent.click(stars[4]);

      const commentInput = screen.getByRole("textbox");
      await userEvent.type(commentInput, "Great!");

      await userEvent.click(screen.getByRole("button", { name: /submit review/i }));

      await waitFor(() => {
        expect(submitReview).toHaveBeenCalledWith(1, {
          rating: 5,
          comment: "Great!",
        });
      });

      expect(await screen.findByText("Your Review")).toBeInTheDocument();
      expect(screen.getAllByText("Great!").length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText("Rate This Course")).not.toBeInTheDocument();
    });

    it("shows error message when review submission fails", async () => {
      setupMocks();
      submitReview.mockRejectedValue({
        response: {
          data: { message: "You have already reviewed this course" },
        },
      });

      const { container } = renderComponent();
      await screen.findByText("Rate This Course");

      const stars = container.querySelectorAll(".w-8.h-8");
      await userEvent.click(stars[4]);

      await userEvent.click(screen.getByRole("button", { name: /submit review/i }));

      expect(
        await screen.findByText("You have already reviewed this course")
      ).toBeInTheDocument();
      expect(screen.getByText("Rate This Course")).toBeInTheDocument();
    });

    it("does not show an error when POST succeeds but GET review list fails", async () => {
      const newReview = {
        id: 301,
        rating: 5,
        comment: "Excellent!",
        createdAt: new Date().toISOString(),
        studentName: "Test User",
      };

      setupMocks();
      submitReview.mockResolvedValue({ data: newReview });
      getCourseReviews.mockRejectedValue(new Error("Network error"));

      const { container } = renderComponent();
      await screen.findByText("Rate This Course");

      const stars = container.querySelectorAll(".w-8.h-8");
      await userEvent.click(stars[4]);

      await userEvent.click(screen.getByRole("button", { name: /submit review/i }));

      expect(await screen.findByText("Your Review")).toBeInTheDocument();
      expect(screen.queryByText("Failed to submit review")).not.toBeInTheDocument();
    });
  });

  describe("Section Progress", () => {
    it("shows correct percentage from sectionProgress data", async () => {
      setupMocks({
        progressOverrides: {
          sectionProgress: [
            { sectionId: 101, completedLessons: 1, totalLessons: 2 },
            { sectionId: 102, completedLessons: 1, totalLessons: 1 },
          ],
        },
      });
      renderComponent();
      expect(await screen.findByText("50%")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("computes section progress from completedLessonIds when sectionProgress is empty", async () => {
      setupMocks({
        progressOverrides: {
          sectionProgress: [],
          records: [
            { lessonId: 201, completed: true },
            { lessonId: 202, completed: false },
            { lessonId: 203, completed: false },
          ],
        },
      });
      renderComponent();
      expect(await screen.findByText("50%")).toBeInTheDocument();
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("shows 0% when no lessons completed and no sectionProgress", async () => {
      setupMocks({
        progressOverrides: {
          completionPercentage: 0,
          completedLessons: 0,
          records: [
            { lessonId: 201, completed: false },
            { lessonId: 202, completed: false },
            { lessonId: 203, completed: false },
          ],
          sectionProgress: [],
        },
      });
      renderComponent();
      await screen.findByText("Test Course");
      const zeroPcts = screen.getAllByText("0%");
      expect(zeroPcts.length).toBeGreaterThanOrEqual(2);
    });
  });
});
