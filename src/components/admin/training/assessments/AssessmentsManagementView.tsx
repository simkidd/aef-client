"use client";

import React, { useMemo, useState } from "react";
import {
  useAssessmentsListQuery,
  useAssessmentResultsQuery,
  useCohortsQuery,
  useEnrollmentQueueQuery,
} from "@/hooks/queries";
import {
  AssessmentsTable,
  AssessmentResultsTable,
  AssessmentDetailsSheet,
  CreateAssessmentModal,
  BatchGradeEntryModal,
  AssessmentsFilters,
} from "./";
import { Assessment, Enrollment } from "@/interfaces";
import { useDebounce } from "@/hooks";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssessmentsManagementView() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [cohortFilter, setCohortFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [assessmentsPage, setAssessmentsPage] = useState(1);
  const [resultsPage, setResultsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [gradingAssessment, setGradingAssessment] = useState<Assessment | null>(
    null,
  );
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    data: assessments = [],
    isLoading: isLoadingAssessments,
    refetch: refetchAssessments,
    isFetching: isFetchingAssessments,
  } = useAssessmentsListQuery();

  const {
    data: results = [],
    isLoading: isLoadingResults,
    refetch: refetchResults,
    isFetching: isFetchingResults,
  } = useAssessmentResultsQuery();

  const { data: cohorts = [] } = useCohortsQuery();
  const { data: queueData } = useEnrollmentQueueQuery({
    status: "Active",
    limit: 500,
  });
  const activeTrainees = queueData?.docs || [];

  const skillAreas = cohorts
    .flatMap((c) => c.skillConfigs || [])
    .map((sac) => {
      const sa = (sac as any).skillAreaId;
      return typeof sa === "object"
        ? sa
        : { _id: sa, name: "Skill Area Track" };
    });

  // Deduplicate skill areas
  const uniqueSkillAreas = Array.from(
    new Map(
      skillAreas.filter((s) => s && s._id).map((s) => [s._id, s]),
    ).values(),
  );

  // Filter assessments
  const filteredAssessments = useMemo(() => {
    return assessments.filter((ass) => {
      const searchLower = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        ass.title?.toLowerCase().includes(searchLower) ||
        ass.description?.toLowerCase().includes(searchLower) ||
        ass.skillAreaId?.name?.toLowerCase().includes(searchLower);

      const matchesCohort =
        !cohortFilter ||
        ass.cohortId?._id === cohortFilter ||
        ass.cohortId === cohortFilter;

      const matchesType =
        !typeFilter ||
        ass.type?.toLowerCase().includes(typeFilter.toLowerCase());

      return matchesSearch && matchesCohort && matchesType;
    });
  }, [assessments, debouncedSearch, cohortFilter, typeFilter]);

  // Filter results
  const filteredResults = useMemo(() => {
    return results.filter((res) => {
      const searchLower = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        res.assessmentId?.title?.toLowerCase().includes(searchLower) ||
        `${res.beneficiaryId?.firstName} ${res.beneficiaryId?.lastName}`
          .toLowerCase()
          .includes(searchLower) ||
        res.beneficiaryId?.beneficiaryCode?.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [results, debouncedSearch]);

  const totalAssessments = filteredAssessments.length;
  const totalAssessmentsPages =
    Math.ceil(totalAssessments / ITEMS_PER_PAGE) || 1;
  const paginatedAssessments = useMemo(() => {
    const start = (assessmentsPage - 1) * ITEMS_PER_PAGE;
    return filteredAssessments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssessments, assessmentsPage]);

  const totalResults = filteredResults.length;
  const totalResultsPages = Math.ceil(totalResults / ITEMS_PER_PAGE) || 1;
  const paginatedResults = useMemo(() => {
    const start = (resultsPage - 1) * ITEMS_PER_PAGE;
    return filteredResults.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResults, resultsPage]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setAssessmentsPage(1);
    setResultsPage(1);
  };

  const handleCohortChange = (val: string) => {
    setCohortFilter(val);
    setAssessmentsPage(1);
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    setAssessmentsPage(1);
  };

  const handleRefreshAll = () => {
    refetchAssessments();
    refetchResults();
  };

  const isRefreshing = isFetchingAssessments || isFetchingResults;

  const handleViewDetails = (ass: Assessment) => {
    setSelectedAssessment(ass);
    setIsDetailsOpen(true);
  };

  const handleEnterGrades = (ass: Assessment) => {
    setGradingAssessment(ass);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCohortFilter("");
    setTypeFilter("");
    setAssessmentsPage(1);
    setResultsPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Assessments & Gradebook
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Record practical and theory competency evaluations. Training
            completion and assessment passing are evaluated independently.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="text-xs h-8 gap-1.5"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs h-8 font-semibold gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule Assessment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AssessmentsFilters
        search={search}
        onSearchChange={handleSearchChange}
        cohortFilter={cohortFilter}
        onCohortFilterChange={handleCohortChange}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeChange}
        cohorts={cohorts}
        onReset={handleResetFilters}
      />

      {/* Active Practical & Theory Evaluations */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-heading">
          Active Scheduled Assessments ({filteredAssessments.length})
        </h2>
        <AssessmentsTable
          assessments={paginatedAssessments}
          isLoading={isLoadingAssessments}
          onViewDetails={handleViewDetails}
          onEnterGrades={handleEnterGrades}
          page={assessmentsPage}
          totalPages={totalAssessmentsPages}
          total={totalAssessments}
          limit={ITEMS_PER_PAGE}
          onPageChange={setAssessmentsPage}
        />
      </div>

      {/* Recorded Gradebook Results */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-heading">
          Recorded Gradebook Results ({filteredResults.length})
        </h2>
        <AssessmentResultsTable
          results={paginatedResults}
          isLoading={isLoadingResults}
          page={resultsPage}
          totalPages={totalResultsPages}
          total={totalResults}
          limit={ITEMS_PER_PAGE}
          onPageChange={setResultsPage}
        />
      </div>

      {/* Modals & Sheets */}
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        cohorts={cohorts}
        skillAreas={uniqueSkillAreas}
      />

      <BatchGradeEntryModal
        assessment={gradingAssessment}
        isOpen={!!gradingAssessment}
        onClose={() => setGradingAssessment(null)}
        activeTrainees={activeTrainees}
      />

      <AssessmentDetailsSheet
        assessment={selectedAssessment}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedAssessment(null);
        }}
        onOpenGrading={(ass) => {
          setIsDetailsOpen(false);
          setSelectedAssessment(null);
          setGradingAssessment(ass);
        }}
      />
    </div>
  );
}
