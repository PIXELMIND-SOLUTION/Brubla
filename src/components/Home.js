import Navbar from "./Navbar";
import HeroBanneer from "./Hero";
import CategorySection from "./Category";
import FlashBanner from "./FlashBanner";
import RecommendedProducts from "./RecommendedProducts";
import CollectionGrid from "./CollectionGrid";
import UpcomingAndRadar, { DesignsOnRadar, UpcomingSection } from "./UpcommingAndRadar";
import AdBanner from "./AdBanner";

const Home = () => {
    return (
        <>
            <Navbar />
            <main className="pb-[70px] lg:pb-0">
                <HeroBanneer />
                <CategorySection />
                <FlashBanner />
                <RecommendedProducts />
                <CollectionGrid />
                <UpcomingSection />
                <AdBanner />
                <DesignsOnRadar />
            </main>

        </>
    );
}

export default Home;