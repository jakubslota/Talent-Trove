import React from 'react';
import Navbar from "../Shared/Navbar";
import NavbarInfo from "./NavbarInfo";
import DataGridEmployee from "./DataGridEmployee";
import Footer from "../Shared/Footer";
import ScrollToTop from "../Shared/ScrollToTop";

function Home() {
    return (
        <>
            <Navbar/>
            <NavbarInfo/>
            <DataGridEmployee/>
            <ScrollToTop/>
            <Footer />
        </>
    );
}

export default Home;