import { InfoWidget } from "../components/info-components/info-widget";
import { InfoContent } from "./content/info-content";
import { DeficiencyFAQ } from "./content/deficiency-faq";
import { BuildingFAQ } from "./content/building-faq";

import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import { ScrollContainer } from "../elements/scroll-container";

export function InfoPage() {

  return (
    <ScrollContainer>
      <InfoWidget title="Informationen" icon={<InfoIcon style={{ marginRight: 10 }} />}>
        <InfoContent />
      </InfoWidget>
      <InfoWidget title="Welche Arten von Baumaßnahmen gibt es?" icon={<HelpIcon style={{ marginRight: 10 }} />}>
        <BuildingFAQ />
      </InfoWidget>
      <InfoWidget title="Welche Arten von Mängeln gibt es?" icon={<HelpIcon style={{ marginRight: 10 }} />}>
        <DeficiencyFAQ />
      </InfoWidget>
    </ScrollContainer>
  );
}
