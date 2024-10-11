import Navbar from "@/components/layout_component/Navbar";

export default function DashboardLayout({ children }) {
    return <section >
        <Navbar/>
        <div className="xs:mb-[15vh]">

        {children}
        </div>
        </section>
  }