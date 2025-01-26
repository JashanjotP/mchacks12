// app/heatmap/page.js
import GuelphRentalHeatMap from "../Components/Heatmap";

export default function HeatMapPage() {
  return (
    <div>
      <h1>Guelph Rental Price Heat Map</h1>
      <GuelphRentalHeatMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} />
    </div>
  );
}