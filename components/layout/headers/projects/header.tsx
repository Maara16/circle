import HeaderNav from './header-nav';
import HeaderOptions from './header-options';

interface HeaderProps {
  onAddProject: () => void;
}

export default function Header({ onAddProject }: HeaderProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <HeaderNav />
      <HeaderOptions onAddProject={onAddProject} />
    </div>
  );
}
