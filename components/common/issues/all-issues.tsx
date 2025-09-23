'use client';

import { status } from '@/mock-data/status';
import { useIssuesStore } from '@/store/issues-store';
import { useSearchStore } from '@/store/search-store';
import { useViewStore } from '@/store/view-store';
import { useFilterStore } from '@/store/filter-store';
import { FC, useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupIssues } from './group-issues';
import { SearchIssues } from './search-issues';
import { CustomDragLayer } from './issue-grid';
import { cn } from '@/lib/utils';
import { Issue } from '@/types';

export default function AllIssues() {
   const { fetchIssues, loading, error } = useIssuesStore();
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();
   const { hasActiveFilters } = useFilterStore();

   useEffect(() => {
      fetchIssues();
   }, [fetchIssues]);

   const isSearching = isSearchOpen && searchQuery.trim() !== '';
   const isViewTypeGrid = viewType === 'grid';
   const isFiltering = hasActiveFilters();

   if (loading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div>Error: {error}</div>;
   }

   return (
      <div className={cn('w-full h-full', isViewTypeGrid && 'overflow-x-auto')}>
         {isSearching ? (
            <SearchIssuesView />
         ) : isFiltering ? (
            <FilteredIssuesView isViewTypeGrid={isViewTypeGrid} />
         ) : (
            <GroupIssuesListView isViewTypeGrid={isViewTypeGrid} />
         )}
      </div>
   );
}

const SearchIssuesView = () => (
   <div className="px-6 mb-6">
      <SearchIssues />
   </div>
);

const FilteredIssuesView: FC<{
   isViewTypeGrid: boolean;
}> = ({ isViewTypeGrid = false }) => {
   const { filters } = useFilterStore();
   const { issues } = useIssuesStore();

   const filteredIssues = useMemo(() => {
      return issues.filter(issue => {
        const statusMatch = filters.status.length ? filters.status.includes(issue.status) : true;
        const priorityMatch = filters.priority.length ? filters.priority.includes(issue.priority) : true;
        const assigneeMatch = filters.assignee.length ? issue.assignee && filters.assignee.includes(issue.assignee._id) : true;
        const projectMatch = filters.project.length ? issue.project && filters.project.includes(issue.project._id) : true;
        const labelsMatch = filters.labels.length ? issue.labels.some(label => filters.labels.includes(label._id)) : true;

        return statusMatch && priorityMatch && assigneeMatch && projectMatch && labelsMatch;
      });
   }, [issues, filters]);

   // Group filtered issues by status
   const filteredIssuesByStatus = useMemo(() => {
      const result: Record<string, Issue[]> = {};

      status.forEach((statusItem) => {
         result[statusItem.id] = filteredIssues.filter(
            (issue) => issue.status === statusItem.id
         );
      });

      return result;
   }, [filteredIssues]);

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {status.map((statusItem) => (
               <GroupIssues
                  key={statusItem.id}
                  status={statusItem}
                  issues={filteredIssuesByStatus[statusItem.id] || []}
                  count={filteredIssuesByStatus[statusItem.id]?.length || 0}
               />
            ))}
         </div>
      </DndProvider>
   );
};

const GroupIssuesListView: FC<{
   isViewTypeGrid: boolean;
}> = ({ isViewTypeGrid = false }) => {
   const { issuesByStatus } = useIssuesStore();

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {status.map((statusItem) => (
               <GroupIssues
                  key={statusItem.id}
                  status={statusItem}
                  issues={issuesByStatus[statusItem.id] || []}
                  count={issuesByStatus[statusItem.id]?.length || 0}
               />
            ))}
         </div>
      </DndProvider>
   );
};
