import Navbar from "@/components/layout_component/Navbar";

export default function DashboardLayout({ children }) {
    return <section>
        <Navbar/>
        {children}
        </section>
  }