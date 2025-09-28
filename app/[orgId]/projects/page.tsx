'use client';

import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/projects/header';
import Projects from '@/components/common/projects/projects';
import { useState } from 'react';
import ProjectModal from '@/components/common/projects/project-modal';
import { Project } from '@/types';

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );

  const handleOpenModal = (project?: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(undefined);
    setIsModalOpen(false);
  };

  return (
    <>
      <MainLayout header={<Header onAddProject={() => handleOpenModal()} />}>
        <Projects onEditProject={handleOpenModal} />
      </MainLayout>
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
}
