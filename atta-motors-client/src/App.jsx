import "./App.css";
import { Home } from "@/pages";
import { Footer, Header } from "@/components";

function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Home />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
