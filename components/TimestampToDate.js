import React from 'react';
import { Text } from 'react-native';

function TimestampToDate({ timestamp, style }) {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.getMonth() + 1; 
  const year = date.getFullYear();

  const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <Text style={style}>
      {formattedDate}
    </Text>
    );
}

export default TimestampToDate;
