export interface Team {
   id: string;
   name: string;
   icon: string;
   joined: boolean;
}

export const teams: Team[] = [
   {
      id: 'TEAM-1',
      name: 'Design',
      icon: '🎨',
      joined: true,
   },
   {
      id: 'TEAM-2',
      name: 'Engineering',
      icon: '⚙️',
      joined: true,
   },
   {
      id: 'TEAM-3',
      name: 'Marketing',
      icon: '📈',
      joined: false,
   },
];
