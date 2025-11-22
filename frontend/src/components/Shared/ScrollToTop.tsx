import React from 'react';
import {Fab} from "@mui/material";
import {KeyboardArrowUp} from "@mui/icons-material";

function scrollTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});

}
function ScrollToTop() {
    return (
        <Fab variant={"circular"} color={"secondary"} size={"large"}
             onClick={scrollTop}
             sx={{
            position: 'fixed',
            bottom: '2vh',
            right: '2vh',
        }} >
            <KeyboardArrowUp/>
        </Fab>
    );
}
export default ScrollToTop;