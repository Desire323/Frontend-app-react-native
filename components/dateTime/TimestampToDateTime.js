import React from 'react';
import { Text } from 'react-native';

function TimestampToDateTime({ timestamp, style }) {
  const date = new Date(timestamp);
  const now = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Check if the date is today
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Check if the date is yesterday
  const isYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  // Check if the year is the same but the date is not today
  const isSameYear = year === now.getFullYear();

  // Check if the date is within the same week
  const isSameWeek =
    Math.abs(date - now) < 7 * 24 * 60 * 60 * 1000 &&
    date.getDay() === now.getDay();

  // Array of month names
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Function to add leading zero to minutes
  const padZero = (value) => {
    return value.toString().padStart(2, '0');
  };

  let displayText;

  if (isToday) {
    displayText = `${hours}:${padZero(minutes)}`;
  } else if (isYesterday.getDate() === date.getDate()) {
    displayText = `Yesterday ${hours}:${padZero(minutes)}`;
  } else if (isSameWeek) {
    const dayOfWeek = date.toLocaleString('en', { weekday: 'short' });
    displayText = `${dayOfWeek} ${hours}:${padZero(minutes)}`;
  } else if (isSameYear) {
    const monthName = monthNames[date.getMonth()]; // Get the localized month name
    displayText = `${day} ${monthName} ${hours}:${padZero(minutes)}`;
  } else {
    displayText = `${day}.${month}.${year} ${hours}:${padZero(minutes)}`;
  }

  return <Text style={style}>{displayText}</Text>;
}

export default TimestampToDateTime;
