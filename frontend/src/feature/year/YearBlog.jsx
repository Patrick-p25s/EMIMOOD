import React from "react";
import useYear from "./useYear";
import YearForm from "./YearForm";
import YearItem from "./YearItem";

export default function YearBlog() {
  const {
    createYear,
    years,
    deleteYear,
    updateYear,
    activeYear,
    getActiveYear,
  } = useYear();
  getActiveYear()
    .then((res) => console.log(res))
    .catch((res) => console.log(res));
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
