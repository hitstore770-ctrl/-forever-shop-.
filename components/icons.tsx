// Site icon set — thin wrappers around lucide-react so every icon defaults
// to the same heavy stroke weight that matches the brutalist thick borders.
// Import from here (not "lucide-react" directly) to keep that consistent;
// callers can still override strokeWidth/className per use.
import {
  BookOpen,
  Users,
  HeartHandshake,
  Calendar,
  Search,
  Download,
  Play,
  Pause,
  ChevronDown,
  Clock,
  Menu,
  X,
  ShoppingCart,
  Trash2,
  type LucideProps,
} from "lucide-react";

const THICK_STROKE = 2.5;

function withThickStroke(Icon: React.ComponentType<LucideProps>) {
  return function ThickIcon({ strokeWidth = THICK_STROKE, ...props }: LucideProps) {
    return <Icon strokeWidth={strokeWidth} {...props} />;
  };
}

export const BookIcon = withThickStroke(BookOpen);
export const UsersIcon = withThickStroke(Users);
export const HeartHandIcon = withThickStroke(HeartHandshake);
export const CalendarIcon = withThickStroke(Calendar);
export const SearchIcon = withThickStroke(Search);
export const DownloadIcon = withThickStroke(Download);
export const PlayIcon = withThickStroke(Play);
export const PauseIcon = withThickStroke(Pause);
export const ChevronDownIcon = withThickStroke(ChevronDown);
export const ClockIcon = withThickStroke(Clock);
export const MenuIcon = withThickStroke(Menu);
export const XIcon = withThickStroke(X);
export const CartIcon = withThickStroke(ShoppingCart);
export const TrashIcon = withThickStroke(Trash2);
