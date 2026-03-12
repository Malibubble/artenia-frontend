import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MapArtenia from "../components/Map";
import Honeycomb from "../components/Honeycomb";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <MapArtenia />
          <Honeycomb />
        </main>
      </div>
    </div>
  );
}
