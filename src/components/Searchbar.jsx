import React from 'react';

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="border rounded px-2 py-1 w-full sm:w-auto"
      value={value}
      onChange={onChange}
    />
  );
}
