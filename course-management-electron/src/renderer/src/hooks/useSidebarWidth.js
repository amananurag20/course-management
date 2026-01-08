import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";

const SIDEBAR_WIDTHS = {
  expanded: "256px",
  collapsed: "80px",
  mobile: "0px",
};

export const useSidebarWidth = () => {
  const { isGlobalSidebarOpen } = useContext(SidebarContext);

  const getContentStyle = (isMobile = false) => {
    const sidebarWidth = isMobile
      ? SIDEBAR_WIDTHS.mobile
      : isGlobalSidebarOpen
      ? SIDEBAR_WIDTHS.expanded
      : SIDEBAR_WIDTHS.collapsed;

    return {
      marginLeft: sidebarWidth,
      width: `calc(100% - ${sidebarWidth})`,
      transition: "all 0.3s ease-in-out",
    };
  };

  return {
    getContentStyle,
    sidebarWidth: isGlobalSidebarOpen
      ? SIDEBAR_WIDTHS.expanded
      : SIDEBAR_WIDTHS.collapsed,
    SIDEBAR_WIDTHS,
  };
};

export default useSidebarWidth;
