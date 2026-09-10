import Navbar from "@/components/ui/Navbar"
import FleetSection from "@/components/FleetSection"
import FleetComparison from "@/components/FleetComparison"
import Footer from "@/components/Footer"

export default function FleetPage() {
  return (
    <>
      <Navbar />
      <FleetSection />
      <FleetComparison />
      <Footer />
    </>
  )
}
