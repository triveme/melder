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
// import { ReactComponent as ExcavatorIcon} from "../assets/images/logos/excavator.svg";
// import ExcavatorIcon from "../assets/images/logos/excavator.svg";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReportIcon from "@mui/icons-material/Report";
import TimelineIcon from "@mui/icons-material/Timeline";
import Excavator from "./logos/styled-excavator";
import SpaIcon from "@mui/icons-material/Spa";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ConstructionIcon from "@mui/icons-material/Construction";
import HandymanIcon from "@mui/icons-material/Handyman";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FoundationIcon from "@mui/icons-material/Foundation";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import WindPowerIcon from "@mui/icons-material/WindPower";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import PublicIcon from "@mui/icons-material/Public";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import TrafficIcon from "@mui/icons-material/Traffic";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import WavesIcon from "@mui/icons-material/Waves";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import CompareIcon from "@mui/icons-material/Compare";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";

export function Icon({ icon, props }) {
  switch (icon) {
    case "notificationImportant":
      return <NotificationImportantIcon {...props} />;
    case "renovation":
      return <FoundationIcon {...props} />;
    case "efficiency":
      return <ElectricMeterIcon {...props} />;
    case "wind":
      return <WindPowerIcon {...props} />;
    case "bike":
      return <DirectionsBikeIcon {...props} />;
    case "e_car":
      return <ElectricCarIcon {...props} />;
    case "security":
      return <PublicIcon {...props} />;
    case "city":
      return <MapsHomeWorkIcon {...props} />;
    case "traffic":
      return <TrafficIcon {...props} />;
    case "nature":
      return <NaturePeopleIcon {...props} />;
    case "climate":
      return <EmojiNatureIcon {...props} />;
    case "waves":
      return <WavesIcon {...props} />;
    case "storm":
      return <ThunderstormIcon {...props} />;
    case "compare":
      return <CompareIcon {...props} />;
    case "manageAccounts":
      return <ManageAccountsIcon {...props} />;
    case "line":
      return <TimelineIcon {...props} />;
    case "construction":
      return <ConstructionIcon {...props} />;
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
    case "spa":
      return <SpaIcon {...props} />;
    case "flower":
      return <LocalFloristIcon {...props} />;
    case "lamp":
      return <LightbulbIcon {...props} />;
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
    case "edit_pin":
      return <EditLocationAltIcon {...props} />;
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
      return <HandymanIcon {...props} />;
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
