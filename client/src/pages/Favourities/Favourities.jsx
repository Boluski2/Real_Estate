// "use client"
import React, { useContext, useState } from 'react';
import SearchBar from '../../components/searchBar/SearchBar';
import '../Properties/Properties.css';
import useProperties from '../../hooks/useProperties';
import { PuffLoader } from 'react-spinners';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import UserDetailContext from '../../context/UserDetailContext';

const Favourities = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState('');
  const { userDetails } = useContext(UserDetailContext);
  const favourities = userDetails?.favourities || []; 

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while Fetching data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: '60vh' }}>
        <PuffLoader height="80" width="80" radius={1} color="#4066ff" aria-label="puff-loading" />
      </div>
    );
  }

  if (!data) {
    return <div className="wrapper">Loading properties...</div>; // FIX: Ensure `data` exists before mapping
  }

  return (
    <div className="wrapper">
      <div className="flexCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />

        <div className="paddings flexCenter properties">
          {data
            .filter((property) => favourities.includes(property.id)) 
            .filter(
              (property) =>
                property.title.toLowerCase().includes(filter.toLowerCase()) ||
                property.city.toLowerCase().includes(filter.toLowerCase()) ||
                property.country.toLowerCase().includes(filter.toLowerCase())
            )
            .map((card, i) => <PropertyCard card={card} key={i} />)}
            
        </div>
      </div>
    </div>
  );
};

export default Favourities;
