import React from 'react';
import Bomb from './Bomb';
import Barbie from './Barbie';


function Animation({theme}) {
  
    switch (theme) {
      case 'Barbie':
        return <Barbie />;
      case 'Oppenheimer':
        return <Bomb />;
      default:
  };
}

  
export default Animation;
    