import HeaderNav from './header-nav';
import HeaderOptions from './header-options';

interface HeaderProps {
  onAddMember: () => void;
}

export default function Header({ onAddMember }: HeaderProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <HeaderNav />
      <HeaderOptions onAddMember={onAddMember} />
    </div>
  );
}
