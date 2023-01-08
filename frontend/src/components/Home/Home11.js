import Navbar from './Navbar';
import Ngo from '../NGO/Ngo';
import Donor from '../Donor/Donor';
import Admin from '../Admin/Admin';
import React from 'react';
const Home11 = () => {
    return (
        <>
            {localStorage.getItem('type')==='Ngo' &&  <Ngo/>}
            {localStorage.getItem('type')==='Donor' &&  <Donor/>}
            {localStorage.getItem('type')==='Admin' &&  <Admin/>}
        </>
    );
};

export default Home11;