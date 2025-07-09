import Hero from "../UI/Hero";
import Navbar from "../UI/Navbar";
import Features from "../UI/Features";
import AlgoDesign from "../UI/AlgoDesign";
import Footer from "../UI/Footer";

function Home(){

    return (
        <div className="flex flex-col justify-center item-center w-[100vw]">
                   <Navbar/>
                   <Hero/>
                   <Features/>
                   <AlgoDesign/>
                   <Footer/>
        </div>
    );
}

export default Home;