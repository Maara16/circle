'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useProjectsStore } from '@/store/projects-store';
import { toast } from 'sonner';

interface ProjectActionsProps {
  projectId: string;
  onEdit: () => void;
}

export default function ProjectActions({ projectId, onEdit }: ProjectActionsProps) {
  const { deleteProject } = useProjectsStore();

  const handleDelete = async () => {
    try {
      await deleteProject(projectId);
      toast.success('Project deleted successfully!');
    } catch (error) {
      toast.error('An error occurred while deleting the project.');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" onClick={onEdit}>
        Edit
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}