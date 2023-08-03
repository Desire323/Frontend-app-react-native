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

  let displayText;

  if (isToday) {
    displayText = `${hours}:${minutes}`;
  } else if (isYesterday.getDate() === date.getDate()) {
    displayText = `Yesterday ${hours}:${minutes}`;
  } else if (isSameYear) {
    const dayOfWeek = date.toLocaleString('en', { weekday: 'short' });
    displayText = `${dayOfWeek} ${hours}:${minutes}`;
  } else {
    displayText = `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  return <Text style={style}>{displayText}</Text>;
}

export default TimestampToDateTime;
