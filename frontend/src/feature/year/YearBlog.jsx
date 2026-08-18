import React from "react";
import useYear from "./useYear";
import YearForm from "./YearForm";
import YearItem from "./YearItem";

export default function YearBlog() {
  const { createYear, years, deleteYear, updateYear, activeYear } = useYear();
  return (
    <div>
      <h1>Anné universitaire blog </h1>
      <YearForm onCreate={createYear} />
      {years.map((year) => (
        <YearItem
          year={year}
          key={year.id}
          onDelete={deleteYear}
          onActive={activeYear}
        />
      ))}
    </div>
  );
}
