'use client';

import Teams from '@/components/common/teams/teams';
import Header from '@/components/layout/headers/teams/header';
import MainLayout from '@/components/layout/main-layout';
import { useState } from 'react';
import TeamModal from '@/components/common/teams/team-modal';
import { Team } from '@/types';

export default function TeamsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | undefined>(undefined);

  const handleOpenModal = (team?: Team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTeam(undefined);
    setIsModalOpen(false);
  };

  return (
    <>
      <MainLayout header={<Header onAddTeam={() => handleOpenModal()} />}>
        <Teams onEditTeam={handleOpenModal} />
      </MainLayout>
      <TeamModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        team={selectedTeam}
      />
    </>
  );
}
