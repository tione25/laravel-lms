import { List, ListItem } from "@chakra-ui/react";
import {
  MdOutlineSpaceDashboard,
  MdOutlineNotificationsActive,
  MdOutlineSettingsInputComposite,
  MdOutlineQuiz,
  MdOutlineCategory,
} from "react-icons/md";
import NavItem from "./NavItem";
import { CiBookmark } from "react-icons/ci";
import { PiPath } from "react-icons/pi";
import { HiOutlineUsers } from "react-icons/hi2";

const items = [
  {
    type: "header",
    label: "Main",
  },
  {
    type: "link",
    label: "Dashboard",
    icon: MdOutlineSpaceDashboard,
    path: "",
  },
  {
    type: "link",
    label: "Users",
    icon: HiOutlineUsers,
    path: "users",
  },
  {
    type: "link",
    label: "Paths",
    icon: PiPath,
    path: "paths",
  },
  {
    type: "link",
    label: "Courses",
    icon: CiBookmark,
    path: "courses",
  },
  {
    type: "link",
    label: "Quizzes",
    icon: MdOutlineQuiz,
    path: "quizzes",
  },
  {
    type: "link",
    label: "Categories",
    icon: MdOutlineCategory,
    path: "categories",
  },

  {
    type: "header",
    label: "Account",
  },

  {
    type: "link",
    label: "Notifications",
    icon: MdOutlineNotificationsActive,
    path: "",
    notifications: 24,
  },
  {
    type: "link",
    label: "Settings",
    icon: MdOutlineSettingsInputComposite,
    path: "profile",
  },
];

const Navigation = () => {
  return (
    <>
      <List w="full" my={6}>
        {items.map((item, index) => (
          <ListItem key={index} w="full">
            <NavItem item={item} isActive={index === 1} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Navigation;
