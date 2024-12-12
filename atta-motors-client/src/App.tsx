import "./App.css";
import { HomePage } from "@/pages";
import { Footer, Header } from "@/components";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
