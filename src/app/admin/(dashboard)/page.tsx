import { redirect } from "next/navigation";

const DashboardIndex = () => {
  redirect("/admin/activities");
};

export default DashboardIndex;
