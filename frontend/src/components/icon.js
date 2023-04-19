import BuildIcon from "@mui/icons-material/Build";
import MenuIcon from "@mui/icons-material/Menu";
import MapIcon from "@mui/icons-material/Map";
import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ErrorIcon from "@mui/icons-material/Error";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircleIcon from "@mui/icons-material/Circle";
import RoomIcon from "@mui/icons-material/Room";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CompressIcon from "@mui/icons-material/Compress";
import WaterIcon from "@mui/icons-material/Water";
import ExpandIcon from "@mui/icons-material/Expand";
import BlockIcon from "@mui/icons-material/Block";
import FloodIcon from "@mui/icons-material/Flood";
import NoiseControlOffIcon from "@mui/icons-material/NoiseControlOff";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import SensorsIcon from "@mui/icons-material/Sensors";
import ConstructionIcon from "@mui/icons-material/Construction";
// import { ReactComponent as ExcavatorIcon} from "../assets/images/logos/excavator.svg";
// import ExcavatorIcon from "../assets/images/logos/excavator.svg";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReportIcon from "@mui/icons-material/Report";
import TimelineIcon from "@mui/icons-material/Timeline";
import Excavator from "./logos/styled-excavator";

export function Icon({ icon, props }) {
  switch (icon) {
    case "line":
      return <TimelineIcon {...props} />;
    case "arrowUp":
      return <ArrowDropUpIcon {...props} />;
    case "arrowDown":
      return <ArrowDropDownIcon {...props} />;
    case "time":
      return <AccessTimeFilledIcon {...props} />;
    case "build":
      return <BuildIcon {...props} />;
    case "menu":
      return <MenuIcon {...props} />;
    case "map":
      return <MapIcon {...props} />;
    case "info":
      return <InfoIcon {...props} />;
    case "help":
      return <HelpIcon {...props} />;
    case "search":
      return <SearchIcon {...props} />;
    case "add":
      return <AddIcon {...props} />;

    case "report":
      return <ReportIcon {...props} />;
    case "filter":
      return <FilterAltIcon {...props} />;
    case "more":
      return <MoreHorizIcon {...props} />;
    case "circle":
      return <CircleIcon {...props} />;
    case "smallCircle":
      return <NoiseControlOffIcon {...props} />;
    case "pin":
      return <RoomIcon {...props} />;
    case "storm":
      return <ThunderstormIcon {...props} />;
    case "flood":
      return <FloodIcon {...props} />;
    case "waterdamage":
      return <ExpandIcon {...props} />;
    case "move":
      return <OpenWithIcon {...props} />;
    case "list":
      return <FormatListBulletedIcon {...props} />;
    case "sensors":
      return <SensorsIcon {...props} />;
    case "narrow":
      return <CompressIcon style={{ transform: "rotate(90deg)" }} {...props} />;
    case "other":
      return <ConstructionIcon {...props} />;
    case "excavator":
      return <Excavator {...props} />;
    case "house":
      return <HomeIcon {...props} />;
    case "canal":
      return (
        <WaterIcon
          {...props}
          // sx={{ borderBottom: "2px solid", borderTop: "2px solid", margin: "5px", borderRadius: 0.7 }}
        />
      );
    case "blocked":
      return <BlockIcon {...props} />;
    case "accept":
      return <CheckIcon {...props} />;

    case "cancel":
      return <ClearIcon {...props} />;
    default:
      return <ErrorIcon {...props} />;
  }
}
