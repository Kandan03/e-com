import ProductsList from "./_components/ProductsList";
import Hero from "./_components/Hero";
import About from "./_components/About";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="p-10 md:px-36 lg:px-48">
        <ProductsList />
      </div>
      <About />
    </div>
  );
}
