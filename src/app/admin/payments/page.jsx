import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/api/adminAuth";
import PaymentsClient from "./_components/PaymentsClient";

const AdminPaymentsPage = async () => {
  const { isAdmin } = await checkAdminAuth();

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron">Payments & Analytics</h1>
        <p className="text-gray-600 mt-2">Monitor revenue and payment statistics</p>
      </div>

      <PaymentsClient />
    </div>
  );
};

export default AdminPaymentsPage;
