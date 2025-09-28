import HeaderNav from './header-nav';
import HeaderOptions from './header-options';

interface HeaderProps {
  onAddTeam: () => void;
}

export default function Header({ onAddTeam }: HeaderProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <HeaderNav />
      <HeaderOptions onAddTeam={onAddTeam} />
    </div>
  );
}
