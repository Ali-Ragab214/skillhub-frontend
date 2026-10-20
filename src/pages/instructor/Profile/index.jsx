import ProfilePage from "../../../components/shared/ProfilePage.jsx";

const quickLinks = [
  {
    to: "/instructor/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    label: "Dashboard",
    description: "View your teaching overview",
  },
  {
    to: "/instructor/my-courses",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    label: "My Courses",
    description: "Manage your courses",
  },
];

export default function InstructorProfile() {
  return <ProfilePage role="instructor" quickLinks={quickLinks} />;
}
