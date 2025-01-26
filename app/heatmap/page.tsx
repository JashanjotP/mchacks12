import GuelphRentalHeatMap from "../Components/Heatmap";
import NavbarTrans from "../Components/NavbarTrans";

export default function HeatMapPage() {
  return (
    <div className="bg-gray-50">
      <NavbarTrans />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-[#eec08c] text-[#78350f]">
            <h1 className="text-3xl font-bold mb-2">Guelph Rental Heatmap</h1>
            <p className="text-[#78350f]">
              Explore rental prices and ratings across Guelph. 
              Green indicates affordable rentals, red shows higher-priced options.
            </p>
          </div>
          <div className="p-4 h-[400px]">
            <GuelphRentalHeatMap apiKey={process.env.GOOGLE_MAPS_API_KEY} />
          </div>
          <div className="p-6 bg-gray-50 text-sm text-gray-600">
            <p>
              💡 Tip: Click on a circle to view detailed information about the rental property.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}