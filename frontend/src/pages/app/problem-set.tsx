import React, { useState } from "react";

import TopicChips from "../../features/problem-set/components/topic-chips";
import { SearchBar } from "../../features/problem-set/components/search-bar";
import ProblemTable from "../../features/problem-set/components/problem-table";
import { dummyProblems } from "../../features/problem-set/data/dummy-problems";
import { LevelFilter } from "../../features/problem-set/components/level-filter";
function ProblemSet() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [level, setLevel] = useState("All");
  const problemsPerPage = 10;

  // Search Filter
  const filteredProblems = dummyProblems.filter((problem) => {
  const matchesSearch = problem.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesLevel =
    level === "All" ||
    problem.level === level;

  return matchesSearch && matchesLevel;
});

  // Pagination
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;

  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  const totalPages = Math.ceil(
    filteredProblems.length / problemsPerPage
  );

  return (
  <div className="p-6">
    {/* Search Bar + level Filter */}
    <div className="flex items-center justify-between gap-4">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
      />

      <div>
        <LevelFilter
          level={level}
          setLevel={(value: React.SetStateAction<string>) => {
            setLevel(value);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>

    {/* Topic Chips */}
    <div className="mt-4">
      <TopicChips />
    </div>

    {/* Problem Table */}
    <div className="mt-6">
      {filteredProblems.length > 0 ? (
        <ProblemTable problems={currentProblems} />
      ) : (
        <div className="rounded-md border p-6 text-center">
          <h3 className="text-lg font-semibold">
            No Problems Found
          </h3>

          <p className="mt-2 text-muted-foreground">
            No problem matches your search criteria.
          </p>
        </div>
      )}
    </div>

    {/* Pagination */}
    {filteredProblems.length > 0 && totalPages > 1 && (
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-md border transition-colors ${
              currentPage === index + 1
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    )}
  </div>
);
}

export default ProblemSet;