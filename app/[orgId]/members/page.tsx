'use client';

import Members from '@/components/common/members/members';
import Header from '@/components/layout/headers/members/header';
import MainLayout from '@/components/layout/main-layout';
import { useState } from 'react';
import MemberModal from '@/components/common/members/member-modal';
import { User } from '@/types';

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | undefined>(undefined);

  const handleOpenModal = (member?: User) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMember(undefined);
    setIsModalOpen(false);
  };

  return (
    <>
      <MainLayout header={<Header onAddMember={() => handleOpenModal()} />}>
        <Members onEditMember={handleOpenModal} />
      </MainLayout>
      <MemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        member={selectedMember}
      />
    </>
  );
}
