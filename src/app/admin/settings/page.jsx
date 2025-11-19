import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import { db } from "@/configs/db";
import { siteSettingsTable } from "@/configs/schema";
import SiteSettingsClient from "./_components/SiteSettingsClient";

const AdminSettingsPage = async () => {
  const { isAdmin } = await checkAdminAuth();

  if (!isAdmin) {
    redirect("/");
  }

  const settings = await db.select().from(siteSettingsTable);

  const settingsObj = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value || "";
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron">Site Settings</h1>
        <p className="text-gray-600 mt-2">Manage website content and configuration</p>
      </div>

      <SiteSettingsClient initialSettings={settingsObj} />
    </div>
  );
};

export default AdminSettingsPage;
