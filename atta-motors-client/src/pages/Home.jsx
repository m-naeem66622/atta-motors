import { Button } from "@/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components";
import { ChevronRight, Car, DollarSign, Wrench } from "lucide-react";

const cars = [
  {
    id: 1,
    name: "Toyota Corolla",
    year: 2020,
    mileage: "30,000 km",
    price: "3,000,000 PKR",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/2020-corolla-mmp-1-1560527011.jpg",
  },
  {
    id: 2,
    name: "Honda Civic",
    year: 2019,
    mileage: "25,000 km",
    price: "3,200,000 PKR",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/2019-honda-civic-sedan-101-1537806283.jpg",
  },
  {
    id: 3,
    name: "Kia Sportage",
    year: 2021,
    mileage: "10,000 km",
    price: "4,500,000 PKR",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/2021-kia-sportage-mmp-2-1601580481.jpg",
  },
];

export const Home = () => {
  return (
    <>
      <section className="relative h-[600px] flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://hips.hearstapps.com/hmg-prod/images/2020-rolls-royce-wraith-109-1584549144.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 space-y-6 px-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white">
            Find Your Perfect Ride
          </h1>
          <p className="mx-auto max-w-[600px] text-white md:text-xl">
            Browse our extensive collection of quality vehicles or sell your car
            with ease. Expert maintenance services available.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Browse Cars</Button>
            <Button size="lg" variant="outline">
              Sell Your Car
            </Button>
          </div>
        </div>
      </section>
      <section
        id="services"
        className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
      >
        <div className="px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
            Our Services
          </h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Car className="h-8 w-8 mb-2" />
                <CardTitle>Car Sales</CardTitle>
                <CardDescription>
                  Find your perfect ride from our extensive collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Browse through a wide range of new and pre-owned vehicles. Our
                  expert team will help you find the car that fits your needs
                  and budget.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link">Learn More</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 mb-2" />
                <CardTitle>Car Purchase</CardTitle>
                <CardDescription>
                  Sell your car quickly and at the best price
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Get a fair valuation for your vehicle. We offer competitive
                  prices and a hassle-free selling experience.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link">Learn More</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Wrench className="h-8 w-8 mb-2" />
                <CardTitle>Maintenance</CardTitle>
                <CardDescription>
                  Keep your car in top condition with our expert service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  From routine check-ups to major repairs, our skilled
                  technicians ensure your vehicle runs smoothly and safely.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link">Learn More</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      <section id="featured" className="w-full py-12 md:py-24 lg:py-32">
        <div className="px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
            Featured Cars
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <Card key={car.id}>
                <div className="h-52">
                  <img
                    src={car.image}
                    alt={`Featured Car ${car.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{car.name}</CardTitle>
                  <CardDescription>
                    Year: {car.year} | Mileage: {car.mileage}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">Rs. {car.price}</p>
                </CardContent>
                <CardFooter>
                  <Button>View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section
        id="contact"
        className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Whether you're looking to buy, sell, or service your car, we're
                here to help. Contact us today for a consultation.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button className="w-full" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
