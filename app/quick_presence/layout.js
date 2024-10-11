import Navbar from "@/components/layout_component/Navbar"
export default function DashboardLayout({
    children, // will be a page or nested layout
  }) {
    return (
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        {/* <nav></nav> */}
        <Navbar activeItem={"attendence"}/>
        <div >
        {/* className="lg:ml-[20vw] xl:ml-[20vw] 2xl:ml-[20vw] " */}
        {children}
        </div>
      </section>
    )
  }